const httpStatus = require("http-status");
const config = require("./busConfig");
const responseHelper = require("./../../helper/responseHelper");
const otherHelper = require("./../../helper/validationHelper");
const busSch = require("./busSchema");
const isEmpty = require("./../../validation/isEmpty");
const moment = require("moment");

const validation = {};

validation.validateInput = async (req, res, next) => {
  const data = req.body;
  const today = moment().add(-1, "days").toString();
  const validateArray = [
    {
      field: "english.name",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "english.bus_number",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "english.plate_number",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },

    {
      field: "amharic.name",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "amharic.bus_number",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "amharic.plate_number",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },

    {
      field: "oromifa.name",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "oromifa.bus_number",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "oromifa.plate_number",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },

    {
      field: "route_id",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsMongoId",
          msg: config.validate.isMongoId,
        },
      ],
    },

    {
      field: "price.birr",
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
    {
      field: "bus_type_id",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsMongoId",
          msg: config.validate.isMongoId,
        },
      ],
    },
    {
      field: "departure",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "arrival",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "operation_date.to",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsDate",
          msg: config.validate.isDate,
        },
        {
          condition: "IsAfter",
          msg: config.validate.isBefore,
          option: { date: req.body.operation_date.from },
        },
      ],
    },
    {
      field: "operation_date.from",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsDate",
          msg: config.validate.isDate,
        },
      ],
    },
    {
      field: "recurring",
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

validation.validateList = async (req, res, next) => {
  const data = req.query;
  const today = moment().add(-1, "days").toString();
  const validateArray = [
    {
      field: "language",
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

validation.validateTrip = async (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: "date",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsDate",
          msg: config.validate.isDate,
        },
      ],
    },
    {
      field: "bus_id",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsMongoId",
          msg: config.validate.isMongoId,
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
validation.validateTripList = async (req, res, next) => {
  const data = req.params;
  const validateArray = [
    {
      field: "bus_id",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsMongoId",
          msg: config.validate.isMongoId,
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
