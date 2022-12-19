const busTypeModule = require("./../../modules/busType/busTypeController");
const validate = require("./../../modules/busType/busTypeValidation");
const roleValidation = require("./../../helper/roleValidationHelper");
const clientAuth = require("../../middleware/clientAuth");

module.exports = (router, passport) => {
  // - - - - - start of super-admin and bus-owner(companyy) routes - - - - -

  //@desc get bus types list
  router.get(
    "/admin/list/busType",
    passport.authenticate("bearer", { session: false }),
    roleValidation([
      "bus-owner",
      "admin",
      "super-admin",
      "bus-company",
      "bus-manager",
      "bus-counter",
      "validator",
    ]),
    busTypeModule.busTypeList
  );

  //@desc get bus type detail
  router.get(
    "/admin/busType/details/:busType_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation([
      "bus-owner",
      "admin",
      "super-admin",
      "bus-company",
      "bus-manager",
      "bus-counter",
      "validator",
    ]),
    busTypeModule.busTypeDetails
  );

  // - - - - - start of super-admin and bus-owner(companyy) routes - - - - -

  // - - - - - start of bus-owner(companyy) routes - - - - -

  //@desc create bus type
  router.post(
    "/admin/busType/create",
    passport.authenticate("bearer", { session: false }),
    roleValidation([
      "bus-owner",
      "super-admin",
      "admin",
      "bus-company",
      "bus-manager",
      "bus-counter",
      "validator",
    ]),
    validate.validateInput,
    busTypeModule.addBusType
  );

  //@desc update bus type
  router.patch(
    "/admin/updateBusType/:busType_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation([
      "bus-owner",
      "super-admin",
      "admin",
      "bus-company",
      "bus-manager",
      "bus-counter",
      "validator",
    ]),
    validate.validateInput,
    busTypeModule.updateBusType
  );

  //@desc delete bus type
  router.delete(
    "/admin/deleteBusType/:busType_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation([
      "bus-owner",
      "super-admin",
      "admin",
      "bus-company",
      "bus-manager",
      "bus-counter",
      "validator",
    ]),
    busTypeModule.deleteBusType
  );

  // - - - - - end of bus-owner(companyy) routes - - - - -


  // - - - - - start of commoon routes - - - - -

  //@desc get bus types list
  router.get( "/user/busType/list", clientAuth, busTypeModule.getClassTypeList );

  
  // - - - - - end of commoon routes - - - - -
};
