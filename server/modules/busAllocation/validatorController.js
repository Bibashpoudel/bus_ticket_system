const validatorSch = require('./busAllocationSchema');
const bookingSch = require('../booking/bookingSchema');
const httpStatus = require('http-status');
const responseHelper = require('../../helper/responseHelper');
const config = require('./validatorConfig');

const validatorController = {};

//@desc assign ticked validator for vehicle/bus
validatorController.assignValidator = async (req, res, next) => {
  try {
    let validatorDetails = new validatorSch({ 
      validator: req.body['user_id'],
      assigned_by: req.user.authUser['_id'], 
      vehicle_id: req.body['vehicle_id'] 
    });
    await validatorDetails.save(); 

    return responseHelper.sendResponse(res, httpStatus.OK, true, validatorDetails, null, config.post, null);
  } catch (err) {
    next(err);
  }
};

//@desc GET: vehicle/bus validator list 
validatorController.getValidatorList = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq = {};
    let sortq = '-_id';
    let selectq;
    let populate = {path: 'validator assigned_by vehicle_id', select: 'firstname lastname email bus_number title'};

    if (req.query.page && !isNaN(req.query.page) && req.query.page != 0) {
      page = Math.abs(req.query.page);
    } else {
      page = 1;
    }
    if (req.query.size && !isNaN(req.query.size) && req.query.size != 0) {
      size = Math.abs(req.query.size);
    } else {
      size = size_default;
    }   

    selectq = 'validator vehicle_id created_at updated_at';


    let datas = await responseHelper.getquerySendResponse(validatorSch, page, size, sortq, searchq, selectq, next, populate);

    return responseHelper.paginationSendResponse(res, httpStatus.OK, true, datas.data, config.get, page, size, datas.totaldata);
  } catch (err) {
    next (err)
  }
};

//@desc GET: vehicle/bus validator assigned details 
validatorController.getValidatorDetails = async (req, res, next) => {
  try {
    const validator = await validatorSch.find({validator: req.user.authUser['_id']}).populate({path: 'vehicle_id', select: 'bus_number title class_type date time to from price total_seats review available_seats'})
    return responseHelper.sendResponse(res, httpStatus.OK, true, validator, null, config.get, null);
  } catch (err) {
    next (err)
  }
};

  


module.exports = validatorController;