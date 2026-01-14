import express from 'express';
import * as adminController from './admin.controller';
import { ensureWebTokenForAdmin } from '../../libs/middleware/auth.middleware';
import { cacheMiddleware } from '../../libs/middleware/cache.middleware';

const router = express.Router();
router.post('/withdraw-requests', ensureWebTokenForAdmin, cacheMiddleware(60), adminController.getwithdrawrequest);
router.post('/withdraw-requests/approve', ensureWebTokenForAdmin, adminController.approvewithdrawrequest);
router.post('/withdraw-requests/reject', ensureWebTokenForAdmin, adminController.rejectwithdrawrequest);
router.get('/users', ensureWebTokenForAdmin, cacheMiddleware(120), adminController.getUserList);
router.get('/staking', ensureWebTokenForAdmin, cacheMiddleware(120), adminController.getStakingDetail);
router.get('/staking-earnings', ensureWebTokenForAdmin, cacheMiddleware(120), adminController.getStakingEarningDetail);
router.get('/deposits', ensureWebTokenForAdmin, cacheMiddleware(120), adminController.getdepositBUSDDetail);

export default router;
