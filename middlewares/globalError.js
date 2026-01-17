import AppError from "../utils/AppError.js";

const globalError = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    sendErrorForDev(err, res);
  } else {
    console.log('err', err.name === 'JsonWebTokenError');
    if (err.name === 'JsonWebTokenError') err = handleJwtInvalidSignature();
    if (err.name === 'TokenExpiredError') err = handleJwtExpire();
    sendErrorForProd(err, res);
  }
}

const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    error: err,
    message: err.message || 'Something Went Wrong',
    stack: err.stack
  })
} 

const sendErrorForProd = (err, res) => {
  return res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message || 'Something Went Wrong'
  })
} 

const handleJwtInvalidSignature = () => new AppError('Invalid token, please login to access this route', 401);

const handleJwtExpire = () => new AppError('Expire token, please login again.', 401);

export default globalError;
