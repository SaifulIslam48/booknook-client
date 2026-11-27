import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");

async function getToken(): Promise<string> {
  const { data } = await authClient.token();
  if (!data?.token) throw new ApiError(401, "Please log in again to continue.");
  return data.token;
}

export async function api<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) headers.Authorization = `Bearer ${await getToken()}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "Cannot reach the server. Please check your connection and try again.");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, data?.errors?.[0] ?? data?.message ?? "Request failed");
  }
  return data as T;
}

export async function uploadImage(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) throw new ApiError(500, "Image upload is not set up yet (missing NEXT_PUBLIC_IMGBB_KEY).");

  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body: form });
  const json = await res.json().catch(() => null);
  const url: string | undefined = json?.data?.display_url;
  if (!res.ok || !url) throw new ApiError(res.status || 500, "Image upload failed. Try a smaller image.");
  return url;
}
