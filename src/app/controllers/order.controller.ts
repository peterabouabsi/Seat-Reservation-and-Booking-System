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

  // Set the reservation order as paid
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