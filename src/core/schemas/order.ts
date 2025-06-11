import Joi from "joi";

// configs
import { ValidationKeys } from "../configs/validation";

// dtos
import { OrderPaymentDto } from "../dtos/order";

export const orderPaymentSchema = Joi.object<OrderPaymentDto>({
    customerId: Joi.string()
    .required()
    .label(`Customer ID`)
    .messages({
      [ValidationKeys.REQUIRED]: '{#label} is required.',
      [ValidationKeys.STRING]: '{#label} must be a string.',
    })
});