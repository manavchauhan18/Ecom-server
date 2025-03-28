import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisHost = process.env.REDIS_HOST as string;
const redisPort = process.env.REDIS_PORT as unknown as number;

const redis = new Redis({
    host: redisHost,
    port: redisPort,
    retryStrategy(times) {
        return Math.min(times * 50, 2000);
    },
});

redis.on("connect", () => console.log("Redis connected!"));
redis.on("error", (err) => console.error("Redis error: ", err));

export default redis;