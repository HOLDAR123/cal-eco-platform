import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, validationErrorResponse } from '../../libs/utils/response';
import logger from '../../libs/utils/logger';
import { AuthRequest } from '../../libs/middleware/auth.middleware';
import { AuthService } from './auth.service';

const authService = new AuthService();

export const loginWithSignature = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { address, signature, referral_address } = req.body;

    if (!address || !signature) {
      const { response, statusCode } = validationErrorResponse('Address and signature are required');
      res.status(statusCode).json(response);
      return;
    }

    const result = await authService.loginWithSignature(address, signature, referral_address);

    if (result.success && result.data) {
      const { response, statusCode } = successResponse(result.data, result.message);
      res.status(statusCode).json(response);
    } else {
      const { response, statusCode } = errorResponse(result.message || 'Login failed', 401);
      res.status(statusCode).json(response);
    }
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user_id || !req.address) {
      const { response, statusCode } = errorResponse('User not authenticated', 401);
      res.status(statusCode).json(response);
      return;
    }

    const result = await authService.getMe(req.user_id, req.address);

    if (result.success && result.data) {
      const { response, statusCode } = successResponse(result.data, result.message);
      res.status(statusCode).json(response);
    } else {
      const { response, statusCode } = errorResponse(result.message || 'User not found', 404);
      res.status(statusCode).json(response);
    }
  } catch (error) {
    logger.error('Get me error:', error);
    next(error);
  }
};

export const refresh = async (_req: Request, res: Response): Promise<void> => {
  const { response, statusCode } = errorResponse('Not implemented', 501);
  res.status(statusCode).json(response);
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  const { response, statusCode } = successResponse(null, 'Logout successful');
  res.status(statusCode).json(response);
};
