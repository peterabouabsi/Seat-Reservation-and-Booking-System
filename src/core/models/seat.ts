import { model, Schema, Document, Types } from 'mongoose';

export interface ISeat extends Document {
  eventID: Types.ObjectId;
  name: string;
  isTaken: boolean;
  amount: number;
  lockedBy: Types.ObjectId | null;
  lockedUntil: Date | null;
}

const SeatSchema = new Schema<ISeat>({
  eventID: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  isTaken: { type: Boolean, required: true, default: false },
  amount: { type: Number, required: true },
  lockedBy: { type: Schema.Types.ObjectId, ref: 'Customer', default: null },
  lockedUntil: { type: Date, default: null }
});

export const SeatModel = model<ISeat>('Seat', SeatSchema);