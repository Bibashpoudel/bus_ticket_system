const responseHelper = require("./../helper/responseHelper");
const configs = require("./../config");
const httpStatus = require("http-status");

module.exports = async (req, res, next) => {
  try {
    const clientToken = req.headers["client-auth"];
    if (clientToken && clientToken == configs.clientAuth) {
      next();
    } else {
      return responseHelper.sendResponse(
        res,
        httpStatus.UNAUTHORIZED,
        false,
        null,
        null,
        "Unauthorized client",
        null
      );
    }
  } catch (err) {
    next(err);
  }
};
