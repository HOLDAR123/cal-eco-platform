import express from 'express';
import * as controller from './ticket.controller';
import { ensureWebToken } from '../../libs/middleware/auth.middleware';
import { cacheMiddleware } from '../../libs/middleware/cache.middleware';

const router = express.Router();
router.post('/', ensureWebToken, controller.create);
router.get('/', ensureWebToken, cacheMiddleware(60), controller.list);
router.get('/:id/messages', ensureWebToken, cacheMiddleware(30), controller.messages);
router.post('/:id/messages', ensureWebToken, controller.addMessage);

export default router;
