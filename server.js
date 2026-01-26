import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit'
import hpp from 'hpp';
import helmet from "helmet";

import mountRoutes from './routes/index.js';
import dbConnection from './config/database.js';
import AppError from './utils/appError.js';
import globalError from './middlewares/globalError.js';
import { webhookCheckout } from './services/order.service.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// connect with DataBase
dbConnection();

// There is error here (not working yet)
app.post(
  '/webhook-checkout', 
  express.raw({ type: 'application/json' }), 
  webhookCheckout)
; 

app.use(cors());
app.use(compression());

app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// To apply data Sanitize
// app.use(mongoSanitize()); and use xss-clean

app.use(helmet());

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 5,
  message: { error: 'Too many requests, please try again later after: (15 min)' },
  standardHeaders: true,
  legacyHeaders: false,
})

const passwordLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 3,
  message: { error: `Too many requests, please try again later after: (15 min)` },
  standardHeaders: true,
  legacyHeaders: false,
})

app.post('/api/v1/auth/signup', authLimiter);
app.post('/api/v1/auth/login', authLimiter);

app.post('/api/v1/auth/forgotPassword', passwordLimiter);
app.post('/api/v1/auth/verifyResetCode', passwordLimiter);
app.post('/api/v1/auth/resetPassword', passwordLimiter);

// Protect Against multiple HTTP parameters
app.use(
  hpp({ whitelist: ['price', 'sold', 'quantity', 'ratingsAverage', 'ratingsQuantity'] })
);

// Routes
mountRoutes(app);

app.use((req, res, next) => {
  next(new AppError(`This resource: ${req.originalUrl} is not available`, 400));
})

app.use(globalError);

const server = app.listen(process.env.PORT, () => {
  console.log(`App Running on port ${process.env.PORT}`);
})

// handle rejections outside express
process.on('unhandledRejection', (err) => {
  console.log(`UnhandledRejection Errors: ${err.name} | ${err.message} `);
  server.close(() => {
    console.log('Shutting down....');
    process.exit(1);
  });
})
