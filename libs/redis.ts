/*
  See Upstash Redis docs at: https://upstash.com/docs/oss/sdks/ts/redis/getstarted
*/

import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const cacheGet = async (key: string) => await redis.get('foo');

export const cacheSet = async (
  key: string,
  val: string | number | boolean | null
) => await redis.set(key, val);
