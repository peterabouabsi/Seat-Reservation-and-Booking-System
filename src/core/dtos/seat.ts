import { ISeat } from "../models/seat";

export type SelectSeatDto = Pick<ISeat, '_id' | 'eventID' | 'name' | 'isTaken'>
export type ReserveSeatsDto = {
    customerId: string;
    seatIds: string[];
}