function errorHandler(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({success: false, message: 'Invalid or revoked token'});
  }
  next(err);
}
module.exports = errorHandler