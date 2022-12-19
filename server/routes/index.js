const Router = require("express").Router;
const passport = require("passport");
const userRoutes = require("./api/user");
const vehicleRoutes = require("./api/vehicle");
const reviewRoutes = require("./api/review");
const bookingRoutes = require("./api/booking");
const contactUsRoutes = require("./api/contactUs");
const busAllocationRoutes = require("./api/busAllocation");
const paymentRoutes = require("./api/payment");
const ticketRoutes = require("./api/ticket");
const locationRoutes = require("./api/location");
const busTypeRoutes = require("./api/busType");
const routeRoutes = require("./api/route");
const busRoutes = require("./api/bus");
const companyRoutes = require("./api/company");
const emailSettingRoutes = require("./api/emailSettng");
const cmsRoutes = require("./api/cms");
const supportRoutes = require("./api/support");
const supportCategoryRoutes = require("./api/supportCategory");
const notificationRoutes = require("./api/notification");
const nonBearerTokenCheck = require("./../middleware/nonbearerTokenCheck");

module.exports = () => {
  const router = Router();
  router.use(nonBearerTokenCheck);

  userRoutes(router, passport);
  vehicleRoutes(router, passport);
  reviewRoutes(router, passport);
  bookingRoutes(router, passport);
  contactUsRoutes(router, passport);
  busAllocationRoutes(router, passport);
  paymentRoutes(router, passport);
  ticketRoutes(router, passport);
  locationRoutes(router, passport);
  busTypeRoutes(router, passport);
  routeRoutes(router, passport);
  busRoutes(router, passport);
  companyRoutes(router, passport);
  emailSettingRoutes(router, passport);
  cmsRoutes(router, passport);
  supportRoutes(router, passport);
  supportCategoryRoutes(router, passport);
  notificationRoutes(router, passport);

  return router;
};
