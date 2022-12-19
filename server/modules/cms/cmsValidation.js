const httpStatus = require("http-status");
const config = require("./cmsConfig");
const responseHelper = require("./../../helper/responseHelper");
const otherHelper = require("./../../helper/validationHelper");
const isEmpty = require("./../../validation/isEmpty");

const validation = {};

validation.validateInput = async (req, res, next) => {
  const data = req.body;

  const validateArray = [
    {
      field: "english",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "amharic",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "oromifa",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "type",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsIn",
          msg: config.validate.invalidType,
          option: [
            "privacy-policy",
            "terms-conditions",
            "about-us",
            "contact-us",
          ],
        },
      ],
    },
    {
      field: "description",
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
      config.validate.invalidInput,
      null
    );
  } else {
    next();
  }
};

module.exports = validation;
