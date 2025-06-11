import { IEvent } from "../models/event";

export type SelectEventDto = Pick<IEvent, '_id' | 'name'>