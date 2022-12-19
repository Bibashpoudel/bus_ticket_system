const userSch = require("./userSchema");
const fcmSch = require("./fcmToken");
const permissionSch = require("./../permission/permissionSchema");
const companySch = require("./../company/companySchema");
const busAllocationSch = require("./../busAllocation/busAllocationSchema");
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const responseHelper = require("../../helper/responseHelper");
const config = require("./userConfig");
const configs = require("./../../config");
const tokenGenerator = require("../../middleware/tokenGenerator");
const moment = require("moment");
const axios = require("axios");
const { nodemailer } = require("./../../helper/nodemailer");
const otpSch = require("./otpSchema");
const accessTokenSch = require("./accessToken");
const refreshTokenSch = require("./refreshToken");
const notificationSchema = require("../notification/notificationSchema");
const user = {};

user.addUser = async (req, res, next) => {
  try {
    const userDetails = new userSch({
      email: "superadmin@gmail.com",
      password: "Password@1234",
      role: "super-admin",
      status: "active",
      firstname: "super admin",
      otp_verified: true,
    });

    let user = await userDetails.save();
    user = user.toObject();
    delete user["password"];
    const tokens = await tokenGenerator(user);
    responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      null,
      null,
      config.signUp,
      tokens
    );
  } catch (err) {
    next(err);
  }
};

// @desc user login
user.login = async (req, res, next) => {
  try {
    let user = await userSch.findOne({
      email: req.body["email"].trim().toLowerCase(),
      isDeleted: false,
    });

    const sendTokenResponse = async () => {
      user["last_login_at"] = moment(Date.now());
      user = user.toObject();
      delete user["password"];

      const permissions = await permissionSch.findOne({ user_id: user["_id"] });
      const companyDetails = await companySch.findOne({ user_id: user["_id"] });

      const tokens = await tokenGenerator(user, permissions, companyDetails);

      if (req.body["fcm_token"] != user.fcm_token) {
        await userSch.findOneAndUpdate(
          { email: req.body["email"] },
          {
            $set: {
              fcm_token: req.body["fcm_token"] ? req.body["fcm_token"] : null,
            },
          }
        );
      }

      responseHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        null,
        null,
        config.loginSuccess,
        tokens
      );
    };

    user
      ? (await user.comparePassword(req.body["password"].trim()))
        ? await sendTokenResponse()
        : await responseHelper.sendResponse(
            res,
            httpStatus.BAD_REQUEST,
            false,
            null,
            config.invalidPassword,
            null,
            ""
          )
      : await responseHelper.sendResponse(
          res,
          httpStatus.BAD_REQUEST,
          false,
          null,
          config.invalid,
          null,
          ""
        );
  } catch (err) {
    next(err);
  }
};

