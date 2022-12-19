const ticketModule = require('./../../modules/ticket/ticketController');
const validate = require('./../../modules/ticket/ticketValidation');
const roleValidation = require('./../../helper/roleValidationHelper');
const clientAuth = require('../../middleware/clientAuth');


module.exports = (router, passport) => {


    //@desc GET: customer fetch ticket details 
    router.get('/customer/getTicket', clientAuth, ticketModule.getDetails);

    //@desc GET: customer fetch ticket history 
    router.get(
      "/customer/getTicket/record",
      passport.authenticate("bearer", { session: false }),
      roleValidation(["super-admin", "admin", "customer"]),
      ticketModule.getBookingHistory
    );

    //@desc GET: customer fetch ticket history guest user
    router.get(
      "/guestUser/getTicket/record",
      clientAuth,
      ticketModule.guestUserBookingHistory
    );

    //@desc PATCH: validator > validate ticket
    router.patch(
      "/validator/validate/ticket/:ticket_id/:bus_id",
      passport.authenticate("bearer", { session: false }),
      roleValidation(["super-admin", "admin", "validator"]),
      validate.validateInput,
      ticketModule.validateTicket
    );
    
}