import { injectable } from "inversify";
import { Types } from "mongoose";

// configs
import { ReservationSeatLockDurationMs } from "../../core/configs/env";

import createError from "http-errors";

// interfaces
import { IEventService } from "../../core/interfaces/event.interface";

// decorators
import { CatchError } from "../../libs/decorators/catch-error.decorator";

// models
import { SeatModel } from "../../core/models/seat";
import { EventModel } from "../../core/models/event";
import { OrderModel } from "../../core/models/order";
import { ReservationModel } from "../../core/models/reservation";

// schemas
import { ReserveSeatsDto, SelectSeatDto } from "../../core/dtos/seat";
import { ConfirmBookingDto } from "../../core/dtos/booking";

@CatchError({ enableHttpResponse: true })
@injectable()
export class EventService implements IEventService {
  constructor() {}

  async selectEvents(): Promise<any[]> {
    return await EventModel.find().lean();
  }

  async selectSeats(eventId: string): Promise<SelectSeatDto[]> {
    return await SeatModel.find({
      eventID: new Types.ObjectId(eventId),
    }).lean();
  }

  async reserveSeats(
    reserveSeats: ReserveSeatsDto,
    eventId: string
  ): Promise<void> {
    const { seatIds, customerId } = reserveSeats;

    // Step 2: Prepare IDs and Lock Expiration Time ---
    const customerObjectId = new Types.ObjectId(customerId);
    const eventObjectId = new Types.ObjectId(eventId);
    const seatObjectIds = seatIds.map((id) => new Types.ObjectId(id));

    const lockedUntil = new Date(Date.now() + ReservationSeatLockDurationMs);

    // Step 3: Start a Database Transaction ---
    const session = await SeatModel.startSession();
    session.startTransaction();

    // Step 4: Find & Verify Seat Availability (First Check) ---
    const seatsToLock = await SeatModel.find({
      _id: { $in: seatObjectIds },
      eventID: eventObjectId,
      isTaken: false,
      $or: [{ lockedBy: null }, { lockedUntil: { $lte: new Date() } }],
    }).session(session);

    // Step 5: Check if ALL requested seats were found and truly available ---
    if (seatsToLock.length !== seatIds.length) {
      await session.abortTransaction();
      session.endSession();

      throw createError.Conflict(
        `One or more selected seats are no longer available or are currently locked.`
      );
    }

    // Step 6: Attempt to Atomically Lock the Seats ---
    const updateResult = await SeatModel.updateMany(
      {
        _id: { $in: seatObjectIds },
        eventID: eventObjectId,
        isTaken: false,
        $or: [{ lockedBy: null }, { lockedUntil: { $lte: new Date() } }],
      },
      {
        $set: {
          lockedBy: customerObjectId,
          lockedUntil: lockedUntil,
        },
      },
      { session: session }
    );

    const amount = seatsToLock.reduce(
      (sum, seat) => sum + (seat.amount || 0),
      0
    );

    // Step 7: Create a new order with status "pending" ---
    const order = await OrderModel.create(
      [
        {
          customerID: customerObjectId,
          amount,
          seatIDs: seatObjectIds,
        },
      ],
      { session }
    );

    // Step 8: Commit the Transaction ---
    await session.commitTransaction();
    session.endSession();
  }

  async confirmBooking(
    confirmBookingSeats: ConfirmBookingDto,
    eventId: string
  ): Promise<any> {
    const { customerId, seatIds } = confirmBookingSeats;

    const customerObjectId = new Types.ObjectId(customerId);
    const eventObjectId = new Types.ObjectId(eventId);
    const seatObjectIds = seatIds.map((id) => new Types.ObjectId(id));

    // Step 1: Find and verify the corresponding paid order ---
    const paidOrder = await OrderModel.findOne({
      customerID: customerObjectId,
      status: "paid",
    });

    if (!paidOrder) {
      throw createError.PaymentRequired("Payment is not completed yet.");
    }

    const now = new Date();
    const session = await SeatModel.startSession();
    session.startTransaction();

    // Step 2: Re-validate seat lock ---
    // When a user selects seats and they get locked, it’s a temporary hold to prevent others from booking them.
    // But the payment process might take some time — maybe seconds, minutes, or even longer if you’re waiting for external payment confirmation.
    // During that delay:
    //   - The lock could expire (if your lock duration is short).
    //   - Or something else could go wrong (e.g., server crash, user cancels).
    // So before finalizing the seats as “taken” and confirming the reservation, we must:
    //   - Check if the seats are still locked by this user.
    //   - Check if the lock hasn’t expired.
    //   - Check if they haven’t already been taken by some other process.
    const lockedSeats = await SeatModel.find({
      _id: { $in: seatObjectIds },
      eventID: eventObjectId,
      isTaken: false,
      lockedBy: customerObjectId,
      lockedUntil: { $gt: now },
    }).session(session);

    if (lockedSeats.length !== seatIds.length) {
      await session.abortTransaction();
      session.endSession();
      throw createError.Conflict(
        "Some seats are no longer locked or already taken."
      );
    }

    // Step 3: Mark seats as taken ---
    await SeatModel.updateMany(
      { _id: { $in: seatObjectIds } },
      {
        $set: { isTaken: true },
        $unset: { lockedBy: "", lockedUntil: "" },
      },
      { session }
    );

    // Step 4: Create reservation record ---
    await ReservationModel.create(
      [
        {
          customerID: customerId,
          eventID: eventObjectId,
          seatIDs: seatObjectIds,
          orderID: paidOrder._id,
        },
      ],
      { session }
    );

    // Step 5: Commit ---
    await session.commitTransaction();
    session.endSession();
  }
}
