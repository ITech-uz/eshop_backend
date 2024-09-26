// utils/validationErrorHandler.js
function handleValidationError(err, res) {
  if (err.name === 'ValidationError') {
    const errors = Object.keys(err.errors).map((key) => ({
      field: key,
      message: err.errors[key].message,
    }));

    // Send a 422 status with a formatted error response
    return res.status(422).json({
      success: false,
      message: 'Validation error',
      errors: errors,
    });
  }

  // If it's not a validation error, return false so other error handling can proceed
  return false;
}

module.exports = handleValidationError;
