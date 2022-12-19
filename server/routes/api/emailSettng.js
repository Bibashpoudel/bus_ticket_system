const emailModule = require('./../../modules/emailSetting/emailSettingController');
const validate = require('./../../modules/emailSetting/emailValidation');
const uploader = require("./../../helper/uploadHelper");
const roleValidation = require('./../../helper/roleValidationHelper');
const clientAuth = require('./../../middleware/clientAuth');

module.exports = (router, passport) => {

  //@desc create <<Email Credentials>> route
  router.post(
    "/admin/create/emailCredentials",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin"]),
    validate.validateInput,
    emailModule.addCretentials
  );

  //@desc get Email Credentials list
  router.get(
    "/emailCredentials/getList",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    emailModule.getEmailCredentialList
  );

  //@desc get Email Credentials details
  router.get(
    "/emailCredentials/details/:emailSetting_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    emailModule.getEmailCredentialDetails
  );

  //@desc update Email Credentials details
  router.patch(
    "/emailCredentials/updateDetails/:emailSetting_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    validate.validateInput,
    emailModule.updateEmailCredentialDetails
  );

  //@desc update Email Credentials details
  router.delete(
    "/emailCredentials/delete/:emailSetting_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    emailModule.deleteEmailCredential
  );


};