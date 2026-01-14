import express from 'express';
import * as controller from './plan.controller';
import { cacheMiddleware } from '../../libs/middleware/cache.middleware';

const router = express.Router();
router.get('/', cacheMiddleware(300), controller.list);
router.get('/:id', cacheMiddleware(300), controller.detail);

export default router;
