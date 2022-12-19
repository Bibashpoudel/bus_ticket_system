const express = require("express");
const reviewModule = require("./../../modules/review/reviewController");
const validate = require("./../../modules/review/reviewValidation");
const roleValidation = require("./../../helper/roleValidationHelper");
const clientAuth = require("./../../middleware/clientAuth");

module.exports = (router, passport) => {
  //@desc create super admin
  router.post(
    "/review/addReview/:bus_id",
    clientAuth,
    reviewModule.addUserReview
  );
  // //@desc get vehecle list
  // router.get('/vehicle/getList', passport.authenticate('bearer', {session: false}),roleValidation(['customer', 'admin', 'bus-manager', 'super-admin']), vehicleModule.getVehicleList);

  // //@desc get vehecle details
  // router.get('/vehicle/getDetails/:vehicle_id', passport.authenticate('bearer', {session: false}),roleValidation(['customer', 'admin', 'bus-manager', 'super-admin']), vehicleModule.getVehicleDetails);
  router.get(
    "/admin/review/getList",
    passport.authenticate("bearer", { session: false }) || clientAuth,
    reviewModule.getReviewList
  );
  router.put(
    "/admin/review/statusUpdate/:id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["admin", "super-admin"]),
    reviewModule.updateReviewStatus
  );
  router.delete(
    "/admin/review/delete/:id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["admin", "super-admin"]),
    reviewModule.deleteReview
  );

  router.get("/web/review/getList", clientAuth, reviewModule.getWebReviewList);
};
