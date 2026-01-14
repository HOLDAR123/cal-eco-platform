import logger from './logger';

const notAvailable = async (): Promise<never> => {
  logger.warn('Database access attempted in demo mode. Using mock data only.');
  throw new Error('Database is not available in demo mode. All data is mock/in-memory.');
};

interface PoolConfig {
  [key: string]: unknown;
}

const pool: PoolConfig = {};

const promisePool = {
  query: notAvailable,
};

export {
  pool,
  promisePool,
};
