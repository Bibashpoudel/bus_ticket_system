const responseHelper = require("./responseHelper");
const httpStatus = require("http-status");

module.exports = (allowedRoles) => async (req, res, next) => {
  const { authUser } = req.user;

  const authUserRole = authUser["role"];

  if (!allowedRoles.includes(authUserRole)) {
    return responseHelper.sendResponse(
      res,
      httpStatus.UNAUTHORIZED,
      false,
      null,
      null,
      "Requested user does not have the privilege"
    );
  }
  next();
};
