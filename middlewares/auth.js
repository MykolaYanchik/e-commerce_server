const ApiError = require("../utils/errors");
const TokenService = require("../services/tokenServices");

module.exports = function (req, res, next) {
  try {
    const authrizationHeader = req.headers.authorization;
    if (!authrizationHeader) {
      return next(new ApiError(401, "The user is not authorized."));
    }

    const accessToken = authrizationHeader.split(" ")[1];
    if (!accessToken) {
      return next(new ApiError(401, "The user is not authorized."));
    }

    const userData = TokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(new ApiError(401, "The user is not authorized."));
    }

    req.user = userData;
    next();
  } catch (err) {
    return next(new ApiError(401, "The user is not authorized."));
  }
};
