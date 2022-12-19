const validatorModule = require('./../../modules/busAllocation/validatorController');
const validate = require('./../../modules/busAllocation/validatorController');
const roleValidation = require('../../helper/roleValidationHelper')


module.exports = (router, passport) => {

//     // ----- start of ADMIN ROOUTES ------

//     //@desc POST: assign ticket validator  
//     router.post('/admin/assignValidator', passport.authenticate('bearer', {session: false}),roleValidation(['admin', 'super-admin', 'bus-manager']), validate.validateInput, validatorModule.assignValidator);



//     // ----- end of ADMIN ROOUTES ------


//     //@desc GET: get ticket validator list
//     router.get('/ticketValidation/validatorList', passport.authenticate('bearer', {session: false}),roleValidation(['bus-manager', 'super-admin', 'admin', 'validator']), validatorModule.getValidatorList);

//     //@desc GET: get ticket validator assigned details
//     router.get('/ticketValidation/validatorDetails', passport.authenticate('bearer', {session: false}),roleValidation([ 'validator']), validatorModule.getValidatorDetails);

  

}