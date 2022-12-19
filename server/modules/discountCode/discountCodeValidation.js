const httpStatus = require('http-status');
const config = require('./discountCodeConfig');
const responseHelper = require('./../../helper/responseHelper');
const otherHelper = require('./../../helper/validationHelper');
const discountCodeSch = require('./discountCodeSchema');
const isEmpty = require('./../../validation/isEmpty');

const validation = {};

validation.sanitizeInput = (req, res, next) => {
  const sanitizeArray = [
   {
      field: 'code',
      sanitize: {
        trim: true,
      },
    },
  ];
  otherHelper.sanitize(req, sanitizeArray);
  next();
};

validation.checkDataDuplicate = async (req, res, next) => {
  try {
    const { code } = req.body;

    let filter = {code: code };

    if (req.params.code_id) {
      filter._id = { $ne: req.params.code_id }
    }

    const data = await discountCodeSch.findOne(filter);
    const error = {};``

    if (data) {
      error.code = 'Discount code already exists';
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
      field: 'code',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
        {
          condition: 'IsLength',
          msg: config.validate.codeLenth,
          option: { min: 4 , max: 8},
        },
      ],
    },
    {
      field: 'code_type',
      validate: [
        {
            condition: 'IsEmpty',
            msg: config.validate.empty,
        },
      ],
    },
    {
        field: 'start_date',
        validate: [
          {
            condition: 'IsEmpty',
            msg: config.validate.empty,
          },
          {
            condition: 'IsDate',
            msg: config.validate.isDate,
          },
        ],
      },
      {
        field: 'end_date',
        validate: [
          {
            condition: 'IsEmpty',
            msg: config.validate.empty,
          },
          {
            condition: 'IsDate',
            msg: config.validate.isDate,
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

validation.validateCode = async (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: 'code',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: 'company_id',
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

validation.validateCodeGuestUser = async (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: 'code',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: 'unique_id',
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