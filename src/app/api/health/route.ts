import { mongoClient } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    await mongoClient.db().command({ ping: 1 });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}