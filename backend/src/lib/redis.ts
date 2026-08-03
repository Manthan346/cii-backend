import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL!,);


redis.on("connect", () => console.log("Connected"));
redis.on("ready", () => console.log("Ready"));
redis.on("close", () => console.log("Closed"));
redis.on("error", (err) => console.error(err));

//expiry time for data
export const CANDIDATE_REDIS_CACHE = 60 * 10;