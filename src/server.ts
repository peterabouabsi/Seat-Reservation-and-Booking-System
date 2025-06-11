import { createServer, Server } from "http";
import { Express } from 'express';

import { config } from "dotenv";
config({ path: '.env' });

// constants
import { Port } from "./core/configs/env";

// express
import Application from "./app/app";

// container
import { iocContainer } from "./core/inversify";

// types
import TYPES from "./core/inversify/types";

async function bootstrap() {
    const application = iocContainer.get<Application>(TYPES.Application);
    await application.init();
    
    const expressApp: Express = application.getExpressApp();
    const server: Server = createServer(expressApp);

    server.listen(Port, async () => {
        console.log(`Listening on port ${Port}`);
    });
}

bootstrap().catch((err) => {
    console.error("Failed to start server:", err);
});