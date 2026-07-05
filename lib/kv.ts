import { Redis } from "@upstash/redis";

export function getKv() {
  // Vercel's Upstash integration injects KV_REST_API_*; Upstash's own naming is UPSTASH_REDIS_REST_*.
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("missing KV_REST_API_* / UPSTASH_REDIS_REST_* env");
  return new Redis({ url, token });
}
