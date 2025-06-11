const TYPES = {
    // application
    Application: Symbol.for("Application"),
    
    // services
    DatabaseService: Symbol.for("DatabaseService"),
    EventService: Symbol.for("EventService"),
    OrderService: Symbol.for("OrderService"),
    
    // controllers
    EventController: Symbol.for("EventController")
};
  
export default TYPES;  