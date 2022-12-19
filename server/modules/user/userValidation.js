const httpStatus = require("http-status");
const config = require("./userConfig");
const responseHelper = require("./../../helper/responseHelper");
const otherHelper = require("./../../helper/validationHelper");
const userSch = require("./userSchema");
const isEmpty = require("./../../validation/isEmpty");
const Joi = require("@hapi/joi");
const joiValidator = require("./../../helper/joiObjectValidator");

const validation = {};

validation.sanitizeRegister = (req, res, next) => {
  const sanitizeArray = [
    {
      field: "email",
      sanitize: {
        trim: true,
      },
    },
    {
      field: "phone_number",
      sanitize: {
        trim: true,
      },
    },
    {
      field: "firstname",
      sanitize: {
        trim: true,
      },
    },
    {
      field: "lastname",
      sanitize: {
        trim: true,
      },
    },
  ];
  otherHelper.sanitize(req, sanitizeArray);
  const email = req.body.email ? req.body.email : "";
  req.body.email = email.toLowerCase().trim();
  next();
};

validation.checkDataDuplicate = async (req, res, next) => {
  try {
    const { email } = req.body;

    let filter = { email: email.trim().toLowerCase(), isDeleted: false };

    if (req.params.user_id) {
      filter._id = { $ne: req.params.user_id };
    }

    const data = await userSch.findOne(filter);

    const error = {};

    if (data) {
      if (data.otp_verified == false) {
        req.unverified_otp = true;
        return next();
      } else if (data.otp_verified == true) {
        error.email = config.validate.duplicateEmail;
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
    }
    next();
  } catch (err) {
    next(err);
  }
};

validation.validateRegisterInput = async (req, res, next) => {
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
      field: "role",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsIn",
          msg: config.validate.invalidRole,
          option: [
            "super-admin",
            "admin",
            "bus-owner",
            "bus-manager",
            "bus-counter",
            "validator",
            "customer",
          ],
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
      ],
    },
    {
      field: "firstname",
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

validation.validateCustomerRegisterInput = async (req, res, next) => {
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
      field: "role",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsIn",
          msg: config.validate.invalidRole,
          option: ["customer"],
        },
      ],
    },
    {
      field: "password",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsLength",
          msg: config.validate.pwLength,
          option: { min: 8 },
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
      ],
    },
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
      field: "calling_code",
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

validation.login = async (req, res, next) => {
  try {
    let errors = {};
    const email = req.body.email;

    const emailCheck = await userSch.findOne({
      email: email.toLowerCase().trim(),
      isDeleted: false,
    });

    if (!emailCheck) {
      errors["email"] = config.validate.emailNotFound;
      return responseHelper.sendResponse(
        res,
        httpStatus.CONFLICT,
        false,
        null,
        errors,
        config.validate.emailNotFound,
        null
      );
    } else {
      console.log("account", emailCheck);
      if (emailCheck.otp_verified == true && emailCheck.isActive == true) {
        console.log("passing from herer");
        next();
      } else if (
        emailCheck.otp_verified == false &&
        emailCheck.isActive == false
      ) {
        errors.isActive = {
          english: "Account deactivated",
          amharic: "Account deactivated",
          oromifa: "Account deactivated",
        };
        return responseHelper.sendResponse(
          res,
          httpStatus.CONFLICT,
          false,
          null,
          errors,
          config.validate.unverifiedAccount,
          null
        );
      } else if (emailCheck.otp_verified == false) {
        errors.otp = {
          english: "Please verify otp",
          amharic: "Please verify otp",
          oromifa: "Please verify otp",
        };
        return responseHelper.sendResponse(
          res,
          httpStatus.CONFLICT,
          false,
          null,
          errors,
          config.validate.unverifiedOtp,
          null
        );
      } else if (emailCheck.isActive == false) {
        console.log("this must be here");
        errors.isActive = config.validate.unverifiedAccount;
        return responseHelper.sendResponse(
          res,
          httpStatus.CONFLICT,
          false,
          null,
          errors,
          config.validate.unverifiedAccount,
          null
        );
      }
    }
  } catch (err) {
    next(err);
  }
};

//unused and to be replaced
// validation.loginInputTest = async (req, res, next) => {
//   try {
//     let error = {};
//     const emailCheck = await userSch.findOne({
//       email: req.body.email,
//       isDeleted: false,
//     });

//     const JoiSchema = await Joi.object({
//       email: Joi.string()
//         .regex(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
//         .rule({ message: "Enter a valid email" })
//         .required(),
//       password: Joi.string().required(),
//       fcm_token: Joi.string().allow("", null).optional(),
//     });
//     if (!emailCheck) {
//       error["email"] = config.validate.duplicateUser;
//     }
//     await joiValidator.validateData(req.body, JoiSchema, error, res, next);
//   } catch (error) {
//     next(error);
//   }
// };

validation.loginInput = async (req, res, next) => {
  const data = req.body;

  const validateArray = [
    {
      field: "email",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "password",
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

validation.validateOtpInput = async (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: "otp",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "user_id",
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

validation.validateProfileUpdate = async (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: "phone",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
      ],
    },
    {
      field: "firstname",
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

validation.validatePasswordUpdate = async (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: "new_password",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsLength",
          msg: config.validate.pwLength,
          option: { min: 8 },
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

validation.validateEmail = async (req, res, next) => {
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

validation.validateNewPassword = async (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: "user_id",
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
      field: "password",
      validate: [
        {
          condition: "IsEmpty",
          msg: config.validate.empty,
        },
        {
          condition: "IsLength",
          msg: config.validate.pwLength,
          option: { min: 8 },
        },
      ],
    },
    {
      field: "otp",
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

validation.validateFcmInput = async (req, res, next) => {
  const data = req.body;
  const validateArray = [];
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
