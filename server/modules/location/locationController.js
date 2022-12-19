const locationSch = require("./locationSchema");
const routeSch = require("../route/routeSchema");
const httpStatus = require("http-status");
const responseHelper = require("../../helper/responseHelper");
const config = require("./locationConfig");

const locationController = {};

//@desc Add vehicle/bus start of end location
locationController.addLocation = async (req, res, next) => {
  try {
    let locationDetails = new locationSch({
      added_by: req.user.authUser["_id"],
      english: req.body["english"],
      amharic: req.body["amharic"],
      oromifa: req.body["oromifa"],
    });
    await locationDetails.save();

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      locationDetails,
      null,
      config.post,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc update vehicle/bus start of end location
locationController.updateLocation = async (req, res, next) => {
  try {
    await locationSch.findOneAndUpdate(
      { _id: req.params.location_id },
      {
        $set: {
          english: req.body["english"],
          amharic: req.body["amharic"],
          oromifa: req.body["oromifa"],
          isActive: req.body["isActive"],
          updated_by: req.user.authUser["_id"],
        },
      }
    );

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      req.body,
      null,
      config.put,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc delete vehicle/bus start of end location
locationController.deleteLocation = async (req, res, next) => {
  try {
    const location_id = req.params.location_id;

    const route = await routeSch.findOne({
      $or: [{ to: location_id }, { from: location_id }],
    });
    if (route) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        config.validate.locationExists,
        null
      );
    } else {
      await locationSch.findOneAndDelete({ _id: req.params.location_id });

      return responseHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        null,
        null,
        config.delete,
        null
      );
    }
  } catch (err) {
    next(err);
  }
};

//@desc admin and bus-owner get list of  vehicle/bus start of end location
locationController.locationList = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq = {
      isDeleted: false,
    };
    let sortq = { "english.location": 1 };
    let selectq;
    let populate;
    let { location } = req.query;

    let datas = await responseHelper.getquerySendResponse(
      locationSch,
      page,
      size,
      sortq,
      searchq,
      selectq,
      next,
      populate
    );

    if (req.query.page && !isNaN(req.query.page) && req.query.page != 0) {
      page = Math.abs(req.query.page);
    } else {
      page = 1;
    }
    if (req.query.size && !isNaN(req.query.size) && req.query.size != 0) {
      size = Math.abs(req.query.size);
    } else {
      size = datas.totaldata;
    }

    let newFilter = datas.data.filter(
      (a) =>
        a.english.location.toLowerCase().match(location.toLowerCase()) ||
        a.amharic.location.toLowerCase().match(location.toLowerCase()) ||
        a.oromifa.location.toLowerCase().match(location.toLowerCase())
    );

    if (location) {
      return responseHelper.paginationSendResponse(
        res,
        httpStatus.OK,
        true,
        newFilter,
        config.get,
        page,
        size,
        datas.totaldata
      );
    }

    return responseHelper.paginationSendResponse(
      res,
      httpStatus.OK,
      true,
      datas.data,
      config.get,
      page,
      size,
      datas.totaldata
    );
  } catch (err) {
    next(err);
  }
};

//@desc customer get list of  vehicle/bus start of end location
locationController.locationListCustomer = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq = { isDeleted: false };
    let sortq = { "english.location": 1 };
    let selectq;
    let populate;
    let { location } = req.query;

    location
      ? (searchq[`${req.query.language}.location`] = {
          $regex: location,
          $options: "i",
        })
      : (searchq = searchq);

    if (req.query.page && !isNaN(req.query.page) && req.query.page != 0) {
      page = Math.abs(req.query.page);
    } else {
      page = 1;
    }

    if (req.query.size && !isNaN(req.query.size) && req.query.size != 0) {
      size = Math.abs(req.query.size);
    }
    let datas = await responseHelper.getquerySendResponse(
      locationSch,
      page,
      size,
      sortq,
      searchq,
      selectq,
      next,
      populate
    );
    if (!req.query.size) {
      size = datas.totaldata;
    }

    return responseHelper.paginationSendResponse(
      res,
      httpStatus.OK,
      true,
      datas.data,
      config.get,
      page,
      size,
      datas.totaldata
    );
  } catch (err) {
    next(err);
  }
};

//@desc details of vehicle/bus start of end location
locationController.locationDetails = async (req, res, next) => {
  try {
    const location = await locationSch.findOne({ _id: req.params.location_id });

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      location,
      null,
      config.get,
      null
    );
  } catch (err) {
    next(err);
  }
};

module.exports = locationController;
