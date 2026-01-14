import { Request, Response, NextFunction } from 'express';

type AsyncMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const awaitHandlerFactory = (middleware: AsyncMiddleware) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await middleware(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

export default awaitHandlerFactory;
