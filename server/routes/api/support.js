const supportModule = require('../../modules/support/supportController');
const validate = require('./../../modules/support/supportValidation');
const roleValidation = require('./../../helper/roleValidationHelper');
const clientAuth = require('../../middleware/clientAuth');


module.exports = (router, passport) => {
  /* - - - - - Start of support ticket APIs - - - - - */

  //@desc POST: create support ticket
  router.post(
    "/user/create/supportTicket",
    passport.authenticate("bearer", { session: false }),
    roleValidation([
      "super-admin",
      "bus-owner",
      "admin",
      "bus-company",
      "bus-manager",
      "bus-counter",
      "validator",
    ]),
    validate.validateInput,
    supportModule.createSupport
  );

  //@desc GET: list support ticket
  router.get(
    "/user/list/supportTicket",
    passport.authenticate("bearer", { session: false }),
    roleValidation([
      "super-admin",
      "bus-owner",
      "admin",
      "bus-company",
      "bus-manager",
      "bus-counter",
      "validator",
    ]),
    supportModule.getSupportList
  );

  //@desc GET: fetch support ticket details
  router.get(
    "/user/support/details/:support_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation([
      "super-admin",
      "bus-owner",
      "admin",
      "bus-company",
      "bus-manager",
      "bus-counter",
      "validator",
    ]),
    supportModule.supportDetails
  );

  //@desc PATCH: update support ticket
  router.patch(
    "/update/support/details/:support_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation([
      "super-admin",
      "bus-owner",
      "admin",
      "bus-company",
      "bus-manager",
      "bus-counter",
      "validator",
    ]),
    validate.validateInput,
    supportModule.updateSupportDetails
  );

  //@desc Delete: delete support ticket
  router.delete(
    "/delete/support/details/:support_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation([
      "super-admin",
      "bus-owner",
      "admin",
      "bus-company",
      "bus-manager",
      "bus-counter",
      "validator",
    ]),
    supportModule.deleteSupportTicket
  );

  /* - - - - - End of support ticket APIs - - - - - */

  /* - - - - - Start of support ticket reply - - - - - */

  //@desc Post: reply on support ticket
  router.post(
    "/support/ticket/reply/:support_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    validate.validateReply,
    supportModule.supportResponse
  );

  //@desc Get: list of reply on support ticket
  router.get(
    "/support/list/reply/:support_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    supportModule.listSupportResponse
  );

  //@desc Get: details of reply on support ticket
  router.get(
    "/support/details/reply/:response_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    supportModule.getSupportResponse
  );

  //@desc Patch: update reply on support ticket
  router.patch(
    "/support/update/reply/:response_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    validate.validateReply,
    supportModule.updateSupportResponse
  );

  //@desc Delete: delete reply on support ticket
  router.delete(
    "/support/list/reply/:response_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    supportModule.deleteSupportResponse
  );

  /* - - - - - End of support ticket reply - - - - - */
};