const contactUsModule = require("../../modules/contactUs/contactUsController");
const validate = require("../../modules/contactUs/contactUsValidation");
const roleValidation = require("../../helper/roleValidationHelper");
const clientAuth = require("./../../middleware/clientAuth");

module.exports = (router, passport) => {
  // ----- start of ADMIN ROOUTES ------

  //@desc POST: create super admin
  router.post(
    "/admin/create/contactUs",
    clientAuth,
    validate.validateInput,
    contactUsModule.addContactDetails
  );

  //@desc GET: get support list
  router.get(
    "/admin/list/contactUs",
    clientAuth,
    contactUsModule.getContactUsList
  );

  // ----- end of ADMIN ROOUTES ------
};
