import { Controller, Route, Path, Tags, SuccessResponse, Get, Post, Body, Middlewares } from "tsoa";
import { inject, injectable } from "inversify";

// types
import TYPES from "../../core/inversify/types";
import { HttpResponse } from "../../core/types/http-response.type";

// schemas
import { ReserveSeatsDto, SelectSeatDto } from "../../core/dtos/seat";
import { SelectEventDto } from "../../core/dtos/event";
import { ConfirmBookingDto } from "../../core/dtos/booking";

// interfaces
import { IEventService } from "../../core/interfaces/event.interface";

// middlewares
import { confirmBookingMiddlewares, reserveSeatsMiddlewares } from "../../libs/middleware/endpoint.middleware";

@Route(`/api/events`)
@Tags(`Events`)
@injectable()
export class EventController extends Controller {

  constructor(@inject(TYPES.EventService) private _eventService: IEventService) {
    super();
  }

   /**
   * Fetch all available events.
   * This endpoint returns a list of all events that users can view and book tickets for.
   * @returns A list of events
   */
  @SuccessResponse(200, 'Success')
  @Get(`/`)
  async selectEvents(): Promise<HttpResponse<SelectEventDto[]>> {
    const events: SelectEventDto[] = await this._eventService.selectEvents();

    return {
      error: false,
      message: 'Success',
      status: 200,
      data: events,
    };
  }

  /**
   * Get seat availability for an event.
   * This endpoint returns all seats for a specific event, including availability.
   * 
   * @param eventId The ID of the event
   * @returns A list of seats
   */
  @SuccessResponse(200, 'Success')
  @Get(`/:eventId/seats`)
  async selectSeats(@Path() eventId: string): Promise<HttpResponse<SelectSeatDto[]>> {
    const seats: SelectSeatDto[] = await this._eventService.selectSeats(eventId);

    return {
      error: false,
      message: 'Success',
      status: 200,
      data: seats,
    };
  }

  /**
   * Reserve selected seats for an event.
   * Temporarily locks the specified seats to prevent other users from booking them before payment.
   *
   * @param eventId The ID of the event
   * @param reserveSeats An object containing seat IDs and customer ID
   * @returns A response indicating whether the reservation was successful
   */
  @Middlewares(...reserveSeatsMiddlewares)
  @SuccessResponse(202, 'Success')
  @Post(`/:eventId/seats/reserve`)
  async reserveSeats(@Path() eventId: string, @Body() reserveSeats: ReserveSeatsDto): Promise<HttpResponse> {
    await this._eventService.reserveSeats(reserveSeats, eventId);

    return {
      error: false,
      message: 'Success',
      status: 200
    };
  }

  /**
   * Confirm the booking after payment.
   * Marks the reserved seats as officially booked and removes any temporary locks.
   *
   * @param eventId The ID of the event
   * @param confirmBookingSeats Object containing seat IDs and order info
   * @returns A response confirming the booking
   */
  @Middlewares(...confirmBookingMiddlewares)
  @SuccessResponse(200, 'Success')
  @Post(`/:eventId/seats/confirm`)
  async confirmBooking(@Path() eventId: string, @Body() confirmBookingSeats: ConfirmBookingDto): Promise<HttpResponse> {
    await this._eventService.confirmBooking(confirmBookingSeats, eventId);

    return {
      error: false,
      message: 'Booking confirmed',
      status: 200,
    };
  }
}