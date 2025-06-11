import { Container } from "inversify";

// types
import TYPES from "./types";

// services
import { DatabaseService } from "../../libs/services/database.service";
import { EventService } from "../../app/services/event.service";
import { OrderService } from "../../app/services/order.service";

// interfaces
import { IDatabaseService } from "../interfaces/database.interface";
import { IEventService } from "../interfaces/event.interface";
import { IOrderService } from "../interfaces/order.interface";

// controllers
import { EventController } from "../../app/controllers/event.controller";
import { OrderController } from "../../app/controllers/order.controller";

// root app
import Application from "../../app/app";

export const iocContainer = new Container();

/**
 * What does `inSingletonScope()` do?
 * -----------------------------------
 * It tells Inversify to only create **one instance** of the class for the entire app.
 * Every time you request it from the container (e.g. container.get<MyService>(TYPES.MyService)), you’ll get the same instance.
 * 
 * This is useful for:
 * - Services that hold shared state (e.g., database connections, token utilities)
 * - Avoiding unnecessary object creation
 * - Ensuring consistent behavior across the app
*/

// root
// .inSingletonScope() ensures only one instance of Application is created and reused
iocContainer.bind<Application>(TYPES.Application).to(Application).inSingletonScope();

// bind services
// Singleton scope is useful here to avoid multiple instances of these services
// For example, TokenService or DatabaseService might maintain internal state or connections
iocContainer.bind<IDatabaseService>(TYPES.DatabaseService).to(DatabaseService).inSingletonScope();
iocContainer.bind<IEventService>(TYPES.EventService).to(EventService).inSingletonScope();
iocContainer.bind<IOrderService>(TYPES.OrderService).to(OrderService).inSingletonScope();

// bind controllers
// Controllers are typically stateless so binding toSelf() is enough
iocContainer.bind<EventController>(EventController).toSelf();
iocContainer.bind<OrderController>(OrderController).toSelf();