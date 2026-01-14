import express from 'express';
import * as authController from './auth.controller';
import { ensureWebToken } from '../../libs/middleware/auth.middleware';
import { authLimiter } from '../../libs/middleware/throttle.middleware';
import { cacheMiddleware } from '../../libs/middleware/cache.middleware';

const router = express.Router();

router.post('/login-signature', authLimiter, authController.loginWithSignature);
router.get('/me', ensureWebToken, cacheMiddleware(60), authController.me);
router.post('/refresh', authLimiter, authController.refresh);
router.post('/logout', ensureWebToken, authController.logout);

export default router;
