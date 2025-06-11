import { injectable } from "inversify";

// decorators
import { CatchError } from "../../libs/decorators/catch-error.decorator";

// interfaces
import { IOrderService } from "../../core/interfaces/order.interface";

// dtos
import { OrderPaymentDto } from "../../core/dtos/order";

// models
import { OrderModel, OrderStatus } from "../../core/models/order";

@CatchError({ enableHttpResponse: true })
@injectable()
export class OrderService implements IOrderService {
  constructor() {}

  // Assuming that the payment process is handled by an external payment gateway:
  // So it should comes between /reserve and /confirm reservation
  async pay(orderPayment: OrderPaymentDto, orderId: string): Promise<any> {
    const { customerId } = orderPayment;

    const order = await OrderModel.updateOne(
      {
        _id: orderId,
        customerID: customerId,
      },
      {
        $set: {
          status: OrderStatus.Paid
        },
      }
    );
  }
}
