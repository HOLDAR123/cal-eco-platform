import { Response, NextFunction, Request } from 'express';
import { successResponse, errorResponse } from '../../libs/utils/response';
import logger from '../../libs/utils/logger';
import { AdminRequest } from '../../libs/types';
import { AdminService } from './admin.service';

const adminService = new AdminService();

export const getwithdrawrequest = async (_req: AdminRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await adminService.getWithdrawRequests();
    const { response, statusCode } = result.success
      ? successResponse(result.data, result.message)
      : errorResponse(result.message || 'Failed to get withdraw requests', 500);
    res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Get withdraw request error:', error);
    next(error);
  }
};

export const approvewithdrawrequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await adminService.approveWithdrawRequest(req.body.id, req.body.hash);
    const { response, statusCode } = result.success
      ? successResponse(null, result.message)
      : errorResponse(result.message || 'Failed to approve withdraw request', 400);
    res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Approve withdraw request error:', error);
    next(error);
  }
};

export const rejectwithdrawrequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await adminService.rejectWithdrawRequest(req.body.request_id, req.body.user_id, req.body.token_amount);
    const { response, statusCode } = result.success
      ? successResponse(null, result.message)
      : errorResponse(result.message || 'Failed to reject withdraw request', 400);
    res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Reject withdraw request error:', error);
    next(error);
  }
};

export const getUserList = async (_req: AdminRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await adminService.getUserList();
    const { response, statusCode } = result.success
      ? successResponse(result.data, result.message)
      : errorResponse(result.message || 'Failed to get user list', 500);
    res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Get user list error:', error);
    next(error);
  }
};

export const getStakingDetail = async (_req: AdminRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await adminService.getStakingDetail();
    const { response, statusCode } = result.success
      ? successResponse(result.data, result.message)
      : errorResponse(result.message || 'Failed to get staking detail', 500);
    res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Get staking detail error:', error);
    next(error);
  }
};

export const getStakingEarningDetail = async (_req: AdminRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await adminService.getStakingEarningDetail();
    const { response, statusCode } = result.success
      ? successResponse(result.data, result.message)
      : errorResponse(result.message || 'Failed to get staking earning detail', 500);
    res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Get staking earning detail error:', error);
    next(error);
  }
};

export const getdepositBUSDDetail = async (_req: AdminRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await adminService.getDepositBUSDDetail();
    const { response, statusCode } = result.success
      ? successResponse(result.data, result.message)
      : errorResponse(result.message || 'Failed to get deposit BUSD detail', 500);
    res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Get deposit BUSD detail error:', error);
    next(error);
  }
};
