import { Redis } from "@upstash/redis";

export function getKv() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("missing UPSTASH_REDIS_REST_* env");
  return new Redis({ url, token });
}
