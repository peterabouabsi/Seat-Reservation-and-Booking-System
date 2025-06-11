import { Schema, model, Document, Types } from 'mongoose';

export enum OrderStatus {
  Paid = 'paid', 
  Pending = 'pending', 
  Failed = 'failed'
};

export interface IOrder extends Document {
  customerID: Types.ObjectId;
  amount: number;
  seatIDs: Types.ObjectId[];
  currency: string;
  status: OrderStatus;
}

const orderSchema = new Schema<IOrder>({
  customerID: { type: Schema.Types.ObjectId, required: true },
  amount: { type: Number, required: true },
  seatIDs: [{ type: Schema.Types.ObjectId, ref: 'Seat', required: true }],
  currency: { type: String, default: '$' },
  status: {
    type: String,
    enum: [OrderStatus.Pending, OrderStatus.Paid, OrderStatus.Failed],
    default: OrderStatus.Pending,
  },
});

export const OrderModel = model<IOrder>('Order', orderSchema);
