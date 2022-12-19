const Router = require("express").Router;
const passport = require("passport");
const propertyRoute = require("../routes/index");

module.exports = () => {
  const router = Router();
  propertyRoute(router, passport);
  return router;
};
