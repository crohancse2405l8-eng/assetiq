export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || error.status || 500;
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  const body = { error: message };

  if (statusCode < 500 && error.details) {
    body.details = error.details;
  }

  if (error.code) {
    body.code = error.code;
  }

  res.status(statusCode).json(body);
}