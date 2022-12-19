const express = require('express');
const router = express.Router();
const vehicleModule = require('./../../modules/vehicle/vehicleController');
const validate = require('./../../modules/vehicle/vehicleValidation');
const uploader = require("./../../helper/uploadHelper");
const roleValidation = require('./../../helper/roleValidationHelper')


module.exports = (router, passport) => {

    //@desc add vehicle/bus details 
    router.post('/vehicle/add', passport.authenticate('bearer', {session: false}),roleValidation(['admin']), validate.sanitizeInput, validate.validateInput, vehicleModule.addVehicleDetails);

    //@desc get vehecle/bus list
    router.get('/vehicle/getList', passport.authenticate('bearer', {session: false}),roleValidation(['customer', 'admin', 'bus-manager', 'super-admin']), vehicleModule.getVehicleList);

    //@desc get vehecle/bus details
    router.get('/vehicle/getDetails/:vehicle_id', passport.authenticate('bearer', {session: false}),roleValidation(['customer', 'admin', 'bus-manager', 'super-admin']), vehicleModule.getVehicleDetails);

    //@desc GET: start loction of the journey
    router.get('/vehicle/location/startPoint', passport.authenticate('bearer', {session: false}),roleValidation(['customer', 'admin', 'bus-manager', 'super-admin']), vehicleModule.getStartAddress);

    //@desc GET: end loction of the journey
    router.get('/vehicle/location/endPoint', passport.authenticate('bearer', {session: false}),roleValidation(['customer', 'admin', 'bus-manager', 'super-admin']), vehicleModule.getDestinationAddress);

    //@desc GET: find vehecle/bus list
    router.get('/vehicle/findVehicle', passport.authenticate('bearer', {session: false}),roleValidation(['customer', 'admin', 'bus-manager', 'super-admin']), vehicleModule.findVehicle);

    //@desc GET: class_type list of the bus
    router.get('/vehicle/class_type/list', passport.authenticate('bearer', {session: false}),roleValidation(['customer', 'admin', 'bus-manager', 'super-admin']), vehicleModule.getClassTypeList);

    //@desc GET: class_type list of the bus
    router.get('/vehicle/title/list', passport.authenticate('bearer', {session: false}),roleValidation(['customer', 'admin', 'bus-manager', 'super-admin']), vehicleModule.getTitleList);


    // ----- start of ADMIN ROOUTES ------

    //@desc POST: assign ticket validator  
    router.get('/admin/busType/list', passport.authenticate('bearer', {session: false}),roleValidation(['admin', 'super-admin']), vehicleModule.busTypeList);



    // ----- end of ADMIN ROOUTES ------

}