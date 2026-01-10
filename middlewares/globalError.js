const globalError = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    sendErrorForDev(err, res);
  } else {
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

export default globalError;
