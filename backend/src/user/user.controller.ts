import { Response, NextFunction } from 'express';
import { successResponse, errorResponse } from '../../libs/utils/response';
import logger from '../../libs/utils/logger';
import { AuthRequest } from '../../libs/middleware/auth.middleware';
import { UpdateMeRequest } from '../../libs/types';
import { UserService } from './user.service';

const userService = new UserService();

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.address) {
      const { response, statusCode } = errorResponse('Address not found', 400);
      res.status(statusCode).json(response);
      return;
    }

    const result = await userService.getMe(req.address);

    if (result.success && result.data) {
      const { response, statusCode } = successResponse(result.data, result.message);
      res.status(statusCode).json(response);
    } else {
      const { response, statusCode } = errorResponse(result.message || 'User not found', 404);
      res.status(statusCode).json(response);
    }
  } catch (error) {
    logger.error('Get user error:', error);
    next(error);
  }
};

export const updateMe = async (_req: UpdateMeRequest, res: Response): Promise<void> => {
  const { response, statusCode } = errorResponse('Not implemented', 501);
  res.status(statusCode).json(response);
};
