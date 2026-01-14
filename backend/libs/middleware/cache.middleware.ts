import { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache';
import logger from '../utils/logger';

const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

export interface CacheRequest extends Request {
  cacheKey?: string;
}

export const cacheMiddleware = (duration: number = 300) => {
  return (req: CacheRequest, res: Response, next: NextFunction): void => {
    if (req.method !== 'GET') {
      next();
      return;
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      logger.debug(`Cache hit for ${key}`);
      res.json(cachedResponse);
      return;
    }

    req.cacheKey = key;
    const originalJson = res.json.bind(res);

    res.json = function (body: unknown): Response {
      if (res.statusCode === 200) {
        cache.set(key, body, duration);
        logger.debug(`Cache set for ${key}`);
      }
      return originalJson(body);
    };

    next();
  };
};

export const clearCache = (pattern?: string): void => {
  if (pattern) {
    const keys = cache.keys();
    const regex = new RegExp(pattern);
    keys.forEach(key => {
      if (regex.test(key)) {
        cache.del(key);
        logger.debug(`Cache cleared for pattern: ${pattern}`);
      }
    });
  } else {
    cache.flushAll();
    logger.debug('All cache cleared');
  }
};

export default cacheMiddleware;
