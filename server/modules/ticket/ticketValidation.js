const httpStatus = require("http-status");
const config = require("./ticketConfig");
const responseHelper = require("../../helper/responseHelper");
const otherHelper = require("../../helper/validationHelper");
const supportSch = require("./ticketSchema");
const isEmpty = require("../../validation/isEmpty");

const validation = {};

validation.validateInput = async (req, res, next) => {
  const data = req.params;
  const validateArray = [
    {
      field: "ticket_id",
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
