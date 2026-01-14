import express from 'express';
import * as userController from './user.controller';
import { ensureWebToken } from '../../libs/middleware/auth.middleware';
import { cacheMiddleware } from '../../libs/middleware/cache.middleware';

const router = express.Router();

router.get('/me', ensureWebToken, cacheMiddleware(60), userController.getMe);
router.patch('/me', ensureWebToken, userController.updateMe);

export default router;
