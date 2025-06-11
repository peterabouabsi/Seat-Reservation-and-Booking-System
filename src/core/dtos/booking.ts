import { ReserveSeatsDto } from "./seat";

export type ConfirmBookingDto = Pick<ReserveSeatsDto, 'customerId' | 'seatIds'>;