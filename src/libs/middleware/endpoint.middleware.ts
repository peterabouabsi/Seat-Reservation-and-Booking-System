// schemas
import { confirmBookingSchema } from "../../core/schemas/booking";
import { orderPaymentSchema } from "../../core/schemas/order";
import { reserveSeatsSchema } from "../../core/schemas/seat";

// combine middlewares
import { bodyValidation } from "./validation/validation";

export const reserveSeatsMiddlewares = [bodyValidation(reserveSeatsSchema)]
export const confirmBookingMiddlewares = [bodyValidation(confirmBookingSchema)]
export const orderPaymentMiddlewares = [bodyValidation(orderPaymentSchema)]