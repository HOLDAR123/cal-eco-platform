import express from 'express';
import * as stakingController from './staking.controller';
import { ensureWebToken } from '../../libs/middleware/auth.middleware';
import { cacheMiddleware } from '../../libs/middleware/cache.middleware';

const router = express.Router();

router.post('/', ensureWebToken, stakingController.create);
router.get('/', ensureWebToken, cacheMiddleware(120), stakingController.list);
router.post('/claim', ensureWebToken, stakingController.claim);
router.post('/sell', ensureWebToken, stakingController.sell);

export default router;
