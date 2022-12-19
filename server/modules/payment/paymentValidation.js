const httpStatus = require("http-status");
const config = require("./paymentConfig");
const responseHelper = require("./../../helper/responseHelper");
const otherHelper = require("./../../helper/validationHelper");
const paymentSch = require("./paymentSchema");
const isEmpty = require("./../../validation/isEmpty");

const validation = {};

validation.validateInput = async (req, res, next) => {
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
    {
      field: "amount",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsNumeric",
          msg: config.validate.invalidNumber,
          option: { min: 0 },
        },
      ],
    },
    {
      field: "payment_type",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsIn",
          msg: config.validate.invalidPayment_type,
          option: [
            "telebirr",
            "wallet",
            "card",
            "cash",
            "cash-depost",
            "bank-transfer",
            "paypal",
          ],
        },
      ],
    },
    {
      field: "payment_gateway",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsIn",
          msg: config.validate.invalidPaymentGateway,
          option: ["paypal", "telebirr", "cbe"],
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

validation.validateInputReceipt = async (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: "payment_type",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsIn",
          msg: config.validate.invalidPayment_type,
          option: [
            "telebirr",
            "wallet",
            "card",
            "cash",
            "cash-deposit",
            "bank-transfer",
            "paypal",
          ],
        },
      ],
    },
    {
      field: "bank_name",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "reference_number",
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

validation.validatePaymentMethodInput = async (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: "telebirr_account",
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
