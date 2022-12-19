const responseHelper = require('../helper/responseHelper');
const httpStatus = require('http-status')

module.exports = async (req, res, next)=> {
  try {
    if (req.headers.authorization) {
      if (req.headers.authorization.startsWith('bearer ') || req.headers.authorization.startsWith('Bearer ')) {
        return next();
      } else {
        return responseHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, null, "Token must be bearer token", "");
      }
    }
    return next();
  } catch (err) {
    next(err);
  }
};