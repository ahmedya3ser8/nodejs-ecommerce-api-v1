import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';

import dbConnection from './config/dbConnection.js';
import categoryRoute from './routes/category.route.js';

const app = express();

dbConnection();

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use('/api/v1/categories', categoryRoute);

app.listen(process.env.PORT || 4000, () => {
  console.log(`App Running on port ${process.env.PORT}`);
})
