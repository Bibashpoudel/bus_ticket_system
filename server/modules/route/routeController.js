const routeSch = require("./routeSchema");
const busSch = require("../buses/busSchema");
const httpStatus = require("http-status");
const responseHelper = require("../../helper/responseHelper");
const config = require("./routeConfig");

const routeController = {};

//@desc Add vehicle/bus route
routeController.addRoute = async (req, res, next) => {
  try {
    const { to, from } = req.body;
    const user = req.user.authUser["company_id"];
    const details = {
      company_id: req.user.authUser["company_id"],
      distance: req.body["distance"],
    };

    if (to == from) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        config.validate.invalidLocation,
        null
      );
    }

    const route = await routeSch.find({});
    for (let i = 0; i < route.length; i++) {
      if (route[i].from._id == from && route[i].to._id == to) {
        const dataaaa = route[i].added_by.find(
          (index) => JSON.stringify(index.company_id) === JSON.stringify(user)
        );
        if (dataaaa) {
          return responseHelper.sendResponse(
            res,
            httpStatus.BAD_REQUEST,
            false,
            null,
            null,
            config.validate.duplicateRoute,
            null
          );
        }

        route[i].added_by.push(details);
        route[i].save();

        return responseHelper.sendResponse(
          res,
          httpStatus.OK,
          true,
          route,
          null,
          config.post,
          null
        );
      }
    }

    let routeDetails = new routeSch({
      added_by: details,
      to: to,
      from: from,
    });
    routeDetails.save();

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      routeDetails,
      null,
      config.post,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc update vehicle/bus route
routeController.updateRoute = async (req, res, next) => {
  try {
    const details = {
      company_id: req.user.authUser["company_id"],
      distance: req.body["distance"],
      isActive: req.body["isActive"],
    };

    const route = await routeSch.findOne({ _id: req.params.route_id });
    if (route) {
      for (let i = 0; i < route.added_by.length; i++) {
        if (
          JSON.stringify(route.added_by[i].company_id) ==
          JSON.stringify(req.user.authUser["company_id"])
        ) {
          route.added_by[i] = details;
          route.save();
          return responseHelper.sendResponse(
            res,
            httpStatus.OK,
            true,
            req.body,
            null,
            config.put,
            null
          );
        }
      }
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        "Route not exist",
        null
      );
    }
  } catch (err) {
    next(err);
  }
};

//@desc delete vehicle/bus route
routeController.deleteRoute = async (req, res, next) => {
  try {
    const route_id = req.params.route_id;
    const busroute = await busSch.findOne({
      route_id: route_id,
      added_by: req.user.authUser["company_id"],
    });

    if (busroute) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        config.validate.routeExists,
        null
      );
    }

    const route = await routeSch.findOne({ _id: req.params.route_id });
    if (route) {
      for (let i = 0; i < route.added_by.length; i++) {
        if (
          JSON.stringify(route.added_by[i].company_id) ==
          JSON.stringify(req.user.authUser["company_id"])
        ) {
          route.added_by[i].remove();

          route.save();

          return responseHelper.sendResponse(
            res,
            httpStatus.OK,
            true,
            req.body,
            null,
            config.put,
            null
          );
        }
      }
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        "Route not exist",
        null
      );
    }
  } catch (err) {
    next(err);
  }
};

