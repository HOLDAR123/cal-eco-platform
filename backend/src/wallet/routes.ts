import express from 'express';
import * as walletController from './wallet.controller';
import { ensureWebToken } from '../../libs/middleware/auth.middleware';
import { cacheMiddleware } from '../../libs/middleware/cache.middleware';

const router = express.Router();

router.post('/', ensureWebToken, walletController.addWallet);
router.get('/', ensureWebToken, cacheMiddleware(120), walletController.listWallets);
router.delete('/:id', ensureWebToken, walletController.removeWallet);

export default router;
