const supportCategoryModule = require('../../modules/supportCategory/supportCategoryController');
const validate = require('./../../modules/supportCategory/supportCategoryValidation');
const roleValidation = require('./../../helper/roleValidationHelper');
const clientAuth = require('../../middleware/clientAuth');


module.exports = (router, passport) => {

  /* - - - - - Start of support category APIs - - - - - */

  //@desc POST: create support category 
  router.post(
    "/admin/create/supportCategory",
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
    validate.checkDataDuplicate,
    validate.validateInput,
    supportCategoryModule.addSupportCategory
  );

  //@desc GET: get support category list
  router.get(
    "/user/list/supportCategory",
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
    supportCategoryModule.getSupportList
  );

  //@desc GET: fetch support category details
  router.get(
    "/user/supportCategory/details/:category_id",
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
    supportCategoryModule.supportCategoryDetails
  );

  //@desc PATCH: update support category details
  router.patch(
    "/admin/supportCategory/update/:category_id",
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
    validate.checkDataDuplicate,
    validate.validateInput,
    supportCategoryModule.updateSupportCategory
  );

  //@desc Delete: delete support category details
  router.delete(
    "/admin/supportCategory/delete/:category_id",
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
    supportCategoryModule.deleteSupportCategory
  );

};