//@desc get list of  route
routeController.routeList = async (req, res, next) => {
  try {
    const size_default = 1000;
    let page;
    let size;
    let company_id = req.query["company_id"];

    let searchq = {
      isDeleted: false,

      added_by: { $ne: [] },
    };
    let sortq = "_id";
    let selectq;
    let { search, language } = req.query;
    let populate = {
      path: "to from",
      select: language,
      options: { sort: { "english.location": 1 } },
    };

    if (
      req.user.authUser.role == "super-admin" ||
      req.user.authUser.role == "admin"
    ) {
      searchq = { isDeleted: false, added_by: { $ne: [] } };
    }
    let datas = await responseHelper.getquerySendResponse(
      routeSch,
      page,
      size,
      sortq,
      searchq,
      selectq,
      next,
      populate
    );
    let newFilter = [];

    if (
      req.user.authUser.role !== "super-admin" &&
      req.user.authUser.role !== "admin"
    ) {
      for (let i = 0; i < datas.data.length; i++) {
        for (let j = 0; j < datas.data[i].added_by.length; j++) {
          if (
            JSON.stringify(datas.data[i].added_by[j].company_id) ==
            JSON.stringify(req.user.authUser["company_id"])
          ) {
            const newData = datas.data[i].added_by.find(
              (a) =>
                JSON.stringify(a.company_id) ===
                JSON.stringify(req.user.authUser["company_id"])
            );

            newFilter.push({ ...datas.data[i].toJSON(), added_by: newData });
          }
        }
      }
    } else if (req.user.authUser["company_id"]) {
      if (
        req.user.authUser.role === "super-admin" ||
        req.user.authUser.role === "admin"
      ) {
        for (let i = 0; i < datas.data.length; i++) {
          for (let j = 0; j < datas.data[i].added_by.length; j++) {
            if (
              JSON.stringify(datas.data[i].added_by[j].company_id) ==
              JSON.stringify(company_id)
            ) {
              newFilter.push(datas.data[i]);
            }
          }
        }
      }
    } else {
      newFilter = datas.data;
    }
    if (search) {
      newfilter = newFilter.filter(
        (a) =>
          a.from.english.location.toLowerCase().match(search.toLowerCase()) ||
          a.from.amharic.location.toLowerCase().match(search.toLowerCase()) ||
          a.from.oromifa.location.toLowerCase().match(search.toLowerCase()) ||
          a.to.english.location.toLowerCase().match(search.toLowerCase()) ||
          a.to.amharic.location.toLowerCase().match(search.toLowerCase()) ||
          a.to.oromifa.location.toLowerCase().match(search.toLowerCase())
      );
    }
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

    // if (req.query.page && !isNaN(req.query.page) && req.query.page != 0) {
    //   page = Math.abs(req.query.page);
    // } else {
    //   page = 1;
    // }
    // if (req.query.size && !isNaN(req.query.size) && req.query.size != 0) {
    //   size = Math.abs(req.query.size);
    // } else {
    //   size = datas.length;
    // }

    // if (search) {
    //   newFilter.filter((a) => a.from.english.location.match(search) || a.from.amharic.location.match(search) || a.from.oromifa.location.match(search) || a.to.english.location.match(search) || a.to.amharic.location.match(search) || a.to.oromifa.location.match(search));
    //   return responseHelper.paginationSendResponse(res, httpStatus.OK, true, newFilter, config.get, page, size, datas.totaldata);
    // }
    // return responseHelper.paginationSendResponse(res, httpStatus.OK, true, datas.data, config.get, page, size, datas.totaldata);
  } catch (err) {
    next(err);
  }
};

//@desc details of route
routeController.routeDetails = async (req, res, next) => {
  try {
    const route = await routeSch
      .findOne({ _id: req.params.route_id, isDeleted: { $ne: true } })
      .populate({ path: "to from", select: "english amharic oromifa" });

    // if (JSON.stringify(datas.data[i].added_by[j].company_id) == JSON.stringify(req.user.authUser['company_id'])) {
    //   const newroute = { ...datas.data[i], added_by: datas.data[i].added_by.filter((a) => JSON.stringify(a.company_id) === JSON.stringify(req.user.authUser['company_id'])) };
    // }
    const newRoute = route.toJSON();
    let newData = {};
    if (route) {
      newData = route.added_by.find(
        (a) =>
          JSON.stringify(a.company_id) ===
          JSON.stringify(req.user.authUser["company_id"])
      );
    }
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      { ...newRoute, added_by: newData },
      null,
      config.get,
      null
    );
  } catch (err) {
    next(err);
  }
};

module.exports = routeController;
