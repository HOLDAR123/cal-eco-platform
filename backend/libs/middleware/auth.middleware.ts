import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors, JwtPayload } from 'jsonwebtoken';
import config from '../configs/config';

interface TokenPayload extends JwtPayload {
  id: number;
  email?: string;
  address?: string;
  role?: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email?: string;
    address?: string;
    role?: string;
  };
  user_id?: number;
  email?: string;
  address?: string;
}

function ensureWebToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = req.headers['authorization'] as string;
  if (!token) {
    res.sendStatus(403);
    return;
  }
  jwt.verify(token, config.JWT_SECRET_KEY, function (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | string | undefined) {
    if (err || !decoded || typeof decoded === 'string') {
      res.sendStatus(403);
      return;
    }
    try {
      const payload = decoded as TokenPayload;
      if (!payload.id) {
        res.sendStatus(403);
        return;
      }
      req.user = {
        id: payload.id,
        email: payload.email,
        address: payload.address,
        role: payload.role,
      };
      req.user_id = req.user.id;
      req.email = req.user.email;
      req.address = req.user.address;
      next();
    } catch (_e) {
      res.sendStatus(403);
    }
  });
}

function ensureWebTokenForAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = req.headers['authorization'] as string;
  if (!token) {
    res.sendStatus(403);
    return;
  }
  jwt.verify(token, config.JWT_SECRET_KEY, function (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | string | undefined) {
    if (err || !decoded || typeof decoded === 'string') {
      res.sendStatus(403);
      return;
    }
    try {
      const payload = decoded as TokenPayload;
      if (!payload.id) {
        res.sendStatus(403);
        return;
      }
      req.user = {
        id: payload.id,
        email: payload.email,
        address: payload.address,
        role: payload.role,
      };
      if (req.user.role != 'cpadmin') {
        res.sendStatus(403);
        return;
      }
      next();
    } catch (_e) {
      res.sendStatus(403);
    }
  });
}

export { ensureWebToken, ensureWebTokenForAdmin };
