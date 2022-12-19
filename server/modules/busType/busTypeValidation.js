const httpStatus = require('http-status');
const config = require('./busTypeConfig');
const responseHelper = require('./../../helper/responseHelper');
const otherHelper = require('./../../helper/validationHelper');
const locationSch = require('./busTypeSchema');
const isEmpty = require('./../../validation/isEmpty');

const validation = {};

validation.checkDataDuplicate = async (req, res, next) => {
  try {
    const { location } = req.body;

    let filter = {location: location };

    if (req.params.id) {
      filter._id = { $ne: req.params.id }
    }

    const data = await locationSch.findOne(filter);
    const error = {};``

    if (data) {
      error.location = 'Location already exists';
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
      field: 'driver_seat_position',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
        {
          condition: 'IsIn',
          msg: config.validate.invalidPosition,
          option: ['LEFT', 'RIGHT'], 
        },
      ],
    },
    { 
      field: 'bus_type_column_left',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
      ],
    },
    { 
      field: 'bus_type_row_left',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
      ],
    },
    { 
      field: 'bus_type_column_right',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
      ],
    },
    { 
      field: 'bus_type_row_right',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: 'english.bus_type',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: 'amharic.bus_type',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: 'oromifa.bus_type',
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