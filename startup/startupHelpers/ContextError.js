class ContextError extends Error {
  constructor(errorData, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ContextError);
    }

    this.name = 'ContextError';
    // Custom debugging information
    this.errorData = errorData;
    this.date = new Date();
  }
}
export default ContextError;
