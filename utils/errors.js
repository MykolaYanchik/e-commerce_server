module.exports = class ApiError extends Error {
  status;
  message;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
};
