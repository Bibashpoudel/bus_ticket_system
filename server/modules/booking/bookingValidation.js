const httpStatus = require("http-status");
const config = require("./bookingConfig");
const responseHelper = require("./../../helper/responseHelper");
const otherHelper = require("./../../helper/validationHelper");
const bookingSch = require("./bookingSchema");
const isEmpty = require("./../../validation/isEmpty");
const moment = require("moment");

const validation = {};

validation.validateInput = async (req, res, next) => {
  const data = req.body;
  const reqType = req.body.requestType;
  let bookingRecords = req.body.bookingRecords;

  if (reqType == "select") {
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
        field: "position",
        validate: [
          {
            condition: "IsEmpty",
            msg: config.validate.empty,
          },
          {
            condition: "IsIn",
            msg: config.validate.invalidPosition,
            option: ["left", "right", "back", "cabin"],
          },
        ],
      },
      {
        field: "row_id",
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
        field: "seat_number",
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
  } else if (bookingRecords) {
    const validateArray = [
      {
        field: "firstname",
        validate: [
          {
            condition: "IsEmpty",
            msg: config.validate.empty,
          },
        ],
      },
      {
        field: "lastname",
        validate: [
          {
            condition: "IsEmpty",
            msg: config.validate.empty,
          },
        ],
      },
      {
        field: "phone",
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
        field: "gender",
        validate: [
          {
            condition: "IsEmpty",
            msg: config.validate.empty,
          },
        ],
      },
      {
        field: "dob",
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
  }
};

validation.validateMobileInput = async (req, res, next) => {
  const data = req.body;
  const reqType = req.body.requestType;
  let bookingRecords = req.body.bookingRecords;

  if (reqType == "select") {
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
        field: "position",
        validate: [
          {
            condition: "IsEmpty",
            msg: config.validate.empty,
          },
          {
            condition: "IsIn",
            msg: config.validate.invalidPosition,
            option: ["left", "right", "back", "cabin"],
          },
        ],
      },
      {
        field: "row_id",
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
        field: "seat_number",
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
  } else if (bookingRecords) {
    const validateArray = [
      {
        field: "phone",
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
      next();
    }
  }
};

validation.validateBookingCancellation = async (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: "booking_id",
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
validation.validateReportList = async (req, res, next) => {
  const data = req.query;
  const validateArray = [
    {
      field: "start_date",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "end_date",
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
