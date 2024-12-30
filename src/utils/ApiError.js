export class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = "") {
    super()
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.stack = stack;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}
