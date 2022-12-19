const companySch = require("./companySchema");
const userSch = require("../user/userSchema");
const httpStatus = require("http-status");
const responseHelper = require("../../helper/responseHelper");
const config = require("./companyConfig");
const busSch = require("../buses/busSchema");
const busTypeSch = require("../busType/busTypeSchema");
const routeSch = require("../route/routeSchema");
const locationSch = require("../location/locationSchema");
const bookingSch = require("../booking/bookingSchema");
const moment = require("moment");
const accessTokenSch = require("../user/accessToken");

const companyController = {};

//@desc Add bus company by super admin
companyController.listCompany = async (req, res, next) => {
  try {
    const size_default = 1000;
    let page;
    let size;
    let searchq = { isDeleted: false };
    let sortq = "-_id";
    let selectq;
    let populate = { path: "user_id", select: "-password" };
    let { search, isActive } = req.query;
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

    isActive ? (searchq["isActive"] = isActive) : (searchq = searchq);
    let datas = await responseHelper.getquerySendResponse(
      companySch,
      page,
      size,
      sortq,
      searchq,
      selectq,
      next,
      populate
    );
    let newFilter;
    if (search) {
      newFilter = datas.data.filter(
        (a) =>
          a.english.bus_name.toLowerCase().match(search.toLowerCase()) ||
          a.amharic.bus_name.toLowerCase().match(search.toLowerCase()) ||
          a.oromifa.bus_name.toLowerCase().match(search.toLowerCase()) ||
          a.english.contact_name.toLowerCase().match(search.toLowerCase()) ||
          a.amharic.contact_name.toLowerCase().match(search.toLowerCase()) ||
          a.oromifa.contact_name.toLowerCase().match(search.toLowerCase()) ||
          a.english.bus_legal_name.toLowerCase().match(search.toLowerCase()) ||
          a.amharic.bus_legal_name.toLowerCase().match(search.toLowerCase()) ||
          a.oromifa.bus_legal_name.toLowerCase().match(search.toLowerCase()) ||
          a.english.address.toLowerCase().match(search.toLowerCase()) ||
          a.amharic.address.toLowerCase().match(search.toLowerCase()) ||
          a.oromifa.address.toLowerCase().match(search.toLowerCase())
      );

      return responseHelper.paginationSendResponse(
        res,
        httpStatus.OK,
        true,
        newFilter,
        config.get,
        page,
        size,
        newFilter.length
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

//@desc details of bus company
companyController.companyDetails = async (req, res, next) => {
  try {
    const location = await companySch
      .findOne({ _id: req.params.company_id })
      .populate({ path: "user_id", select: "-password" });

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

//@desc delete bus company
companyController.deleteCompany = async (req, res, next) => {
  try {
    const company_id = req.params.company_id;

    const nowDate = Date.now();
    const convertDate = moment(nowDate).format("YYYY-MM-DD");

    const booked_bus = await bookingSch.findOne({
      company_id: company_id,
      date: { $gte: convertDate },
    });
    const bus = await busSch.findOne({ company_id: company_id });

    if (booked_bus) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        config.invlaidDelete,
        null
      );
    }
    const user = await userSch.find({ company_id: company_id });
    const userId = user.map((a) => a._id);

    await accessTokenSch.remove({ user_id: userId });

    await companySch.findOneAndUpdate(
      {
        _id: company_id,
      },
      {
        $set: { isDeleted: true },
      }
    );
    await userSch.updateMany(
      { company_id: company_id },
      {
        $set: { isDeleted: true },
      }
    );
    await busSch.updateMany(
      {
        company_id: { $in: company_id },
      },
      {
        $set: { isDeleted: true },
      }
    );
    await busTypeSch.updateMany(
      {
        company_id: { $in: company_id },
      },
      {
        $set: { isDeleted: true },
      }
    );

    const route = await routeSch.find({});

    if (route) {
      for (let j = 0; j < route.length; j++) {
        for (let i = 0; i < route[j].added_by.length; i++) {
          if (
            JSON.stringify(route[j].added_by[i].company_id) ==
            JSON.stringify(req.user.authUser["company_id"])
          ) {
            route[j].added_by[i].remove();

            route.save();
          }
        }
      }
    }

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      null,
      null,
      config.delete,
      null
    );
  } catch (err) {
    next(err);
  }
};

module.exports = companyController;
