import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';

import dbConnection from './config/database.js';
import categoryRoute from './routes/category.route.js';
import subCategoryRoute from './routes/subCategory.route.js';
import brandRoute from './routes/brand.route.js';
import AppError from './utils/AppError.js';
import globalError from './middlewares/globalError.js';

const app = express();

dbConnection();

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/subcategories', subCategoryRoute);
app.use('/api/v1/brands', brandRoute);

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
