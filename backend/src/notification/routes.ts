import express from 'express';
import * as controller from './notification.controller';
import { ensureWebToken } from '../../libs/middleware/auth.middleware';
import { cacheMiddleware } from '../../libs/middleware/cache.middleware';

const router = express.Router();
router.get('/', ensureWebToken, cacheMiddleware(60), controller.list);
router.post('/:id/read', ensureWebToken, controller.markRead);

export default router;
