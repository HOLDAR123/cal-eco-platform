import express from 'express';
import * as healthController from './health.controller';
import { cacheMiddleware } from '../../libs/middleware/cache.middleware';

const router = express.Router();
router.get('/healthz', cacheMiddleware(30), healthController.healthz);
router.get('/readyz', cacheMiddleware(30), healthController.readyz);

export default router;
