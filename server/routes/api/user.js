const express = require("express");
const router = express.Router();
const userModule = require("./../../modules/user/userController");
const validate = require("./../../modules/user/userValidation");
const roleValidation = require("./../../helper/roleValidationHelper");
const uploader = require("./../../helper/uploadHelper");
const clientAuth = require("../../middleware/clientAuth");

module.exports = (router, passport) => {
  // - - - - - @desc start of super-admin(company) route - - - - -

  //create super admin
  router.post("/admin/add", userModule.addUser);

  //get user list
  router.get(
    "/admin/userList",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    userModule.getUserList
  );
  //super-admin and admin create users
  router.post(
    "/admin/create/signup",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    validate.sanitizeRegister,
    validate.checkDataDuplicate,
    validate.validateRegisterInput,
    userModule.createUser
  );

  //update user profile
  router.patch(
    "/admin/updateProfile/:user_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    validate.sanitizeRegister,
    validate.validateProfileUpdate,
    validate.checkDataDuplicate,
    userModule.updateProfileDetails
  );

  //delete user
  router.delete(
    "/admin/deleteUser/:user_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    userModule.deleteUser
  );

  // - - - - - @desc end of super-admin(company) route - - - - -

  /* - - - - - @desc start of customer route - - - - - */

  //customer sign up
  router.post(
    "/user/signup",
    clientAuth,
    validate.sanitizeRegister,
    validate.checkDataDuplicate,
    validate.validateCustomerRegisterInput,
    userModule.signUp
  );

  /* - - - - - @desc end of customer route - - - - - */

  /* - - - - - @desc start of common route - - - - - */

  //login user
  router.post(
    "/user/login",
    validate.loginInput,
    validate.login,
    userModule.login
  );

  //logout user
  router.post(
    "/user/logout",
    passport.authenticate("bearer", { session: false }),
    userModule.logout
  );

  //update user profile
  router.patch(
    "/user/updateProfile",
    passport.authenticate("bearer", { session: false }),
    roleValidation([
      "super-admin",
      "admin",
      "bus-owner",
      "bus-manager",
      "bus-counter",
      "validator",
      "customer",
      "bus-company",
    ]),
    validate.sanitizeRegister,
    validate.validateProfileUpdate,
    userModule.updateProfile
  );
  router.patch(
    "/user/updateStatus/:user_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation([
      "super-admin",
      "admin",
      "bus-owner",
      "bus-manager",
      "bus-counter",
      "validator",
      "customer",
      "bus-company",
    ]),

    userModule.updateStatus
  );

  //update profile image
  router.patch(
    "/user/updateProfileImage",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["customer", "admin", "bus-manager", "super-admin"]),
    uploader.single("profile_image"),
    userModule.updateProfileImage
  );

  //update user password
  router.patch(
    "/user/updatePassword",
    passport.authenticate("bearer", { session: false }),
    roleValidation([
      "bus-owner",
      "super-admin",
      "admin",
      "bus-company",
      "bus-manager",
      "bus-counter",
      "validator",
      "customer",
    ]),
    validate.validatePasswordUpdate,
    userModule.updatePassword
  );

  //validate otp
  router.post(
    "/user/validateOtp",
    validate.validateOtpInput,
    userModule.otpVerification
  );

  //get profile details
  router.get(
    "/user/profileDetails/:user_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["customer", "admin", "bus-company", "super-admin"]),
    userModule.getProfileDetails
  );

  /* - - - - - start of forgot passwort APIs - - - - - */

  //verify email
  router.post(
    "/user/forgotPassword/verifyEmail",
    clientAuth,
    validate.validateEmail,
    userModule.verifyEmail
  );

  // validate OTP POST: /user/validateOtp

  //Enter new password
  router.patch(
    "/user/forgotPassword/newPassword",
    clientAuth,
    validate.validateNewPassword,
    userModule.changePassword
  );

  //@desc create FCM token
  router.post(
    "/user/create/fcmToken",
    clientAuth,
    validate.validateFcmInput,
    userModule.createFcmToken
  );

  /* - - - - - end of forgot passwort APIs - - - - - */

  /* - - - - - @desc start of common route - - - - - */
};
