import { Controller, Route, Tags, SuccessResponse, Post, Body, Middlewares, Path } from "tsoa";
import { inject, injectable } from "inversify";

// types
import TYPES from "../../core/inversify/types";
import { HttpResponse } from "../../core/types/http-response.type";

// interfaces
import { IOrderService } from "../../core/interfaces/order.interface";

// middlewares
import { orderPaymentMiddlewares } from "../../libs/middleware/endpoint.middleware";

// dtos
import { OrderPaymentDto } from "../../core/dtos/order";

@Route(`/api/orders`)
@Tags(`Orders`)
@injectable()
export class OrderController extends Controller {

  constructor(@inject(TYPES.OrderService) private _orderService: IOrderService) {
    super();
  }

  /**
   * Mark a reservation order as paid.
   * This endpoint is called after successful payment to update the order status to "Paid".
   *
   * @param orderId The ID of the order being paid
   * @param orderPayment Payment details including customerId (for testing purposes only)
   * @returns A success response indicating the order has been paid
   */
  @Middlewares(...orderPaymentMiddlewares)
  @SuccessResponse(200, 'Success')
  @Post(`/:orderId/pay`)
  async confirmBooking(@Path() orderId: string, @Body() orderPayment: OrderPaymentDto): Promise<HttpResponse> {
    await this._orderService.pay(orderPayment, orderId);

    return {
      error: false,
      message: 'Success',
      status: 200,
    };
  }

}