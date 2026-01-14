import express from 'express';
import * as controller from './withdrawal.controller';
import { ensureWebToken } from '../../libs/middleware/auth.middleware';
import { cacheMiddleware } from '../../libs/middleware/cache.middleware';

const router = express.Router();
router.post('/', ensureWebToken, controller.request);
router.get('/', ensureWebToken, cacheMiddleware(60), controller.list);
router.delete('/:id', ensureWebToken, controller.cancel);

export default router;
