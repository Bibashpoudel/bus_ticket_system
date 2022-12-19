const routeModule = require("./../../modules/route/routeController");
const validate = require("./../../modules/route/routeValidation");
const roleValidation = require("./../../helper/roleValidationHelper");

module.exports = (router, passport) => {
  // - - - - - start of super-admin and bus-owner(company) routes - - - - -

  //@desc get route list
  router.get(
    "/admin/list/route",
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
    routeModule.routeList
  );

  //@desc get route list
  router.get(
    "/admin/route/details/:route_id",
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
    routeModule.routeDetails
  );

  // - - - - - end of super-admin and bus-owner(company) routes - - - - -

  // - - - - - start of bus-owner(company) routes - - - - -

  //@desc create route
  router.post(
    "/admin/addRoute",
    passport.authenticate("bearer", { session: false }),
    roleValidation([
      "bus-owner",
      "super-admin",
      "bus-company",
      "admin",
      "bus-manager",
      "bus-counter",
      "validator",
    ]),
    validate.validateInput,
    routeModule.addRoute
  );

  //@desc update route
  router.patch(
    "/admin/updateRoute/:route_id",
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
    routeModule.updateRoute
  );

  //@desc delete route
  router.delete(
    "/admin/deleteRoute/:route_id",
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
    routeModule.deleteRoute
  );

  // - - - - - end of bus-owner(company) routes - - - - -
};
