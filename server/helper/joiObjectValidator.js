const responseHelper = require('./responseHelper');
const httpStatus = require('http-status');
module.exports = {
  // User-defined function to compare the input data with joiobject
  validateData: async (data, JoiSchema, errors, res, next) => {
    try {
      const response = await JoiSchema.validate(data);
      if (response.error) {
        await Promise.all(
            response.error.details.map(async (errDetail)=> {
              errors[errDetail.context.label] = errDetail.message;
            }),
        );
      }
      const errorKeys = Object.keys(errors);
      if (errorKeys.length != 0) {
        errors['error'] = errors[Object.keys(errors)[0]];
        return responseHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, 'validation', null);
      } else {
        console.info('BODY_VALIDATED');
        next();
      }
    } catch (error) {
      next(error)
    }
  },
};