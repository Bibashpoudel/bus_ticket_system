const express = require('express');
const notificationModule = require('./../../modules/notification/notificationController');
const validate = require('./../../modules/notification/notificationValidation');
const roleValidation = require('./../../helper/roleValidationHelper');
const clientAuth = require('../../middleware/clientAuth');

module.exports = (router, passport) => {

  // - - - - - start of super-admin and bus-owner(company) routes - - - - -

  //@desc get notification list (login user)
  router.get(
    "/user/list/notification",
    passport.authenticate("bearer", { session: false }),
    roleValidation([
      "bus-owner",
      "super-admin",
      "admin",
      "bus-company",
      "bus-manager",
      "bus-counter",
      "validator",
      "customer",
    ]),
    notificationModule.getList
  );

  //@desc get notification list (guest user)
  router.get('/guestUser/list/notification/:unique_id', clientAuth, notificationModule.getListGuestUser);

  //@desc get notification details (guest user)
  router.get('/notification/details/:ticket_id', clientAuth, notificationModule.getDetails);

  //@desc enable or disable notification (bus customer)
  router.patch('/customer/enable/disable/notification/:unique_id', clientAuth, notificationModule.enableNotification);
  
  //@desc notification informaton 
  router.get('/user/notification/status/:unique_id', clientAuth, notificationModule.notificationInfo);

  //@desc notification count 
  router.get('/user/notification/count/:unique_id', clientAuth, notificationModule.notificationCount);
};
