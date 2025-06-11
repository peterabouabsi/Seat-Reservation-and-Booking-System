import mongoose from "mongoose";

// configs
import { DatabaseName, DatabaseUrl } from "../../core/configs/env";

// interfaces
import { IDatabaseService } from "../../core/interfaces/database.interface";

export class DatabaseService implements IDatabaseService{
  constructor() {}

  async connect(): Promise<void> {
    try {
      await mongoose.connect(`${DatabaseUrl}/${DatabaseName}`);
      console.log(`Connected to MongoDB (Mongoose) database: ${DatabaseName}`);
    } catch (err) {
      console.error("Mongoose connection error:", err);
      process.exit(1);
    }
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}
