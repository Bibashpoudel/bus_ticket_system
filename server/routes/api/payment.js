const express = require("express");
const paymentModule = require("./../../modules/payment/paymentController");
const validate = require("./../../modules/payment/paymentValidation");
const roleValidation = require("./../../helper/roleValidationHelper");
const clientAuth = require("../../middleware/clientAuth");
const uploader = require("./../../helper/uploadHelper");

module.exports = (router, passport) => {
  //@desc create payment through bank transfer receipt or cash deposit slip
  router.post(
    "/customer/createPayment/uploadReceipt",
    clientAuth,
    uploader.single("receipt"),
    validate.validateInputReceipt,
    paymentModule.cashDeposit
  );

  //@desc create payment through bank transfer receipt or cash deposit slip
  router.post(
    "/customer/createPayment/paymentReceipt",
    clientAuth,
    uploader.single("receipt"),
    validate.validateInputReceipt,
    paymentModule.cashDepositMobile
  );

  //@desc create ticket payment
  router.post(
    "/customer/createPayment",
    clientAuth,
    validate.validateInput,
    paymentModule.createPayment
  );
  router.post(
    "/web/customer/createPayment",
    clientAuth,
    validate.validateInput,
    paymentModule.createPaymentWeb
  );

  router.get(
    "/admin/busTransactionlist/:bus_id",
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
    paymentModule.transactionList
  );

  //@desc create <<Email Credentials>> route
  router.patch(
    "/admin/add/paymentCredentials",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin"]),
    validate.validatePaymentMethodInput,
    paymentModule.addPaymentMethod
  );
  router.post(
    "/admin/add/company/paymentCredentials",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin"]),
    validate.validatePaymentMethodInput,
    paymentModule.addCompanyPaymentMethod
  );

  //@desc get superadmin payment details
  router.get(
    "/paymentCredentials/getList",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin"]),
    paymentModule.getPaymentMethodList
  );

  //@desc get payment details according to payment id
  router.get(
    "/paymentCredentials/details/:paymentMethod_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    paymentModule.getCompanyPaymentMethodDetails
  );
  //@desc get payment details according to company id
  router.get(
    "/paymentCredentials/details/company/:company_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    paymentModule.getPaymentMethodDetails
  );

  //@desc update Email Credentials details
  router.patch(
    "/paymentCredentials/updateDetails/:paymentMethod_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    validate.validatePaymentMethodInput,
    paymentModule.updatePaymentMethodDetails
  );

  //@desc update Email Credentials details
  router.delete(
    "/paymentCredentials/delete/:paymentMethod_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    paymentModule.deletePaymentMethodDetails
  );
  router.post("/createPayment/telebirr", paymentModule.createPaymentTelebirr);
  router.post("/notifyUrl", paymentModule.NotifyUrl);
  router.get("/returnUrl/:id", paymentModule.ReturnUrl);
};
