/**
 * Async handler to wrap async functions and catch errors
 * @param {Function} fn - The async function to execute
 * @returns {Function} - Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler; 