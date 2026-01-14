import { Request, Response, NextFunction } from 'express';
import { forbiddenResponse } from '../../libs/utils/response';
import logger from '../../libs/utils/logger';
import { AuthRequest } from '../../libs/middleware/auth.middleware';
import { RegisterService } from './register.service';

const registerService = new RegisterService();

export const userRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await registerService.userRegister(req.body.address, req.body.signature, req.body.referral_address);

    if (result.success && result.data) {
      res.status(200).send({
        success: result.success,
        msg: result.msg,
        data: result.data
      });
    } else {
      if (result.msg && result.msg.includes('blocked')) {
        const { response, statusCode } = forbiddenResponse(result.msg);
        res.status(statusCode).json(response);
      } else {
        res.status(200).send({
          success: result.success,
          msg: result.msg
        });
      }
    }
  } catch (error) {
    logger.error('User registration error:', error);
    next(error);
  }
};

export const getTransactionHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await registerService.getTransactionHistory(req.user_id || 0);
    res.status(200).send({
      success: result.success,
      msg: result.msg,
      data: result.data
    });
  } catch (err) {
    res.status(200).send({
      success: false,
      msg: "User not registered due to internal error",
      err
    });
  }
};

export const getWithdrawHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await registerService.getWithdrawHistory(req.user_id || 0);
    res.status(200).send({
      success: result.success,
      msg: result.msg,
      data: result.data
    });
  } catch (err) {
    res.status(200).send({
      success: false,
      msg: "User not registered due to internal error",
      err
    });
  }
};

export const getReferralUsersList = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await registerService.getReferralUsersList(req.user_id || 0);
    res.status(200).send({
      success: result.success,
      msg: result.msg,
      data: result.data
    });
  } catch (err) {
    res.status(200).send({
      success: false,
      msg: "User not registered due to internal error",
      err
    });
  }
};

export const getPlanDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await registerService.getPlanDetails();
    res.status(200).send({
      success: result.success,
      msg: result.msg,
      data: result.data
    });
  } catch (err) {
    res.status(200).send({
      success: false,
      msg: "User not registered due to internal error",
      err
    });
  }
};

export const depositBUSD = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await registerService.depositBUSD(
      req.user_id || 0,
      req.address || '',
      req.body.busd_amount,
      req.body.hash
    );
    res.status(200).send({
      success: result.success,
      msg: result.msg
    });
  } catch (err) {
    res.status(200).send({
      success: false,
      msg: "User not registered due to internal error",
      err
    });
  }
};

export const addStaking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await registerService.addStaking(
      req.user_id || 0,
      req.address || '',
      req.body.staking_period_id,
      req.body.quantity,
      req.body.busd_amount,
      req.body.hash
    );
    res.status(200).send({
      success: result.success,
      msg: result.msg
    });
  } catch (err) {
    logger.error('Add staking error:', err);
    res.status(200).send({
      success: false,
      msg: "User not registered due to internal error",
      err
    });
  }
};

export const usersStakingIncome = async (): Promise<void> => {
  await registerService.usersStakingIncome();
};

export const getStakingHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await registerService.getStakingHistory(req.user_id || 0);
    res.status(200).send({
      success: result.success,
      msg: result.msg,
      data: result.data
    });
  } catch (err) {
    res.status(200).send({
      success: false,
      msg: "User not registered due to internal error",
      err
    });
  }
};

export const SingalClaimReward = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await registerService.singalClaimReward(
      req.user_id || 0,
      req.body.staking_id,
      req.body.staking_period_id
    );
    res.status(200).send({
      success: result.success,
      msg: result.msg
    });
  } catch (err) {
    res.status(200).send({
      success: false,
      msg: "Something went wrong please try again."
    });
  }
};

export const SellPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await registerService.sellPlan(
      req.user_id || 0,
      req.body.staking_id,
      req.body.staking_period_id
    );
    res.status(200).send({
      success: result.success,
      msg: result.msg
    });
  } catch (err) {
    logger.error('Sell plan error:', err);
    res.status(200).send({
      success: false,
      msg: "User not registered due to internal error",
      err
    });
  }
};

export const getTotalBalance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await registerService.getTotalBalance(req.user_id || 0);
    res.status(200).send({
      success: result.success,
      msg: result.msg,
      data: result.data,
      data1: result.data1
    });
  } catch (err) {
    res.status(200).send({
      success: false,
      msg: "User not registered due to internal error",
      err
    });
  }
};

export const getTotalInvested = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await registerService.getTotalInvested();
    res.status(200).send({
      success: result.success,
      msg: result.msg,
      data: result.data
    });
  } catch (err) {
    res.status(200).send({
      success: false,
      msg: "User not registered due to internal error",
      err
    });
  }
};

export const WithdrawCrypto = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await registerService.withdrawCrypto(
      req.user_id || 0,
      req.address || '',
      req.body.token
    );
    res.status(200).send({
      success: result.success,
      msg: result.msg
    });
  } catch (error) {
    logger.error('Withdraw crypto error:', error);
    next(error);
  }
};

export const userBUSDDepositCheck = async (): Promise<void> => {
  await registerService.userBUSDDepositCheck();
};

export default {
  userRegister,
  getTransactionHistory,
  getWithdrawHistory,
  getReferralUsersList,
  getPlanDetails,
  depositBUSD,
  addStaking,
  usersStakingIncome,
  getStakingHistory,
  SingalClaimReward,
  SellPlan,
  getTotalBalance,
  getTotalInvested,
  WithdrawCrypto,
  userBUSDDepositCheck,
};
