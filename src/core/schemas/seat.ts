import Joi from "joi";

// configs
import { ValidationKeys } from "../configs/validation";

// dtos
import { ReserveSeatsDto } from "../dtos/seat";

export const reserveSeatsSchema = Joi.object<ReserveSeatsDto>({
    customerId: Joi.string()
    .required()
    .label(`Customer ID`)
    .messages({
      [ValidationKeys.REQUIRED]: '{#label} is required.',
      [ValidationKeys.STRING]: '{#label} must be a string.',
    }),

  seatIds: Joi.array().items(Joi.string().messages({ [ValidationKeys.STRING]: 'Each seat ID must be a string.', }))
  .min(1)
  .required()
  .label(`Seat IDs`)
  .messages({
      [ValidationKeys.REQUIRED]: '{#label} are required.',
      [ValidationKeys.ARRAY]: '{#label} must be an array.',
      [ValidationKeys.ARRAY_EMPTY]: '{#label} cannot be empty.',
      [ValidationKeys.ARRAY_MIN]: '{#label} must contain at least {#limit} seat ID.',
    }),
});