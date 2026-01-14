import express from 'express';
import * as controller from './transaction.controller';
import { ensureWebToken } from '../../libs/middleware/auth.middleware';
import { cacheMiddleware } from '../../libs/middleware/cache.middleware';

const router = express.Router();
router.post('/deposits', ensureWebToken, controller.createDeposit);
router.get('/', ensureWebToken, cacheMiddleware(60), controller.list);

export default router;
