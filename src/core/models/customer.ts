import { Schema, model, Document } from 'mongoose';

export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
}

const customerSchema = new Schema<ICustomer>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

export const CustomerModel = model<ICustomer>('Customer', customerSchema);
