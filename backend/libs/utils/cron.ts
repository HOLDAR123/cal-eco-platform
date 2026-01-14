import cron from 'node-cron';
import registerController from '../../src/register/register.controller';
import logger from './logger';

cron.schedule('* * * * *', async () => {
  try {
    logger.debug('Running userBUSDDepositCheck cron job');
    await registerController.userBUSDDepositCheck();
  } catch (error) {
    logger.error('Error in userBUSDDepositCheck cron job:', error);
  }
});

logger.info('Cron jobs initialized');

export {};
