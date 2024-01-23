
import { Redis } from '@upstash/redis';

const redis = () => new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const cacheGet = async (key: string) => await redis().get('foo');

export const cacheSet = async (
  key: string,
  val: string | number | boolean | null
) => await redis().set(key, val);
