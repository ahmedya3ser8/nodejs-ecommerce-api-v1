import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import mountRoutes from './routes/index.js';
import dbConnection from './config/database.js';
import AppError from './utils/AppError.js';
import globalError from './middlewares/globalError.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dbConnection();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

mountRoutes(app);

app.use((req, res, next) => {
  next(new AppError(`This resource: ${req.originalUrl} is not available`, 400));
})

app.use(globalError);

const server = app.listen(process.env.PORT || 4000, () => {
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
