const reviewSch = require("./reviewSchema");
const vehicleSch = require("./../vehicle/vehicleSchema");
const busSch = require("./../buses/busSchema");
const httpStatus = require("http-status");
const responseHelper = require("../../helper/responseHelper");
const config = require("./reviewConfig");
const moment = require("moment");

const review = {};

//@desc Add vehicle/bus details
review.addUserReview = async (req, res, next) => {
  try {
    const bus_id = req.params["bus_id"];
    let user_id = req.body["userId"];
    console.log("data", user_id, typeof user_id);
    if (user_id) {
      try {
        user_id = JSON.parse(user_id);
      } catch (error) {
        
      }
    }
    console.log(user_id, typeof user_id);
    let reviewDetails = new reviewSch({
      user_id: req.body.user_id,
      firstname: req.body["firstname"],
      lastname: req.body["lastname"],
      bus_id: bus_id,
      punctuality: req.body["punctuality"],
      service: req.body["service"],
      sanitation: req.body["sanitation"],
      comfort: req.body["comfort"],
      comment: req.body["comment"],
    });
    reviewDetails["average"] =
      (reviewDetails.punctuality +
        reviewDetails.service +
        reviewDetails.sanitation +
        reviewDetails.comfort) /
      4;

    const addReview = await reviewDetails.save();
    const find_data = await reviewSch.find({ bus_id: bus_id });
    const total = find_data.length;

    const sum = find_data.reduce(
      (init, f) => (f.average ? f.average + init : init),
      0
    );
    const review = parseFloat(sum / total).toFixed(2);

    const sumPunctuality = find_data.reduce(
      (init, f) => (f.punctuality ? f.punctuality + init : init),
      0
    );
    const averagePunctuality = parseFloat(sumPunctuality / total).toFixed(2);

    const sumService = find_data.reduce(
      (init, f) => (f.service ? f.service + init : init),
      0
    );
    const averageService = parseFloat(sumService / total).toFixed(2);

    const sumSanitation = find_data.reduce(
      (init, f) => (f.sanitation ? f.sanitation + init : init),
      0
    );
    const averageSanitation = parseFloat(sumSanitation / total).toFixed(2);

    const sumComfort = find_data.reduce(
      (init, f) => (f.comfort ? f.comfort + init : init),
      0
    );
    const averageComfort = parseFloat(sumComfort / total).toFixed(2);

    const updateAverageReview = await busSch.findOneAndUpdate(
      { _id: bus_id },
      {
        $set: {
          review: {
            average: review,
            punctuality: averagePunctuality,
            service: averageService,
            sanitation: averageSanitation,
            comfort: averageComfort,
          },
        },
      }
    );

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      addReview,
      null,
      config.post,
      null
    );
  } catch (err) {
    next(err);
  }
};
review.getReviewList = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq = {};
    let sortq = "-_id";
    let selectq;
    let populate = {
      path: "user_id",
      select: "-password",
    };
    let populate2 = {
      path: "bus_id",
    };

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
    let datas = await responseHelper.getquerySendResponse(
      reviewSch,
      page,
      size,
      sortq,
      searchq,
      selectq,
      next,
      populate,
      populate2
    );
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
  } catch (error) {
    next(error);
  }
};
review.getWebReviewList = async (req, res, next) => {
  try {
    const size_default = 9;
    let page;
    let size;
    let searchq = { isPublic: true };
    let sortq = "-_id";
    let selectq;
    let populate = {
      path: "user_id",
      select: "-password",
    };
    let populate2 = {
      path: "bus_id",
    };

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
    let datas = await responseHelper.getquerySendResponse(
      reviewSch,
      page,
      size,
      sortq,
      searchq,
      selectq,
      next,
      populate,
      populate2
    );
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
  } catch (error) {
    next(error);
  }
};

review.updateReviewStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const review = await reviewSch.findOne({ _id: id });
    if (review) {
      review.isPublic = req.body["isPublic"];
      review.updated_by = req.user.authUser["_id"];

      review.save();
      return responseHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        review,
        null,
        config.updateStatus,
        null
      );
    }
    return responseHelper.sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      null,
      null,
      true,
      config.notFound,
      null
    );
  } catch (error) {
    next(error);
  }
};
review.deleteReview = async (req, res, next) => {
  try {
    const id = req.params.id;
    const existReview = await reviewSch.findOne({ _id: id });
    const bus_id = existReview.bus_id;
    const find_data = await reviewSch.find({ bus_id: bus_id });
    if (existReview) {
      existReview.remove();

      const total = find_data.length;

      const sum = find_data.reduce(
        (init, f) => (f.average ? f.average + init : init),
        0
      );
      const review = parseFloat(sum / total).toFixed(2);

      const sumPunctuality = find_data.reduce(
        (init, f) => (f.punctuality ? f.punctuality + init : init),
        0
      );
      const averagePunctuality = parseFloat(sumPunctuality / total).toFixed(2);

      const sumService = find_data.reduce(
        (init, f) => (f.service ? f.service + init : init),
        0
      );
      const averageService = parseFloat(sumService / total).toFixed(2);

      const sumSanitation = find_data.reduce(
        (init, f) => (f.sanitation ? f.sanitation + init : init),
        0
      );
      const averageSanitation = parseFloat(sumSanitation / total).toFixed(2);

      const sumComfort = find_data.reduce(
        (init, f) => (f.comfort ? f.comfort + init : init),
        0
      );
      const averageComfort = parseFloat(sumComfort / total).toFixed(2);

      await busSch.findOneAndUpdate(
        { _id: bus_id },
        {
          $set: {
            review: {
              average: review,
              punctuality: averagePunctuality,
              service: averageService,
              sanitation: averageSanitation,
              comfort: averageComfort,
            },
          },
        }
      );

      return responseHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        review,
        null,
        config.delete,
        null
      );
    }
    return responseHelper.sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      null,
      null,
      true,
      config.notFound,
      null
    );
  } catch (error) {
    next(error);
  }
};

module.exports = review;
