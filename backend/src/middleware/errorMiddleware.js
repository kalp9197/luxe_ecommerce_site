/**
 * Handle 404 errors for routes that don't exist
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global error handler
 */
export const errorHandler = (err, req, res, next) => {
  console.error("ERROR 💥:", {
    message: err.message,
    name: err.name,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
  });

  // Sometimes status code might be 200 even when there's an error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    name: err.name,
  });
};
