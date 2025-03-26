import { Request, Response, NextFunction } from "express";
import { successResponse, failResponse } from "../scripts/responseStatus";
import redis from "../config/redisClient";

export const rateLimiter = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const ip = req.ip || "unknown";
        const key = `rate:${ip}`;
        console.log("key: ", key)
        const errors: any = {}
    
        const request = await redis.incr(key);
    
        if(request === 1) {
            await redis.expire(key, 60);
        }
    
        if(request > 10) {
            errors.redisFailure = `Too many requests from ${ip}`;
            failResponse(res, "Too many requests. Please try again later.", 500, errors);
            return;
        }
    
        next();
    } catch(err) {
        failResponse(res, "Internal Server Error", 500, err);
        return;
    }
}

export const getDataFromRedis = ( keyPrefix: string ) => {
    return async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const { id } = req.params;
            const cacheKey = `${keyPrefix}:${id}`;

            
            let cachedData = await redis.get(cacheKey);
            if(!cachedData) {
                next();
            } else {
                cachedData = JSON.parse(cachedData);
                successResponse(res, cachedData, "Product fetched from redis successfully", 201);
                return;
            }
        } catch (err) {
            failResponse(res, "Internal Server Error", 500, err);
            return;
        }
    }
}
