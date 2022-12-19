const companyModule = require("./../../modules/company/companyController");
const userModule = require("./../../modules/user/userController");
const validate = require("./../../modules/company/companyValidation");
const uploader = require("./../../helper/uploadHelper");
const roleValidation = require("./../../helper/roleValidationHelper");
const clientAuth = require("./../../middleware/clientAuth");

module.exports = (router, passport) => {
  // ----- start of SUPER-ADMIN ROOUTES ------

  //@desc create <<BUS COMPANY>> route
  router.post(
    "/admin/create/busCompany",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin"]),
    uploader.fields([
      {
        name: "company_logo",
      },
      {
        name: "bus_image",
      },
    ]),
    validate.validateRegisterInput,
    validate.checkDataDuplicate,
    userModule.createCompany
  );

  //@desc get <<BUS COMPANY>> list
  router.get(
    "/admin/list/busCompany",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    companyModule.listCompany
  );

  //@desc get <<BUS COMPANY>> list
  router.get(
    "/admin/busCompany/:company_id",
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
    companyModule.companyDetails
  );

  //@desc delete <<BUS COMPANY>> list
  router.delete(
    "/admin/delete/busCompany/:company_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin"]),
    companyModule.deleteCompany
  );

  //@desc update <<BUS COMPANY>> route
  router.patch(
    "/admin/update/busCompany/:company_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin"]),
    uploader.fields([
      {
        name: "company_logo",
      },
      {
        name: "bus_image",
      },
    ]),
    validate.validateRegisterInput,
    validate.checkDataDuplicate,
    userModule.updateCompany
  );

  // web app bus company_list
  router.get("/web/list/busCompany", clientAuth, companyModule.listCompany);
};
