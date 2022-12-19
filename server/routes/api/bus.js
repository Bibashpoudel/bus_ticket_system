const busModule = require("./../../modules/buses/busController");
const validate = require("./../../modules/buses/busValidation");
const roleValidation = require("./../../helper/roleValidationHelper");
const clientAuth = require("../../middleware/clientAuth");
const uploader = require("./../../helper/uploadHelper");

module.exports = (router, passport) => {
  // - - - - - start of super-admin and bus-owner(company) routes (bus-admin) - - - - -

  //@desc get bus list
  router.get(
    "/admin/list/bus",
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
    busModule.busList
  );

  //@desc get bus details
  router.get(
    "/admin/bus/details/:bus_id",
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
    busModule.busDetails
  );

  // - - - - - end of super-admin and bus-owner(company) routes (bus-admin) - - - - -

  // - - - - - start of admin routes (bus-admin) - - - - -

  //@desc create bus details
  // router.get(
  //   "/admin/bus/details/:bus_id",
  //   passport.authenticate("bearer", { session: false }),
  //   roleValidation([
  //     "bus-owner",
  //     "super-admin",
  //     "admin",
  //     "bus-company",
  //     "bus-manager",
  //     "bus-counter",
  //     "validator",
  //   ]),
  //   busModule.busDetails
  // );
  // router.get(
  //   "/admin/bus/details/:bus_id",
  //   passport.authenticate("bearer", { session: false }),
  //   roleValidation([
  //     "bus-owner",
  //     "super-admin",
  //     "admin",
  //     "bus-company",
  //     "bus-manager",
  //     "bus-counter",
  //     "validator",
  //   ]),
  //   busModule.busDetails
  // );
  // router.get(
  //   "/admin/bus/details/:bus_id",
  //   passport.authenticate("bearer", { session: false }),
  //   roleValidation([
  //     "bus-owner",
  //     "super-admin",
  //     "admin",
  //     "bus-company",
  //     "bus-manager",
  //     "bus-counter",
  //     "validator",
  //   ]),
  //   busModule.busDetails
  // );
  // router.get(
  //   "/admin/bus/details/:bus_id",
  //   passport.authenticate("bearer", { session: false }),
  //   roleValidation([
  //     "bus-owner",
  //     "super-admin",
  //     "admin",
  //     "bus-company",
  //     "bus-manager",
  //     "bus-counter",
  //     "validator",
  //   ]),
  //   busModule.busDetails
  // );
  // router.get(
  //   "/admin/bus/details/:bus_id",
  //   passport.authenticate("bearer", { session: false }),
  //   roleValidation([
  //     "bus-owner",
  //     "super-admin",
  //     "admin",
  //     "bus-company",
  //     "bus-manager",
  //     "bus-counter",
  //     "validator",
  //   ]),
  //   busModule.busDetails
  // );
  // router.get(
  //   "/admin/bus/details/:bus_id",
  //   passport.authenticate("bearer", { session: false }),
  //   roleValidation([
  //     "bus-owner",
  //     "super-admin",
  //     "admin",
  //     "bus-company",
  //     "bus-manager",
  //     "bus-counter",
  //     "validator",
  //   ]),
  //   busModule.busDetails
  // );
  // router.get(
  //   "/admin/bus/details/:bus_id",
  //   passport.authenticate("bearer", { session: false }),
  //   roleValidation([
  //     "bus-owner",
  //     "super-admin",
  //     "admin",
  //     "bus-company",
  //     "bus-manager",
  //     "bus-counter",
  //     "validator",
  //   ]),
  //   busModule.busDetails
  // );
  router.post(
    "/admin/busDetails/create",
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
    uploader.single("image"),
    validate.validateInput,
    busModule.addBus
  );

  router.post(
    "/admin/busFinanceReport/create",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin"]),

    busModule.addFinanceReport
  );

  //@desc update bus
  router.patch(
    "/admin/updateBus/:bus_id",
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
    uploader.single("image"),
    validate.validateInput,
    busModule.updateBus
  );

  //@desc delete bus
  router.delete(
    "/admin/deleteBus/:bus_id",
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
    busModule.deleteBus
  );

  //@desc admin get bus-schedule list
  router.get(
    "/admin/busSchedule/list",
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
    busModule.scheduleList
  );

  // @desc cancel trip
  router.post(
    "/admin/busSchedule/cancelTrip",
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
    validate.validateTrip,
    busModule.cancelTrip
  );
  router.get(
    "/admin/busSchedule/cancelTripList/:bus_id",
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
    validate.validateTripList,
    busModule.cancelTripList
  );

  // @desc cancel trip
  router.delete(
    "/admin/busSchedule/delete/:outOfService",
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
    busModule.deleteOutOfServiceTrip
  );

  //@desc admin get bus-finance list// rough
  router.get(
    "/admin/busFinancelistNew",
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
    busModule.financeListNew
  );

  //@desc admin get bus-finance list
  router.get(
    "/admin/busFinancelist",
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
    busModule.financeList
  );

  //@desc admin get bus-dashboard latest bookings list
  router.get(
    "/admin/busDashboard",
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
    busModule.adminDashboard
  );

  //@desc admin get bus-dashboard latest departure list
  router.get(
    "/admin/busDashboard/departureList",
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
    busModule.departureList
  );

  // - - - - - end of admin routes (bus-admin) - - - - -

  //@desc common get bus list
  router.get("/user/list/bus", clientAuth, busModule.busListCustomer);

  //@desc get bus details
  router.get(
    "/user/bus/details/:bus_id",
    clientAuth,
    busModule.busDetailsCustomer
  );
};
