import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import logger from '../utils/logger';

export const createThrottle = (
  windowMs: number = 15 * 60 * 1000,
  max: number = 100,
  message?: string
) => {
  return rateLimit({
    windowMs,
    max,
    message: message || 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
      res.status(429).json({
        success: false,
        message: message || 'Too many requests from this IP, please try again later.',
      });
    },
  });
};

export const apiLimiter = createThrottle(15 * 60 * 1000, 100, 'Too many API requests, please try again later.');

export const authLimiter = createThrottle(15 * 60 * 1000, 5, 'Too many authentication attempts, please try again later.');

export const strictLimiter = createThrottle(15 * 60 * 1000, 10, 'Too many requests, please try again later.');

export default apiLimiter;
