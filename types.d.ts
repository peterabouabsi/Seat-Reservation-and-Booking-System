namespace NodeJS {
    interface ProcessEnv {
        PORT: string;
        NODE_ENV: 'local';

        CORS_ORIGINS: string;
        CORS_METHODS: string;
        CORS_CREDENTIALS: string;
        CORS_ALLOWED_HEADERS: string;
        CORS_EXPOSED_HEADERS: string;

        DB_URL: string;
        DB_NAME: string;

        RESERVATION_SEAT_LOCK_DURATION_MS: string;
    }
}