import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");

const globalForMongo = globalThis as unknown as { _booknookMongo?: MongoClient };
export const mongoClient = globalForMongo._booknookMongo ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") globalForMongo._booknookMongo = mongoClient;

export const db = mongoClient.db(process.env.DB_NAME || "booknook");
