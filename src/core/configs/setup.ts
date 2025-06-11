// configs
import { CorsAllowedHeaders, CorsCredentials, CorsExposedHeaders, CorsMethods, CorsOrigin } from "./env";

export const JsonOptions = {
    limit: '10mb'
}

export const CorsConfig = {
    origin: CorsOrigin,
    methods: CorsMethods,
    credentials: CorsCredentials,
    allowedHeaders: CorsAllowedHeaders,
    exposedHeaders: CorsExposedHeaders
}