// @desc super admin create bus company
(user.createCompany = async (req, res, next) => {
  try {
    const fcm_token = req.body["fcm_token"] ? req.body["fcm_token"] : null;
    let user = {};
    if (req.files) {
      req.body.company_logo = req.files.company_logo[0].path;
      req.body.bus_image = req.files.bus_image[0].path;
    }

    /* Creating temporary password code for user */
    let password = generatePassword();

    user = new userSch({
      email: req.body["contact_email"].trim().toLowerCase(),
      firstname: req.body.english["bus_name"],
      password: password,
      role: "bus-company",
      otp_verified: true,
      account_verified: true,
      phone: req.body["mobile_phone"],
      calling_code: req.body["calling_code"],
      fcm_token: fcm_token,
      isActive: true,
      image: req.body.company_logo,
      bus_image: req.body.bus_image,
    });

    const company_created = await user.save();
    user = user.toObject();
    delete user["password"];

    if (company_created) {
      const company = new companySch({
        user_id: user["_id"],
        added_by: req.user.authUser["_id"],
        english: req.body.english,
        amharic: req.body.amharic,
        oromifa: req.body.oromifa,
        telephone: req.body["telephone"],
        commission_rate: req.body["commission_rate"],
      });
      await company.save();

      await userSch.findOneAndUpdate(
        { _id: user["_id"] },
        { $set: { company_id: company._id } }
      );
    }
    const contactName = req.body.english["contact_name"];

    const tokens = await tokenGenerator(user);

    await nodemailer({ user, password, contactName }, "sendPassword", res);

    responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      null,
      null,
      config.registerCompany,
      tokens
    );
  } catch (err) {
    next(err);
  }
}),
  // @desc user sign up
  (user.createUser = async (req, res, next) => {
    try {
      const fcm_token = req.body["fcm_token"] ? req.body["fcm_token"] : null;
      const role =
        req.user.authUser.role == "super-admin" ? "admin" : req.body["role"];
      const company =
        req.user.authUser.role == "super-admin" ||
        req.user.authUser.role == "admin"
          ? null
          : req.user.authUser["company_id"];
      let user = {};
      let busAllocation = {};

      /* Creating temporary password code for user */
      let password = generatePassword();

      if (req.unverified_otp == true) {
        user = await userSch.findOne({ email: req.body.email });
        (user["firstname"] = req.body["firstname"]),
          (user["lastname"] = req.body["lastname"]),
          (user["email"] = req.body["email"].trim().toLowerCase()),
          (user["password"] = password),
          (user["role"] = role.trim()),
          (user["account_verified"] = true),
          (user["role"] = role),
          (user["phone"] = req.body["phone"]),
          (user["calling_code"] = req.body["calling_code"]),
          (user["fcm_token"] = fcm_token),
          (user["isActive"] = true),
          (user["otp_verified"] = true),
          (user["added_by"] = req.user.authUser["_id"]),
          (user["company_id"] = company);

        await user.save();
        user = user.toObject();
        delete user["password"];

        if (user) {
          await permissionSch.findOneAndUpdate(
            { user_id: user["_id"] },
            {
              $set: {
                user_id: user["_id"],
                bus_management: req.body["bus_management"]
                  ? req.body["bus_management"]
                  : false,
                schedule: req.body["schedule"] ? req.body["schedule"] : false,
                booking_management: req.body["booking_management"]
                  ? req.body["booking_management"]
                  : false,
                user_management: req.body["user_management"]
                  ? req.body["user_management"]
                  : false,
                finance_management: req.body["finance_management"]
                  ? req.body["finance_management"]
                  : false,
                reporting: req.body["reporting"]
                  ? req.body["reporting"]
                  : false,
                support: req.body["support"] ? req.body["support"] : false,
                setting: req.body["setting"] ? req.body["setting"] : false,
                added_by: req.user.authUser["_id"],
              },
            }
          );

          const allocationRepalced = await busAllocationSch.deleteMany({
            user_id: user["_id"],
          });
          if (allocationRepalced && req.body.bus_id) {
            for (let i = 0; i < req.body.bus_id.length; i++) {
              busAllocation = new busAllocationSch({
                user_id: user["_id"],
                bus_id: req.body.bus_id[i],
                added_by: req.user.authUser["_id"],
              });
              await busAllocation.save();
            }
          }
        }
      } else {
        user = new userSch({
          firstname: req.body["firstname"],
          lastname: req.body["lastname"],
          email: req.body["email"].trim().toLowerCase(),
          password: password,
          role: role.trim(),
          account_verified: true,
          role: role,
          phone: req.body["phone"],
          calling_code: req.body["calling_code"],
          fcm_token: fcm_token,
          isActive: true,
          otp_verified: true,
          added_by: req.user.authUser["_id"],
          company_id: company,
        });
        await user.save();
        user = user.toObject();
        delete user["password"];

        let permissions = new permissionSch({
          user_id: user["_id"],
          bus_management: req.body["bus_management"]
            ? req.body["bus_management"]
            : false,
          schedule: req.body["schedule"] ? req.body["schedule"] : false,
          booking_management: req.body["booking_management"]
            ? req.body["booking_management"]
            : false,
          user_management: req.body["user_management"]
            ? req.body["user_management"]
            : false,
          finance_management: req.body["finance_management"]
            ? req.body["finance_management"]
            : false,
          reporting: req.body["reporting"] ? req.body["reporting"] : false,
          support: req.body["support"] ? req.body["support"] : false,
          setting: req.body["setting"] ? req.body["setting"] : false,
          added_by: req.user.authUser["_id"],
        });

        await permissions.save();

        if (req.body.bus_id) {
          for (let i = 0; i < req.body.bus_id.length; i++) {
            busAllocation = new busAllocationSch({
              user_id: user["_id"],
              bus_id: req.body.bus_id[i],
              added_by: req.user.authUser["_id"],
            });

            await busAllocation.save();
          }
        }
      }
      const tokens = await tokenGenerator(user);
      const contactName = req.body["firstname"];

      await nodemailer({ user, password, contactName }, "sendPassword", res);

      responseHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        null,
        null,
        config.registerUser,
        tokens
      );
    } catch (err) {
      next(err);
    }
  }),
  // @desc user sign up
  (user.signUp = async (req, res, next) => {
    try {
      const fcm_token = req.body["fcm_token"] ? req.body["fcm_token"] : null;
      let user = {};
      let otp = {};
      /* Creating otp code for user */
      let otp_code = generateOTP();

      if (req.unverified_otp == true) {
        user = await userSch.findOneAndUpdate(
          { email: req.body.email, isDeleted: false },
          {
            $set: {
              firstname: req.body["firstname"],
              lastname: req.body["lastname"],
              email: req.body["email"].trim().toLowerCase(),
              password: req.body["password"].trim(),
              role: req.body["role"],
              account_verified: true,
              phone: req.body["phone"],
              calling_code: req.body["calling_code"],
              gender: req.body["gender"],
              dob: req.body["dob"],
              fcm_token: fcm_token,
              isActive: true,
            },
          }
        );

        user = user.toObject();
        delete user["password"];
        otp = await otpSch.findOneAndUpdate(
          { user_id: user["_id"] },
          { $set: { otp: otp_code } }
        );
      } else {
        user = new userSch({
          firstname: req.body["firstname"],
          lastname: req.body["lastname"],
          email: req.body["email"].trim().toLowerCase(),
          password: req.body["password"].trim(),
          role: req.body["role"],
          account_verified: true,
          phone: req.body["phone"],
          calling_code: req.body["calling_code"],
          fcm_token: fcm_token,
          isActive: true,
        });

        otp = new otpSch({ otp: otp_code, user_id: user["_id"] });

        await user.save();
        user = user.toObject();
        delete user["password"];
        await otp.save();
      }
      const tokens = await tokenGenerator(user);

      await nodemailer(
        { user, otp_code, type: "userRegister" },
        "sendCode",
        res
      );

      responseHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        null,
        null,
        config.signUp,
        tokens
      );
    } catch (err) {
      next(err);
    }
  }),
  // @desc verify registration otp
  (user.otpVerification = async (req, res, next) => {
    try {
      const otpValidationCheck = await otpSch.findOne({
        user_id: req.body.user_id,
        otp: req.body.otp,
      });
      let userDetails = {};
      userDetails["data"] = await userSch.findOne(
        { _id: req.body.user_id },
        "-password"
      );
      userDetails["token"] = await accessTokenSch.findOne({
        user_id: req.body.user_id,
      });
      otpValidationCheck
        ? await userSch.findOneAndUpdate(
            { _id: req.body.user_id },
            { $set: { otp_verified: true } }
          )
        : responseHelper.sendResponse(
            res,
            httpStatus.BAD_REQUEST,
            false,
            null,
            null,
            config.invalidOtp,
            null
          );
      responseHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        null,
        null,
        config.success,
        userDetails
      );
    } catch (err) {
      next(err);
    }
  });

