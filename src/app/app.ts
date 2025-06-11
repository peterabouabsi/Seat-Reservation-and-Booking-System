import express, { Express } from 'express';
import { inject } from 'inversify';

import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import catchError from '../libs/middleware/error/catch-error';

import TYPES from '../core/inversify/types';

//swagger
import swaggerUi from 'swagger-ui-express';

// routes
import { RegisterRoutes } from './routers/routes';

// constants
import { CorsConfig, JsonOptions } from '../core/configs/setup';

import swaggerDocument from '../../swagger/swagger.json';

// services
import { IDatabaseService } from '../core/interfaces/database.interface';

export class Application {
    private readonly app: Express;

    constructor(
        @inject(TYPES.DatabaseService) private readonly iDatabaseService: IDatabaseService,
    ) {
        this.app = express();
        this.setupMiddlewares();
    }

    public async init(): Promise<void> {
        await this.iDatabaseService.connect();

        RegisterRoutes(this.app);
        this.app.use(catchError);
    }

    private setupMiddlewares(): void {
        this.app.use(express.json(JsonOptions));
        this.app.use(cors(CorsConfig));
        this.app.use(helmet());
        this.app.use(cookieParser());
        this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    public getExpressApp(): Express {
        return this.app;
    }
}

export default Application;