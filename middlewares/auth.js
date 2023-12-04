const ApiError = require("../utils/errors");

module.exports = function (req, res, next) {
  return next(new ApiError(401, "The user is not authorized."));
};
