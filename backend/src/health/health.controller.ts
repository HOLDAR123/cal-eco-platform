import { Request, Response } from 'express';

export const healthz = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).send({ status: 'ok' });
};

export const readyz = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).send({ status: 'ready' });
};
