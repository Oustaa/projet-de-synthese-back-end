function serverErrorHandler(res, error) {
  return res.status(500).json({
    status: 500,
    error,
    message: `internal server error, ${error.message}`,
    stack: error?.stack,
  });
}

module.exports = serverErrorHandler;
