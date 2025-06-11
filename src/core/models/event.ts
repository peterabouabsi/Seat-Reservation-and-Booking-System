import { Schema, model, Document } from 'mongoose';

export interface IEvent extends Document {
  name: string;
}

const eventSchema = new Schema<IEvent>({
  name: { type: String, required: true },
});

export const EventModel = model<IEvent>('Event', eventSchema);
