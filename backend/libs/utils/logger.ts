import config from '../configs/config';

const levels: Record<string, number> = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = (process.env.LOG_LEVEL || 'error').toLowerCase();

function shouldLog(level: string): boolean {
  return levels[level] <= levels[currentLevel];
}

type LogArgs = unknown[];

const logger = {
  info: (message: string, ...args: LogArgs): void => {
    if (shouldLog('info')) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: LogArgs): void => {
    if (shouldLog('error')) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: LogArgs): void => {
    if (shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  debug: (message: string, ...args: LogArgs): void => {
    if (shouldLog('debug')) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
  level: currentLevel,
};

export default logger;
