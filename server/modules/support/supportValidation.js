const httpStatus = require('http-status');
const config = require('./supportConfig');
const responseHelper = require('../../helper/responseHelper');
const otherHelper = require('../../helper/validationHelper');
const supportSch = require('./supportSchema');
const isEmpty = require('../../validation/isEmpty');

const validation = {};

validation.checkDataDuplicate = async (req, res, next) => {
  try {
    const { email } = req.body;

    let filter = {email: email };

    if (req.params.id) {
      filter._id = { $ne: req.params.id }
    }

    const data = await supportSch.findOne(filter);
    const error = {};``

    if (data) {
      error.email = 'Email already exists';
      return responseHelper.sendResponse(res, httpStatus.CONFLICT, false, null, error, config.validate.duplicateData, null);
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
      field: 'title',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: 'category',
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
      field: 'description',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: 'priority',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
        {
          condition: 'IsIn',
          msg: config.validate.invalid_priority_type,
          option: ['low', 'medium', 'high'], 
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

validation.validateReply = async (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: 'comment',
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