// @desc user logout
user.logout = async (req, res, next) => {
  try {
    const user_id = req.user.authUser["_id"];
    await userSch.findOneAndUpdate(
      { _id: user_id },
      { $set: { active: false, fcm_token: null } }
    );
    await notificationSchema.updateMany(
      {
        user_id: user_id,
      },
      {
        $set: {
          fcm_token: null,
        },
      }
    );
    await accessTokenSch.remove({ user_id: req.user.authUser["_id"] });
    await refreshTokenSch.remove({ user_id: req.user.authUser["_id"] });
    responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      null,
      null,
      config.logout,
      null
    );
  } catch (error) {
    next(error);
  }
};

// @desc admin> update user profile details
user.updateProfileDetails = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;

    await userSch.findOneAndUpdate(
      { _id: user_id },
      {
        $set: {
          firstname: req.body["firstname"],
          lastname: req.body["lastname"],
          role: req.body["role"],
          phone: req.body["phone"],
          gender: req.body["gender"],
          dob: req.body["dob"],
          isActive: req.body["isActive"],
        },
      }
    );

    const permission = await permissionSch.findOne({ user_id: user_id });

    if (permission) {
      await permissionSch.findOneAndUpdate(
        { user_id: user_id },
        {
          $set: {
            user_id: user_id,
            bus_management: req.body["bus_management"]
              ? req.body["bus_management"]
              : false,
            schedule: req.body["schedule"] ? req.body["schedule"] : false,
            booking_management: req.body["booking_management"]
              ? req.body["booking_management"]
              : false,
            user_management: req.body["user_management"]
              ? req.body["user_management"]
              : false,
            finance_management: req.body["finance_management"]
              ? req.body["finance_management"]
              : false,
            reporting: req.body["reporting"] ? req.body["reporting"] : false,
            support: req.body["support"] ? req.body["support"] : false,
            setting: req.body["setting"] ? req.body["setting"] : false,
            updated_by: req.user.authUser["_id"],
          },
        }
      );
    } else {
      const permission = new permissionSch({
        user_id: user_id,
        bus_management: req.body["bus_management"]
          ? req.body["bus_management"]
          : false,
        schedule: req.body["schedule"] ? req.body["schedule"] : false,
        booking_management: req.body["booking_management"]
          ? req.body["booking_management"]
          : false,
        user_management: req.body["user_management"]
          ? req.body["user_management"]
          : false,
        finance_management: req.body["finance_management"]
          ? req.body["finance_management"]
          : false,
        reporting: req.body["reporting"] ? req.body["reporting"] : false,
        support: req.body["support"] ? req.body["support"] : false,
        setting: req.body["setting"] ? req.body["setting"] : false,
        added_by: req.user.authUser["_id"],
      });
      await permission.save();
    }

    const allocationRepalced = await busAllocationSch.deleteMany({
      user_id: user_id,
    });
    if (allocationRepalced) {
      if (req.body.bus_id) {
        for (let i = 0; i < req.body.bus_id.length; i++) {
          if (req.body.bus_id[i] !== null) {
            busAllocation = new busAllocationSch({
              user_id: user_id,
              bus_id: req.body.bus_id[i],
              added_by: req.user.authUser["_id"],
            });
            await busAllocation.save();
          }
        }
      }
    }

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      req.body,
      null,
      config.update,
      null
    );
  } catch (err) {
    next(err);
  }
};
user.updateStatus = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;
    await userSch.findOneAndUpdate(
      { _id: user_id },
      {
        $set: {
          isActive: req.body["isActive"],
        },
      }
    );

    if (req.body["isActive"] === false) {
      await accessTokenSch.deleteMany({ user_id: user_id });
    }

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      req.body,
      null,
      config.update,
      null
    );
  } catch (err) {
    next(err);
  }
};

