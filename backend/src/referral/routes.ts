import express from 'express';
import * as controller from './referral.controller';
import { ensureWebToken } from '../../libs/middleware/auth.middleware';
import { cacheMiddleware } from '../../libs/middleware/cache.middleware';

const router = express.Router();
router.get('/', ensureWebToken, cacheMiddleware(120), controller.list);
router.get('/earnings', ensureWebToken, cacheMiddleware(120), controller.earnings);

export default router;
