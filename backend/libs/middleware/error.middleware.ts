import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

type ErrorData = string | number | boolean | object | null | undefined | Array<unknown>;

interface ErrorWithStatus extends Error {
  status?: number;
  data?: ErrorData;
}

function errorMiddleware(error: ErrorWithStatus, req: Request, res: Response, next: NextFunction): void {
  const { status = 500, message, data } = error;

  logger.error(`Error: ${message || 'Internal server error'}`, {
    path: req.path,
    method: req.method,
    status,
    error: error.stack,
  });

  const errorMessage = status === 500 || !message ? 'Internal server error' : message;

  const errorResponse = {
    success: false,
    status,
    message: errorMessage,
    ...(data && { data }),
  };

  res.status(status).json(errorResponse);
}

export default errorMiddleware;