// @desc user update profile details
user.updateProfile = async (req, res, next) => {
  try {
    let user_id = req.user.authUser["_id"];

    let user = await userSch.findOne({ _id: user_id });

    if (user) {
      (user["firstname"] = req.body["firstname"]),
        (user["lastname"] = req.body["lastname"]),
        (user["phone"] = req.body["phone"]),
        (user["calling_code"] = req.body["calling_code"]),
        (user["isActive"] = req.body["isActive"]),
        (user["gender"] = req.body["gender"]),
        (user["dob"] = req.body["dob"]);
      await user.save();
    } else {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        config.invalid,
        null
      );
    }

    let data = {
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      calling_code: user.calling_code,
      _id: user._id,
      image: user.image,
      email: user.email,
      role: user.role,
      gender: user.gender,
      dob: user.dob,
      isActive: user.isActive,
    };

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      data,
      null,
      config.update,
      null
    );
  } catch (err) {
    next(err);
  }
};

// @desc user Status Update

// @desc user update profile image
user.updateProfileImage = async (req, res, next) => {
  try {
    let user_id = req.user.authUser["_id"];

    let user = await userSch.findOne({ _id: user_id });
    if (req.file) {
      req.body.profile_image = req.file.path;
    }

    if (user) {
      user["image"] = req.body["profile_image"];
      await user.save();
    } else {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        config.invalid,
        null
      );
    }
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      user.image,
      null,
      config.update,
      null
    );
  } catch (err) {
    next(err);
  }
};

