const httpStatus = require("http-status");
const config = require("./contactUsConfig");
const responseHelper = require("../../helper/responseHelper");
const otherHelper = require("../../helper/validationHelper");
const contactUsSch = require("./contactUsSchema");
const isEmpty = require("../../validation/isEmpty");

const validation = {};

validation.checkDataDuplicate = async (req, res, next) => {
  try {
    const { email } = req.body;

    let filter = { email: email };

    if (req.params.id) {
      filter._id = { $ne: req.params.id };
    }

    const data = await contactUsSch.findOne(filter);
    const error = {};
    ``;

    if (data) {
      error.email = "Email already exists";
      return responseHelper.sendResponse(
        res,
        httpStatus.CONFLICT,
        false,
        null,
        error,
        config.validate.duplicateData,
        null
      );
    }
    next();
  } catch (err) {
    next(err);
  }
};

validation.validateInput = async (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: "email",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsEmail",
          msg: config.validate.isEmail,
        },
      ],
    },
    {
      field: "message",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "subject",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "fullname",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
  ];
  const errors = otherHelper.validation(data, validateArray);
  if (!isEmpty(errors)) {
    return responseHelper.sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      false,
      null,
      errors,
      config.validate.invalid,
      null
    );
  } else {
    next();
  }
};

module.exports = validation;
