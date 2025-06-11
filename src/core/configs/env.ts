// utils
import { split } from "../../utils/string";

export const Port = Number(process.env.PORT);
export const NodeEnv = String(process.env.NODE_ENV);

export const CorsOrigin = split(process.env.CORS_ORIGINS);
export const CorsMethods = split(process.env.CORS_METHODS);
export const CorsCredentials = Boolean(process.env.CORS_CREDENTIALS);
export const CorsAllowedHeaders = split(process.env.CORS_ALLOWED_HEADERS);
export const CorsExposedHeaders = split(process.env.CORS_EXPOSED_HEADERS);

export const DatabaseUrl = process.env.DB_URL;
export const DatabaseName = process.env.DB_NAME;

export const ReservationSeatLockDurationMs = Number(process.env.RESERVATION_SEAT_LOCK_DURATION_MS);