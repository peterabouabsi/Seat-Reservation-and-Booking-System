import { Schema, model, Document, Types } from 'mongoose';

export interface IReservation extends Document {
  customerID: string;
  eventID: Types.ObjectId;
  seatIDs: Types.ObjectId[];
  orderID: Types.ObjectId;
}

const reservationSchema = new Schema<IReservation>({
  customerID: { type: String, required: true },
  eventID: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  seatIDs: [{ type: Schema.Types.ObjectId, ref: 'Seat', required: true }],
  orderID: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
});

export const ReservationModel = model<IReservation>('Reservation', reservationSchema);
