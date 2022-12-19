const express = require('express');
const locationModule = require('./../../modules/location/locationController');
const validate = require('./../../modules/location/locationValidation');
const roleValidation = require('./../../helper/roleValidationHelper');
const clientAuth = require('../../middleware/clientAuth');

module.exports = (router, passport) => {
  // - - - - - start of super-admin and bus-owner(company) routes - - - - -

  //@desc get location list
  router.get(
    "/admin/list/location",
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
    locationModule.locationList
  );

  //@desc get location list
  router.get(
    "/admin/location/details/:location_id",
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
    locationModule.locationDetails
  );

  // - - - - - end of super-admin and bus-owner(company) routes - - - - -

  // - - - - - start of bus-owner(company) routes - - - - -

  //@desc create location
  router.post(
    "/admin/addLocation",
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
    validate.validateInput,
    validate.checkDataDuplicate,
    locationModule.addLocation
  );

  //@desc update location
  router.patch(
    "/admin/updateLocation/:location_id",
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
    // validate.validateInput,
    locationModule.updateLocation
  );

  //@desc delete location
  router.delete(
    "/admin/deleteLocation/:location_id",
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
    locationModule.deleteLocation
  );

  // - - - - - end of bus-owner(company) routes - - - - -

  // - - - - - start of common routes - - - - -

  //@desc get location list
  router.get(
    '/customer/list/location',
    clientAuth,
    locationModule.locationListCustomer
  );

  // - - - - - end of common routes - - - - -
};
