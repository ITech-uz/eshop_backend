function errorHandler(err, req, res, next) {
  console.log("err", err);
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid or revoked token' });
  }
  next(err);
}


module.exports = errorHandler