const bookingModule = require("./../../modules/booking/bookingController");
const discoutCodeModule = require("./../../modules/discountCode/discountCodeController");
const validate = require("./../../modules/booking/bookingValidation");
const discountCodeValidate = require("./../../modules/discountCode/discountCodeValidation");
const uploader = require("./../../helper/uploadHelper");
const roleValidation = require("./../../helper/roleValidationHelper");
const clientAuth = require("./../../middleware/clientAuth");

module.exports = (router, passport) => {
  // ----- start of ADMIN ROOUTES ------

  //@desc create discount code
  router.post(
    "/admin/discount/discountCode",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    discountCodeValidate.sanitizeInput,
    discountCodeValidate.checkDataDuplicate,
    discountCodeValidate.validateInput,
    discoutCodeModule.addDiscountCode
  );

  //@desc get promo code list
  router.get(
    "/company/promoCode/getList",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    discoutCodeModule.promoCodeList
  );

  //@desc get promo code details
  router.get(
    "/promoCode/details/:code_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    discoutCodeModule.getPromoCodeDetails
  );

  //@desc update promo code details
  router.patch(
    "/promoCode/updateDetails/:code_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    discountCodeValidate.sanitizeInput,
    discountCodeValidate.checkDataDuplicate,
    discountCodeValidate.validateInput,
    discoutCodeModule.updatePromoCodeDetails
  );

  //@desc delete promo code details
  router.delete(
    "/promoCode/deleteDetails/:code_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin", "admin", "bus-company"]),
    discoutCodeModule.deletePromoCode
  );

  //@desc get booking list
  router.get(
    "/admin/booking/getList",
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
    bookingModule.getBookingList
  );
  //get booking list by grouping ticket id
  router.get(
    "/admin/booking/group/getList",
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
    bookingModule.getGroupBookingList
  );
  //router.get("user/getTicket/:ticket_id", clientAuth, bookingModule.getTicket);

  //@desc validate discount code
  router.post(
    "/discount/validateCode",
    passport.authenticate("bearer", { session: false }),
    discountCodeValidate.validateCode,
    discoutCodeModule.validateCode
  );

  //@desc validate discount code guest user
  router.post(
    "/guestUser/discount/validateCode",
    clientAuth,
    discountCodeValidate.validateCodeGuestUser,
    discoutCodeModule.validateCode
  );

  // ----- end of ADMIN ROUTES ------

  //@desc create booking bus-counter
  router.post(
    "/counter/bus/seatBooking/:bus_id",
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
    bookingModule.createBooking
  );

  //@desc customer seat booking bus-counter (Registered user)
  router.post(
    "/appCustomer/bus/seatBooking/:bus_id",
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
    validate.validateMobileInput,
    bookingModule.mobileBookingCustomer
  );

  //@desc create booking through mobile application <<Guest user>>
  router.post(
    "/customer/bus/seatBooking/:bus_id",
    clientAuth,
    validate.validateInput,
    bookingModule.mobileBooking
  );

  //@desc cancel booking (both mobile user)
  router.delete(
    "/customer/cancel/seatBooking",
    clientAuth,
    validate.validateBookingCancellation,
    bookingModule.cancelBooking
  );

  //delete the ticket and payment created while payment done through telebirr
  router.delete(
    "/customer/delete/payment",
    clientAuth,
    bookingModule.deletePayment
  );

  //@desc get booking details
  router.get(
    "/bus/seatBooking/:booking_id",
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
    bookingModule.getBookingDetails
  );

  //@desc update booking details
  router.patch(
    "/bus/updateDetails/:booking_id",
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
    bookingModule.updateBooking
  );

  //@desc get reporting list
  router.get(
    "/bus/reporting/list",
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

    bookingModule.getReportingList
  );
  router.get(
    "/bus/pasanger/list",
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

    bookingModule.getpasangerList
  );

  //@desc create booking
  router.post(
    "/vehicle/seatBooking/:vehicle_id",
    clientAuth,
    bookingModule.vehicleBooking
  );

  //@desc create booking by guest user
  router.post(
    "/bus/seatBooking/:bus_id",
    clientAuth,
    bookingModule.createBooking
  );

  //@desc cancel booking
  router.post(
    "/cancel/booking",
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
    bookingModule.deleteBooking
  );

  //@desc cancel booking mobile user
  router.post(
    "/customer/cancel/booking/:ticket_id",
    clientAuth,
    bookingModule.deleteBookingMobileUser
  );

  //@desc cancel booking mobile guest user
  router.post(
    "/appUser/cancel/booking/:ticket_id",
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
    bookingModule.deleteBookingMobileUser
  );

  //@desc admin> get booking details
  router.get(
    "/admin/ticket/details/:ticket_id",
    clientAuth,
    bookingModule.getTicketDetails
  );

  //@desc admin> confirm booking through payment receipt
  router.patch(
    "/admin/confirm/booking/:ticket_id",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin"]),
    bookingModule.confirmBooking
  );
  router.post(
    "/admin/decline/booking",
    passport.authenticate("bearer", { session: false }),
    roleValidation(["super-admin"]),
    bookingModule.declineBooking
  );
};
