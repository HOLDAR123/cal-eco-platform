import express from 'express';
import * as controller from './webhook.controller';

const router = express.Router();
router.post('/bsc/deposit-confirmed', controller.bscDepositConfirmed);

export default router;
