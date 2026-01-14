import express, { Request, Response } from 'express';
import path from 'path';
import { ensureWebToken, ensureWebTokenForAdmin } from '../libs/middleware/auth.middleware';
import registerController from './register/register.controller';
import * as adminController from './admin';
import v1AuthRoutes from './auth/routes';
import v1UserRoutes from './user/routes';
import v1WalletRoutes from './wallet/routes';
import v1StakingRoutes from './staking/routes';
import v1TransactionRoutes from './transaction/routes';
import v1WithdrawalRoutes from './withdrawal/routes';
import v1ReferralRoutes from './referral/routes';
import v1PlanRoutes from './plan/routes';
import v1NotificationRoutes from './notification/routes';
import v1TicketRoutes from './ticket/routes';
import v1AdminRoutes from './admin/routes';
import v1WebhookRoutes from './webhook/routes';
import v1HealthRoutes from './health/routes';
import { cacheMiddleware } from '../libs/middleware/cache.middleware';

const router = express.Router();
router.post('/userregister', registerController.userRegister);
router.get('/getplandetail', cacheMiddleware(300), registerController.getPlanDetails);
router.post('/busddeposit', ensureWebToken, registerController.depositBUSD);
router.post('/gettransactionhistory', ensureWebToken, cacheMiddleware(60), registerController.getTransactionHistory);
router.post('/addStaking', ensureWebToken, registerController.addStaking);
router.post('/getstakingHistory', ensureWebToken, cacheMiddleware(120), registerController.getStakingHistory);
router.post('/singalclaimreward', ensureWebToken, registerController.SingalClaimReward);
router.post('/sellplan', ensureWebToken, registerController.SellPlan);
router.post('/gettotalbalance', ensureWebToken, cacheMiddleware(60), registerController.getTotalBalance);
router.post('/getreferraluserslist', cacheMiddleware(120), registerController.getReferralUsersList);
router.post('/getwithdrawhistory', ensureWebToken, cacheMiddleware(60), registerController.getWithdrawHistory);
router.post('/gettotalinvasted', cacheMiddleware(300), registerController.getTotalInvested);
router.post('/withdrawcrypto', ensureWebToken, registerController.WithdrawCrypto);
router.post('/getwithdrawrequest', ensureWebTokenForAdmin, cacheMiddleware(60), adminController.getwithdrawrequest);
router.post('/approvewithdrawrequest', ensureWebTokenForAdmin, adminController.approvewithdrawrequest);
router.post('/rejectwithdrawrequest', ensureWebTokenForAdmin, adminController.rejectwithdrawrequest);
router.get('/getuserlist', ensureWebTokenForAdmin, cacheMiddleware(120), adminController.getUserList);
router.get('/getstakingdetail', ensureWebTokenForAdmin, cacheMiddleware(120), adminController.getStakingDetail);
router.get('/getstakingearningdetail', ensureWebTokenForAdmin, cacheMiddleware(120), adminController.getStakingEarningDetail);
router.get('/getdepositbusd', ensureWebTokenForAdmin, cacheMiddleware(120), adminController.getdepositBUSDDetail);
router.get('/images/:image', cacheMiddleware(3600), (req: Request, res: Response) => {
  const imagePath = path.resolve(process.cwd(), 'uploads', req.params.image);
  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).json({ success: false, message: 'Image not found' });
    }
  });
});

router.use('/v1/auth', v1AuthRoutes);
router.use('/v1/users', v1UserRoutes);
router.use('/v1/wallets', v1WalletRoutes);
router.use('/v1/staking', v1StakingRoutes);
router.use('/v1/transactions', v1TransactionRoutes);
router.use('/v1/withdrawals', v1WithdrawalRoutes);
router.use('/v1/referrals', v1ReferralRoutes);
router.use('/v1/plans', v1PlanRoutes);
router.use('/v1/notifications', v1NotificationRoutes);
router.use('/v1/tickets', v1TicketRoutes);
router.use('/v1/admin', v1AdminRoutes);
router.use('/v1/webhooks', v1WebhookRoutes);
router.use('/v1', v1HealthRoutes);

router.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

export { router as routes };