// @desc user change password
user.updatePassword = async (req, res, next) => {
  try {
    let user_id = req.user.authUser["_id"];
    const { password, new_password } = req.body;

    let user = await userSch.findOne({ _id: user_id });

    if (user) {
      const passwordMatched = await user.comparePassword(password);

      if (passwordMatched) {
        user["password"] = new_password.trim();
        await user.save();
        user = user.toObject();
        delete user["password"];
      } else {
        return responseHelper.sendResponse(
          res,
          httpStatus.BAD_REQUEST,
          false,
          null,
          null,
          config.invalidPassword,
          null
        );
      }
    } else {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        config.invalid,
        null
      );
    }

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      null,
      null,
      config.update,
      null
    );
  } catch (err) {
    next(err);
  }
};

// @desc GET: user profile details
user.getProfileDetails = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;
    const busAllocated = await busAllocationSch
      .find({ user_id: user_id })
      .populate({ path: "bus_id", select: "english amharic oromifa" });
    const user_details = await userSch
      .findOne({ _id: user_id }, "-password")
      .populate({ path: "permission company" });
    let response = user_details;

    response = {
      ...user_details._doc,
      ...user_details.$$populatedVirtuals,
      busAllocated,
    };

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      response,
      null,
      config.get,
      null
    );
  } catch (err) {
    next(err);
  }
};

// @desc GET: users profile list
user.getUserList = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq = {
      role: "admin",
      isDeleted: false,
      _id: { $ne: req.user.authUser["_id"] },
    };
    let sortq = "-_id";
    let selectq;
    let populate;
    let { email, status } = req.query;
    if (req.query.page && !isNaN(req.query.page) && req.query.page != 0) {
      page = Math.abs(req.query.page);
    } else {
      page = 1;
    }
    if (req.query.size && !isNaN(req.query.size) && req.query.size != 0) {
      size = Math.abs(req.query.size);
    } else {
      size = size_default;
    }
    if (
      req.user.authUser.role == "super-admin" ||
      req.user.authUser.role == "admin"
    ) {
      if (email && status) {
        searchq = {
          isActive: status,
          email: { $regex: email, $options: "i" },
          _id: { $ne: req.user.authUser["_id"] },
          role: "admin",
          isDeleted: false,
        };
      } else if (email) {
        searchq = {
          email: { $regex: email, $options: "i" },
          _id: { $ne: req.user.authUser["_id"] },
          role: "admin",
          isDeleted: false,
        };
      } else if (status) {
        searchq = {
          isActive: status,
          _id: { $ne: req.user.authUser["_id"] },
          role: "admin",
          isDeleted: false,
        };
      }
    }

    if (req.user.authUser.role == "bus-company") {
      searchq = {
        company_id: req.user.authUser["company_id"],
        isDeleted: false,
        _id: { $ne: req.user.authUser["_id"] },
      };

      if (email && status) {
        searchq = {
          isActive: status,
          email: { $regex: email, $options: "i" },
          company_id: req.user.authUser["_id"],
          isDeleted: false,
          _id: { $ne: req.user.authUser["_id"] },
        };
      } else if (email) {
        searchq = {
          email: { $regex: email, $options: "i" },
          _id: { $ne: req.user.authUser["_id"] },
          company_id: req.user.authUser["_id"],
          isDeleted: false,
        };
      } else if (status) {
        searchq = {
          isActive: status,
          _id: { $ne: req.user.authUser["_id"] },
          company_id: req.user.authUser["company_id"],
          isDeleted: false,
          role: { $ne: "admin" },
        };
      }
    }

    selectq = "-password";

    let datas = await responseHelper.getquerySendResponse(
      userSch,
      page,
      size,
      sortq,
      searchq,
      selectq,
      next,
      populate
    );

    return responseHelper.paginationSendResponse(
      res,
      httpStatus.OK,
      true,
      datas.data,
      config.get,
      page,
      size,
      datas.totaldata
    );
  } catch (err) {
    next(err);
  }
};

