const vehicleSch = require('./vehicleSchema');
const reviewSch = require('./../review/reviewSchema');
const httpStatus = require('http-status');
const responseHelper = require('../../helper/responseHelper');
const config = require('./vehicleConfig');

const busController = {};

//@desc POST: vehicle/bus details
busController.addVehicleDetails = async (req, res, next) => {
    try {
      let vehicleDetails = new vehicleSch({ 
        user_id: req.user.authUser['_id'], 
        title: req.body['title'], 
        date: req.body['date'],
        time: req.body['time'],
        class_type: req.body['class_type'],
        image: req.body['image'],
        to: req.body['to'],
        from: req.body['from'],
        seat_plan: req.body['seat_plan'],
        price: req.body['price'],
        description: req.body['description'],
        pickup: req.body['pickup'],
        bus_number: req.body['bus_number']
      });
      const total_seats = vehicleDetails.seat_plan.rightRowsSeatNumbering.length + vehicleDetails.seat_plan.leftRowsSeatNumbering.length + vehicleDetails.seat_plan.cabinSeatNumbering.length + vehicleDetails.seat_plan.backExtraSeatNumbering.length


      vehicleDetails['total_seats'] = total_seats;
      const vehicle = await vehicleDetails.save();

      const find_seats = await vehicleSch.findOne({_id: vehicleDetails._id})

      const right = await find_seats.seat_plan.rightRowsSeatNumbering.filter(r => r.isBooked == false ).length
      const left = await find_seats.seat_plan.leftRowsSeatNumbering.filter(r => r.isBooked == false ).length
      const cabin = await find_seats.seat_plan.cabinSeatNumbering.filter(r => r.isBooked == false ).length
      const back = await find_seats.seat_plan.backExtraSeatNumbering.filter(r => r.isBooked == false ).length

      const total_available_seats = right + left + cabin + back

      await vehicleSch.findOneAndUpdate({_id:vehicleDetails._id}, {$set: {available_seats: total_available_seats}});

      return responseHelper.sendResponse(res, httpStatus.OK, true, vehicle, null, config.post, null);
    } catch (err) {
      next(err);
    }
};

//@desc GET: vehicle/bus list 
busController.getVehicleList = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq = {};
    let sortq = '-_id';
    let selectq;
    let populate;
    let {class_type, min_price, max_price, title, date, to, from} = req.query;

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

    class_type ? searchq['class_type'] = class_type : searchq = searchq;
    title ? searchq['title'] = {$regex: title, $options: 'i'} : searchq = searchq;
    to ? searchq['to'] = {$regex: to, $options: 'i'} : searchq = searchq;
    from ? searchq['from'] = {$regex: from, $options: 'i'} : searchq = searchq;
    date ? searchq['date'] = date : searchq = searchq;
    min_price && max_price ? searchq['price'] = {$and : [{price: {$gte: min_price}}, {price: {$lte: max_price}}]}: searchq = searchq;
    min_price ? searchq['price'] = {$gte: min_price} : searchq = searchq;
    max_price ? searchq['price'] = {$lte: max_price} : searchq = searchq;   

    selectq = 'title date time class_type image to from total_seats available_seats price review bus_number';

    let datas = await responseHelper.getquerySendResponse(vehicleSch, page, size, sortq, searchq, selectq, next, populate);

    return responseHelper.paginationSendResponse(res, httpStatus.OK, true, datas.data, config.get, page, size, datas.totaldata);
  } catch (err) {
    next (err)
  }
};

//@desc GET: vehicle/bus details
busController.getVehicleDetails = async (req, res, next) => {
  try {
    const vehicle_id = req.params.vehicle_id;
    const vehicle_details = await vehicleSch.findOne({ _id: vehicle_id});
    const comments = await reviewSch.find({vehicle_id: vehicle_id}).populate({path: 'user_id', select: 'firstname lastname image email'});
  
    const response = { vehicle_details, comments };

    return responseHelper.sendResponse(res, httpStatus.OK, true, response, null, config.get, null);
  } catch (err) {
    next(err)
  }
};

//@desc GET: start point of the vehicle/bus journey
busController.getStartAddress = async (req, res, next) => {
  try {
    const data = await vehicleSch.aggregate([
      { $sortByCount: '$from' }
    ])
    return responseHelper.sendResponse(res, httpStatus.OK, true, data, null, config.get, null);
  } catch (err) {
    next (err)
  }
};

//@desc GET: start point of the vehicle/bus journey
busController.getDestinationAddress = async (req, res, next) => {
  try {
    const data = await vehicleSch.aggregate([
      { $sortByCount: '$to' }
    ])

    return responseHelper.sendResponse(res, httpStatus.OK, true, data, null, config.get, null);
  } catch (err) {
    next (err)
  }
};

//@desc GET: class_type title of the vehicle/bus
busController.getClassTypeList = async (req, res, next) => {
  try {
    const data = await vehicleSch.aggregate([
      { $sortByCount: "$class_type" }
    ])
    return responseHelper.sendResponse(res, httpStatus.OK, true, data, null, config.get, null);
  } catch (err) {
    next (err)
  }
};

//@desc GET: title list of the vehicle/bus
busController.getTitleList = async (req, res, next) => {
  try {
    const data = await vehicleSch.aggregate([
      { $sortByCount: "$title" }
    ])
    return responseHelper.sendResponse(res, httpStatus.OK, true, data, null, config.get, null);
  } catch (err) {
    next (err)
  }
};

//@desc GET: vehicle/bus list 
busController.findVehicle = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq;
    let sortq = '-_id';
    let selectq;
    let populate;
    let {class_type, min_price, max_price, title, to, from, date} = req.query;
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

    if(to && from && date){
      searchq =  { $and: [{date: date}, {to: {$regex: to, $options: 'i'}}, {from: {$regex: from, $options: 'i'}}] }
    }
    else if(to && from){
      searchq =  { $and: [{to: {$regex: to, $options: 'i'}}, {from: {$regex: from, $options: 'i'}}] }
    }
    else if(to){
      searchq =  {to: {$regex: to, $options: 'i'}}
    }
    else if(from){
      searchq =  {from: {$regex: from, $options: 'i'}}
    }
    else if(date){
      searchq =  {date: date}
    }
      
    selectq = 'title date time class_type image to from total_seats available_seats price review bus_number';

    let datas = await responseHelper.getquerySendResponse(vehicleSch, page, size, sortq, searchq, selectq, next, populate);

    return responseHelper.paginationSendResponse(res, httpStatus.OK, true, datas.data, config.get, page, size, datas.totaldata);
  } catch (err) {
    next (err)
  }
};


//@desc      ----- start of admin accessibles -----

//@desc ----- admin get bus type list -----
busController.busTypeList = async (req, res, next) => {
 try {
  const size_default = 10;
  let page;
  let size;
  let searchq = {};
  let sortq = '-_id';
  let selectq;
  let populate;
  let {title} = req.query;
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
    
  title ? searchq['title'] = {$regex: title, $options: 'i'} : searchq = searchq;

  selectq = '';

  let datas = await responseHelper.getquerySendResponse(vehicleSch, page, size, sortq, searchq, selectq, next, populate);

  let newData=[...datas.data ]
  await datas.data.map((item,index)=> 
    newData[index].rightColumnzz=10)

  return responseHelper.paginationSendResponse(res, httpStatus.OK, true, newData, config.get, page, size, datas.totaldata);
 } catch (err) {
   next (err)
 }
};



//@desc ----- end of admin accessibles -----




module.exports = busController;
