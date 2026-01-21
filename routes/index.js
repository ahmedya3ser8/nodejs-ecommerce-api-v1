import categoryRoute from './category.route.js';
import subCategoryRoute from './subCategory.route.js';
import brandRoute from './brand.route.js';
import productRoute from './product.route.js';
import userRoute from './user.route.js';
import authRoute from './auth.route.js';
import reviewRoute from './review.route.js';
import wishlistRoute from './wishlist.route.js';
import addressRoute from './address.route.js';
import couponRoute from './coupon.route.js';
import cartRoute from './cart.route.js';

const mountRoutes = (app) => {
  app.use('/api/v1/categories', categoryRoute);
  app.use('/api/v1/subcategories', subCategoryRoute);
  app.use('/api/v1/brands', brandRoute);
  app.use('/api/v1/products', productRoute);
  app.use('/api/v1/users', userRoute);
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/reviews', reviewRoute);
  app.use('/api/v1/wishlist', wishlistRoute);
  app.use('/api/v1/addressess', addressRoute);
  app.use('/api/v1/coupons', couponRoute);
  app.use('/api/v1/cart', cartRoute);
}

export default mountRoutes;
