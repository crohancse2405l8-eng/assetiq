import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import assetsRouter from './routes/assets.routes.js';
import reportsRouter from './routes/reports.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/assets', assetsRouter);
app.use('/api/reports', reportsRouter);

app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

export default app;