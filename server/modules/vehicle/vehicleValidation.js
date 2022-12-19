const httpStatus = require('http-status');
const config = require('./vehicleConfig');
const responseHelper = require('./../../helper/responseHelper');
const otherHelper = require('./../../helper/validationHelper');
const vehicleSch = require('./vehicleSchema');
const isEmpty = require('./../../validation/isEmpty');
const Joi = require('@hapi/joi');
const joiValidator = require('./../../helper/joiObjectValidator');

const validation = {};

validation.sanitizeInput = (req, res, next) => {
  const sanitizeArray = [
   {
      field: 'to',
      sanitize: {
        trim: true,
      },
    },
    {
      field: 'from',
      sanitize: {
        trim: true,
      },
    },
    {
        field: 'available_seats',
        sanitize: {
          trim: true,
        },
      },
    {
        field: 'price',
        sanitize: {
          trim: true,
        },
    },
    {
      field: 'location',
      sanitize: {
        trim: true,
      },
  },
  ];
  otherHelper.sanitize(req, sanitizeArray);
  next();
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
        field: 'date',
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
        field: 'class_type',
        validate: [
          {
            condition: 'IsEmpty',
            msg: config.validate.empty,
          },
        ],
      },
      {
        field: 'to',
        validate: [
          {
            condition: 'IsEmpty',
            msg: config.validate.empty,
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
        ],
      },
      {
        field: 'price',
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
      {
        field: 'description',
        validate: [
          {
            condition: 'IsEmpty',
            msg: config.validate.empty,
          },
          {
            condition: 'IsLength',
          msg: config.validate.descriptionLength,
          option: { min: 5, max: 10000 },
          },
        ],
      },
      {
        field: 'pickup',
        validate: [
          {
            condition: 'IsEmpty',
            msg: config.validate.empty,
          },

        ],
      },
      {
        field: 'seat_plan',
        validate: [
          {
            condition: 'IsEmpty',
            msg: config.validate.empty,
          },
        ],
      },
      {
        field: 'bus_number',
        validate: [
          {
            condition: 'IsEmpty',
            msg: config.validate.empty,
          },
        ],
      },
  ];
  const errors = otherHelper.validation(req.body, validateArray);
  if (!isEmpty(errors)) {
    return responseHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, config.validate.invalidInput, null);
  } else {
    next();
  }
};

validation.login = async (req, res, next) => {
  try {
    let error = {};
    const verified_account = await userSch.findOne({email: req.body.email}, 'otp_verified')
    if (verified_account.otp_verified == true){
      next();
    }
    else if (verified_account.otp_verified == false){
      error.otp = 'Please verify otp';
      return responseHelper.sendResponse(res, httpStatus.CONFLICT, false, null, error, config.validate.unverifiedOtp, null);
    }
  } catch (err) {
    next (err);
  }
}

validation.loginInput = async (req, res, next) => {
  try {
    let error = {};
    const emailCheck = await userSch.findOne({email: req.body.email})

    const JoiSchema = await Joi.object({
      email: Joi.string().regex(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/).rule({ message: "Enter a valid email", }).required(),
      password: Joi.string().required(),
    });
    if (!emailCheck) {
      error['email'] = "User does not exist";
    }
    await joiValidator.validateData(req.body, JoiSchema, error, res, next);
  } catch (error) {
    next (error)
  }
}

validation.validateOtpInput = async (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: 'otp',
      validate: [
        {
          condition: 'IsEmpty',
          msg: config.validate.empty,
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
    return responseHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, config.validate.inerr, null);
  } else {

    let pattern = new RegExp(/[+-]/);
    if (pattern.test(req.body.email)) {
      return responseHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, { email: config.validate.invalid_chars }, 'input error', null);
    }
    next();
  }
};




module.exports = validation;