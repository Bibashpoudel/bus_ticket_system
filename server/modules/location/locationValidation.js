const httpStatus = require('http-status');
const config = require('./locationConfig');
const responseHelper = require('./../../helper/responseHelper');
const otherHelper = require('./../../helper/validationHelper');
const locationSch = require('./locationSchema');
const isEmpty = require('./../../validation/isEmpty');

const validation = {};

validation.checkDataDuplicate = async (req, res, next) => {
  try {
    const location  = req.body;
    console.log(location)
 

    const data = await locationSch.findOne({ english:{location:location.english.location}});
    console.log(data)
    const error = {};``

    if (data) {
      error.location = 'Location already exists';
      return responseHelper.sendResponse(res, httpStatus.CONFLICT, false, null, error, null, null);
    }
    next();
  }
  catch (err) {
    next(err);
  }
};


validation.validateInput = async (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: 'english.location',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: 'amharic.location',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: 'oromifa.location',
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