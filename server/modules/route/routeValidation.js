const httpStatus = require('http-status');
const config = require('./routeConfig');
const responseHelper = require('./../../helper/responseHelper');
const otherHelper = require('./../../helper/validationHelper');
const routeSch = require('./routeSchema');
const isEmpty = require('./../../validation/isEmpty');

const validation = {};


validation.validateInput = async (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: 'to',
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
      field: 'from',
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
      field: 'distance',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
        {
          condition: 'IsInt',
          msg: config.validate.invalidNumber,
          option: { min: 0 }
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


validation.validateList = async (req, res, next) => {
  const data = req.query;
  const validateArray = [
    {
      field: 'language',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
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