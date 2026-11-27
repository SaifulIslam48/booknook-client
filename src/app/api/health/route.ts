import { MongoClient } from "mongodb";
import { mongoClient } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const out: Record<string, unknown> = {};

  try {
    await mongoClient.db().command({ ping: 1 });
    out.shared = "ok";
  } catch (e) {
    out.shared = String(e);
  }

  const fresh = new MongoClient(process.env.MONGODB_URI as string, {
    serverSelectionTimeoutMS: 8000,
  });
  try {
    await fresh.db(process.env.DB_NAME || "booknook").command({ ping: 1 });
    out.fresh = "ok";
  } catch (e) {
    out.fresh = String(e);
  } finally {
    await fresh.close();
  }

  return Response.json(out);
}