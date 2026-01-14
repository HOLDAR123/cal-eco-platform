import { Response, NextFunction } from 'express';
import { successResponse, validationErrorResponse } from '../../libs/utils/response';
import logger from '../../libs/utils/logger';
import { AuthRequest } from '../../libs/middleware/auth.middleware';
import { TicketService } from './ticket.service';

const ticketService = new TicketService();

export const create = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { subject } = req.body;
    const result = await ticketService.create(req.user_id || 0, subject);

    if (result.success && result.id) {
      const { response, statusCode } = successResponse({ id: result.id }, result.message);
      res.status(statusCode).json(response);
    } else {
      const { response, statusCode } = validationErrorResponse(result.message || 'Failed to create ticket');
      res.status(statusCode).json(response);
    }
  } catch (error) {
    logger.error('Create ticket error:', error);
    next(error);
  }
};

export const list = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await ticketService.list(req.user_id || 0);
    const { response, statusCode } = result.success
      ? successResponse(result.data, result.message)
      : validationErrorResponse(result.message || 'Failed to get tickets');
    res.status(statusCode).json(response);
  } catch (error) {
    logger.error('List tickets error:', error);
    next(error);
  }
};

export const messages = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await ticketService.getMessages(parseInt(id));
    const { response, statusCode } = result.success
      ? successResponse(result.data, result.message)
      : validationErrorResponse(result.message || 'Failed to get messages');
    res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Get ticket messages error:', error);
    next(error);
  }
};

export const addMessage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const result = await ticketService.addMessage(parseInt(id), req.user_id || 0, message);

    const { response, statusCode } = result.success
      ? successResponse(null, result.message)
      : validationErrorResponse(result.message || 'Failed to add message');
    res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Add message error:', error);
    next(error);
  }
};
