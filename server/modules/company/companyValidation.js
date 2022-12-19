const httpStatus = require("http-status");
const config = require("./companyConfig");
const responseHelper = require("./../../helper/responseHelper");
const otherHelper = require("./../../helper/validationHelper");
const companySch = require("./companySchema");
const userSch = require("../user/userSchema");
const isEmpty = require("./../../validation/isEmpty");
const Joi = require("@hapi/joi");
const joiValidator = require("./../../helper/joiObjectValidator");

const validation = {};

validation.checkDataDuplicate = async (req, res, next) => {
  try {
    const { contact_email } = req.body;
    const company_id = req.params.company_id;

    let filter = { email: contact_email, isDeleted: false };
    let find_company;
    if (company_id) {
      find_company = await companySch.findOne({ _id: company_id });
    }
    console.log(find_company);

    if (find_company) {
      filter["_id"] = { $ne: find_company.user_id };
    }

    console.log(filter);
    const data = await userSch.findOne(filter);
    console.log(data);

    const error = {};

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

validation.validateRegisterInput = async (req, res, next) => {
  const data = req.body;
  data.english = JSON.parse(req.body["english"]);
  data.amharic = JSON.parse(req.body["amharic"]);
  data.oromifa = JSON.parse(req.body["oromifa"]);

  const validateArray = [
    {
      field: "english.bus_name",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "english.bus_legal_name",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "english.address",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "english.contact_name",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "amharic.bus_name",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "amharic.bus_legal_name",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "amharic.address",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "amharic.contact_name",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "oromifa.bus_name",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "oromifa.bus_legal_name",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "oromifa.address",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "oromifa.contact_name",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "contact_email",
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
      field: "mobile_phone",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "telephone",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "commission_rate",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsInt",
          msg: config.validate.invalidNumber,
          option: { min: 0 },
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
    let pattern = new RegExp(/[+-]/);
    if (pattern.test(req.body.email)) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        { email: config.validate.invalid_chars },
        "input error",
        null
      );
    }
    next();
  }
};

module.exports = validation;
