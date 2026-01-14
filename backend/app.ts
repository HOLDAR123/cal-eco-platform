import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import config from './libs/configs/config';
import logger from './libs/utils/logger';
import socketService from './libs/socket/socket';
import { routes } from './src/routes';
import errorMiddleware from './libs/middleware/error.middleware';
import { apiLimiter } from './libs/middleware/throttle.middleware';
import './libs/data/mockData';
import './libs/utils/cron';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

socketService.initializeSocket(io);

dotenv.config({ path: `${config.nodeEnv}.env` });
app.set('env', config.nodeEnv);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(apiLimiter);

app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use('/api', routes);

app.use(errorMiddleware);

if (require.main === module) {
  const PORT = config.port;
  server.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
    logger.info(`Environment: ${config.nodeEnv}`);
  });
}

export { app, server, io };
