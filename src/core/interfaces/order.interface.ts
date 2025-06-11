import { OrderPaymentDto } from "../dtos/order";

export interface IOrderService {
    pay(orderPayment: OrderPaymentDto, orderId: string): Promise<any>;
}