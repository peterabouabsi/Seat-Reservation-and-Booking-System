import { ConfirmBookingDto } from "../dtos/booking";
import { SelectEventDto } from "../dtos/event";
import { ReserveSeatsDto, SelectSeatDto } from "../dtos/seat";

export interface IEventService {
    selectSeats(eventId: string): Promise<SelectSeatDto[]>;
    selectEvents(): Promise<SelectEventDto[]>;
    reserveSeats(reserveSeats: ReserveSeatsDto, eventId: string): Promise<void>;
    confirmBooking(confirmBookingSeats: ConfirmBookingDto, eventId: string): Promise<any>;
}