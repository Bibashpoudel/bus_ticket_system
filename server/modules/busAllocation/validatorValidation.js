const httpStatus = require('http-status');
const config = require('./validatorConfig');
const responseHelper = require('./../../helper/responseHelper');
const otherHelper = require('./../../helper/validationHelper');
const validatorSch = require('./validatorSchema');
const isEmpty = require('./../../validation/isEmpty');

const validation = {};


validation.validateInput = async (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: 'vehicle_id',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
        {
          condition: 'IsMongoId',
          msg: config.validate.isMongoId,
        },
      ],
    },
    {
      field: 'user_id',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
        {
          condition: 'IsMongoId',
          msg: config.validate.isMongoId,
        },
      ],
    },
  ];
  const errors = otherHelper.validation(data, validateArray);
  if (!isEmpty(errors)) {
    return responseHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, config.validate.invalid, null);
  } else {
    next();
  }
};


module.exports = validation;