// @desc POST: verigy email and send OTP
user.verifyEmail = async (req, res, next) => {
  try {
    const user = await userSch.findOne({
      email: req.body["email"].trim().toLowerCase(),
      isDeleted: false,
    });
    if (!user) {
      responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        config.validate.isEmail,
        null
      );
    } else {
      // Creating otp code for user
      function generateOTP() {
        const digits = "0123456789";
        let OTP = "";
        for (let i = 0; i < 4; i++) {
          OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
      }

      const otp_code = generateOTP();

      const otp_found = await otpSch.findOne({ user_id: user["_id"] });

      if (otp_found) {
        await otpSch.findOneAndUpdate(
          { user_id: user["_id"] },
          { $set: { otp: otp_code } }
        );
      }

      const new_otp = new otpSch({ otp: otp_code, user_id: user["_id"] });
      await new_otp.save();

      await nodemailer(
        { user, otp_code, type: "forgetPassword" },
        "forgotPassword",
        res
      );

      responseHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        user._id,
        null,
        config.success,
        null
      );
    }
  } catch (err) {
    next(err);
  }
};

// @desc Forgot password > change password
user.changePassword = async (req, res, next) => {
  try {
    const user_id = req.body["user_id"];
    let user = await userSch.findOne({ _id: user_id });
    const password = req.body["password"].trim();

    let errors = {};
    if (!user) {
      errors["user"] = config.invalid;
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        errors,
        null,
        null
      );
    }

    const otpValidationCheck = await otpSch.findOne({
      user_id: user_id,
      otp: req.body.otp,
    });

    if (!otpValidationCheck) {
      errors["otp"] = config.invalidOtp;
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        errors,
        null,
        null
      );
    }

    user["password"] = password;
    user["otp_verified"] = true;
    await user.save();
    user = user.toObject();

    delete user["password"];

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      user,
      null,
      config.update,
      null
    );
  } catch (err) {
    next(err);
  }
};

// @desc super admin update bus company
user.updateCompany = async (req, res, next) => {
  try {
    let user = {};

    if (req.files.company_logo) {
      req.body.company_logo = req.files.company_logo[0].path;
    }
    if (req.files.bus_image) {
      req.body.bus_image = req.files.bus_image[0].path;
    }

    let active;
    const company_id = req.params.company_id;

    if (req.body["isActive"] === null) {
      active = false;
    } else {
      active = req.body["isActive"];
    }
    console.log("check", active);
    user = await userSch.updateMany(
      { company_id: company_id },
      {
        $set: {
          email: req.body["contact_email"].trim(),
          phone: req.body["mobile_phone"],
          calling_code: req.body["calling_code"],
          isActive: active,
          image: req.body.company_logo,
          bus_image: req.body.bus_image,
          updated_by: req.user.authUser["_id"],
        },
      }
    );
    const checkuser = await userSch.find({ company_id: company_id });
    console.log("user", checkuser);

    await companySch.findOneAndUpdate(
      { _id: company_id },
      {
        $set: {
          added_by: req.user.authUser["_id"],
          english: req.body.english,
          amharic: req.body.amharic,
          oromifa: req.body.oromifa,
          telephone: req.body["telephone"],
          isActive: active,
          commission_rate: req.body["commission_rate"],
          updated_by: req.user.authUser["_id"],
        },
      }
    );

    responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      req.body,
      null,
      config.update,
      null
    );
  } catch (err) {
    next(err);
  }
};

// @desc delete user
user.deleteUser = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;

    await userSch.findOneAndUpdate(
      { _id: user_id },
      { $set: { isDeleted: true } }
    );
    await accessTokenSch.remove({ user_id: user_id });
    responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      null,
      null,
      config.deleteUser,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc user save fcm token
user.createFcmToken = async (req, res, next) => {
  try {
    const { fcm_token, user_id, unique_id } = req.body;
    let fcmToken = {};

    const tokenExists = await fcmSch.findOne({ unique_id: unique_id });
    if (tokenExists) {
      fcmToken = await fcmSch.findOneAndUpdate(
        { _id: tokenExists._id },
        {
          $set: {
            fcm_token: fcm_token,
            user_id: user_id ? user_id : null,
            unique_id: unique_id,
          },
        }
      );
    } else {
      fcmToken = new fcmSch({
        fcm_token: fcm_token,
        user_id: user_id ? user_id : null,
        unique_id: unique_id,
      });
      await fcmToken.save();
    }

    responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      fcmToken,
      null,
      config.post,
      null
    );
  } catch (err) {
    next(err);
  }
};

// @desc INTERNAL FUCTION: generate random code
function generateOTP() {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

// @desc INTERNAL FUCTION: generate random password
function generatePassword() {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

module.exports = user;
