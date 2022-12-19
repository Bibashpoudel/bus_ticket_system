const busSch = require("./busSchema");
const outOfServiceSch = require("./cancelTripSchema");
const cancelTripSch = require("./cancelTripSchema");
const busAllocationSch = require("../busAllocation/busAllocationSchema");
const reviewSch = require("../review/reviewSchema");
const routeSch = require("../route/routeSchema");
const companySch = require("../company/companySchema");
const bookingSch = require("../booking/bookingSchema");
const httpStatus = require("http-status");
const responseHelper = require("../../helper/responseHelper");
const config = require("./busConfig");
const moment = require("moment");
const { addDays, format, getHours } = require("date-fns");
const paymentMethodSchema = require("../payment/paymentMethodSchema");
const scheduler = require("node-schedule");
const busFinanceSchema = require("./busFinanceSchema");
const paymentSchema = require("../payment/paymentSchema");
var ObjectId = require("mongodb").ObjectId;

const busController = {};

//@desc POST: Create bus
busController.addBus = async (req, res, next) => {
  try {
    const price = req.body["price"];

    const adminPayment = await paymentMethodSchema.findOne({
      company_id: null,
    });

    Object.assign(price, { usd: adminPayment.ticket_price_usd });
    const operationDate = req.body["operation_date"];

    operationDate.from = moment(operationDate.from).format("YYYY-MM-DD");
    operationDate.to = moment(operationDate.to).format("YYYY-MM-DD");
    const departureDate = req.body["departure"];

    let newDepartureDate;
    if (departureDate.split(":").length === 1) {
      newDepartureDate = `0${departureDate.split(":")[0]}:${
        departureDate.split(":")[1]
      }`;
    } else {
      newDepartureDate = departureDate;
    }

    let busDetails = new busSch({
      added_by: req.user.authUser["_id"],
      english: req.body["english"],
      amharic: req.body["amharic"],
      oromifa: req.body["oromifa"],
      route_id: req.body["route_id"],
      bus_type_id: req.body["bus_type_id"],
      departure: newDepartureDate,
      arrival: req.body["arrival"],
      price: price,
      operation_date: operationDate,
      recurring: req.body["recurring"],
      image: req.body["image"],
      company_id: req.user.authUser["company_id"],
    });

    await busDetails.save();
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      busDetails,
      null,
      config.post,
      null
    );
  } catch (err) {
    next(err);
  }
};

busController.addFinanceReport = async (req, res, next) => {
  try {
    const date = req.body["date"];
    const bus = await busSch.findOne({ _id: req.body["bus_id"] });
    const todayDate = Date.now();

    if (
      moment(date).format("YYYY-MM-DD") > moment(todayDate).format("YYYY-MM-DD")
    ) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        config.notDeparture,
        null,
        null
      );
    } else {
      if (bus) {
        if (bus.departure < moment(todayDate).format("hh:mm")) {
          return responseHelper.sendResponse(
            res,
            httpStatus.BAD_REQUEST,
            false,
            null,
            config.notDeparture,
            null,
            null
          );
        } else {
          const busFinanceDetails = await busFinanceSchema.findOne({
            bus_id: req.body["bus_id"],
            date: moment(date).format("YYYY-MM-DD"),
          });
          if (busFinanceDetails) {
            busFinanceDetails.isSettle = req.body["isSettle"];
            busFinanceDetails.updated_by = req.user.authUser["_id"];

            await busFinanceDetails.save();
            return responseHelper.sendResponse(
              res,
              httpStatus.OK,
              true,
              busFinanceDetails,
              null,
              config.put,
              null
            );
          } else {
            const newBusFinanceReport = new busFinanceSchema({
              bus_id: req.body["bus_id"],
              date: moment(date).format("YYYY-MM-DD"),
              issettle: req.body["isSettle"],
              settle_by: req.user.authUser["_id"],
            });
            await newBusFinanceReport.save();
            return responseHelper.sendResponse(
              res,
              httpStatus.CREATED,
              true,
              newBusFinanceReport,
              null,
              config.fundSettle,
              null
            );
          }
        }
      }
    }
  } catch (error) {
    next(err);
  }
};

//@desc get list of bus
busController.busList = async (req, res, next) => {
  try {
    const size_default = 2000;
    let page;
    let size;
    const bus_allocation = await busAllocationSch.find(
      { user_id: req.user.authUser["_id"] },
      "bus_id"
    );
    const bus_list = bus_allocation.map((a) => a.bus_id);
    let searchq = {
      company_id: req.user.authUser["company_id"],
      _id: { $in: bus_list },
      isDeleted: false,
    };
    let sortq = "-_id";
    let selectq;
    let populate = {
      path: "route_id bus_type_id",
      populate: { path: "to from", select: "english oromifa amharic" },
    };
    let populate2 = { path: "added_by", select: "-password" };
    let { search, route_id, to, from, company_id } = req.query;
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

    if (req.user.authUser["role"] == "bus-company") {
      searchq = {
        company_id: req.user.authUser["company_id"],
        isDeleted: false,
      };
    } else if (
      req.user.authUser["role"] == "super-admin" ||
      req.user.authUser["role"] == "admin"
    ) {
      searchq = { isDeleted: false };
    }
    if (company_id) {
      searchq = {
        ...searchq,
        company_id: company_id,
      };
    }
    if (route_id) {
      searchq = {
        ...searchq,
        route_id: route_id,
      };
    }
    const todate = moment(to).format("YYYY-MM-DD");
    const fromdate = moment(to).format("YYYY-MM-DD");
    if (to && from) {
      searchq = {
        ...searchq,
        $and: [
          { "operation_date.to": { $gte: todate } },
          { "operation_date.from": { $lte: fromdate } },
        ],
      };
    }

    let datas = await responseHelper.getquerySendResponse(
      busSch,
      page,
      size,
      sortq,
      searchq,
      selectq,
      next,
      populate,
      populate2
    );
    let newFilter;

    newFilter = datas.data;
    if (search) {
      newFilter = newFilter.filter(
        (a) =>
          a.english.name.toLowerCase().match(search.toLowerCase()) ||
          a.amharic.name.toLowerCase().match(search.toLowerCase()) ||
          a.oromifa.name.toLowerCase().match(search.toLowerCase())
      );
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
  } catch (err) {
    next(err);
  }
};

//@desc customer (common) get list of bus
busController.busListCustomer = async (req, res, next) => {
  try {
    const size_default = 25;
    let page;
    let size;
    let searchq = { isDeleted: false };
    let sortq = "-_id";
    let selectq;
    let { to, from, date, min, max, bus_type_id, keyWord, language, type } =
      req.query;
    const yearDate = moment.utc(date).format("YYYY-MM-DD");
    let populate = {
      path: "added_by route_id bus_type_id",
      select: "-password",
      populate: {
        path: "to from",
        select: " english amharic oromifa",
      },
    };
    let populate1 = {
      path: "SeatBookingsCountAll",
      match: { date: yearDate, isDeleted: false },
    };
    const utc_date = moment.utc(date).format("YYYY-MM-DD");
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
    const cancelBus = await cancelTripSch.find(
      {
        date: moment.utc(date).format("YYYY-MM-DD"),
      },
      "bus_id"
    );

    let cancelBusList;
    if (cancelBus.length != 0) {
      cancelBusList = cancelBus.map((a) => a.bus_id);
      searchq = {
        ...searchq,
        bus_id: { $nin: cancelBusList },
      };
    }

    if (keyWord != undefined && keyWord != "") {
      if (language == "english") {
        searchq = {
          ...searchq,
          "english.name": { $regex: keyWord, $options: "i" },
        };
      } else if (language == "amharic") {
        searchq = {
          ...searchq,
          "amharic.name": { $regex: keyWord, $options: "i" },
        };
      } else if (language == "oromifa") {
        searchq = {
          ...searchq,
          "oromifa.name": { $regex: keyWord, $options: "i" },
        };
      }
    }

    const totalSeat = function (obj) {
      const { bus_type_id } = obj;
      const total =
        (bus_type_id.bus_type_column_left
          ? bus_type_id.bus_type_column_left.number
          : 0) *
          (bus_type_id.bus_type_row_left
            ? bus_type_id.bus_type_row_left.number
            : 0) +
        (bus_type_id.bus_type_column_right
          ? bus_type_id.bus_type_column_right.number
          : 0) *
          (bus_type_id.bus_type_row_right
            ? bus_type_id.bus_type_row_right.number
            : 0) +
        (bus_type_id.bus_type_cabin.number
          ? bus_type_id.bus_type_cabin.number
          : 0) +
        (bus_type_id.bus_type_back.number
          ? bus_type_id.bus_type_back.number
          : 0);

      return total;
    };

    date
      ? (searchq = {
          ...searchq,
          $and: [
            { "operation_date.to": { $gte: utc_date } },
            { "operation_date.from": { $lte: utc_date } },
          ],
        })
      : (searchq = searchq);
    const routeList = await routeSch.find().populate({
      path: "to from",
    });

    let routeId = [];

    if (to && from) {
      routeId = routeList.filter(
        (a) =>
          (a.to.english.location.toLowerCase().match(to.toLowerCase()) ||
            a.to.amharic.location.toLowerCase().match(to.toLowerCase()) ||
            a.to.oromifa.location.toLowerCase().match(to.toLowerCase())) &&
          (a.from.english.location.toLowerCase().match(from.toLowerCase()) ||
            a.from.amharic.location.toLowerCase().match(from.toLowerCase()) ||
            a.from.oromifa.location.toLowerCase().match(from.toLowerCase()))
      );
    } else if (to) {
      routeId = routeList.filter((a) => {
        return (
          a.to.english.location.toLowerCase().match(to.toLowerCase()) ||
          a.to.amharic.location.toLowerCase().match(to.toLowerCase()) ||
          a.to.oromifa.location.toLowerCase().match(to.toLowerCase())
        );
      });
    }
    let disableRoute = [];
    let allId = [];
    if (routeId.length != 0) {
      routeId.map((a) => allId.push(new ObjectId(`${a._id}`)));
      searchq = {
        ...searchq,
        route_id: { $in: allId },
      };
      routeId.map((a) => {
        a.added_by.map((b) => {
          if (b.isActive == false) {
            disableRoute.push(b.company_id);
          }
        });
      });
    }
    const company = await companySch.find();
    let inActiveComp = [];
    company.map((a) => {
      if (a.isActive == false) {
        inActiveComp.push(a._id);
      }
    });
    if (inActiveComp.length != 0) {
      searchq = {
        ...searchq,
        company_id: { $nin: inActiveComp },
      };
    }
    if (disableRoute.length != 0) {
      searchq = {
        ...searchq,
        company_id: {
          $nin: { ...searchq.company_id.$nin, ...disableRoute },
        },
      };
    }

    if (from && to) {
      searchq = {
        ...searchq,
        route_id: { $in: allId },
      };
    }
    if (
      moment(date).format("YYYY-MM-DD") ===
      moment(Date.now()).format("YYYY-MM-DD")
    ) {
      searchq = {
        ...searchq,
        departure: { $gte: moment(Date.now()).format("HH:mm") },
      };
    }
    if (type == "upcomming") {
    }
    console.log("final search", searchq);
    let datas = await responseHelper.getquerySendResponse(
      busSch,
      page,
      size,
      sortq,
      searchq,
      selectq,
      next,
      populate,
      populate1
    );

    let newFilter = datas.data;

    if (bus_type_id) {
      newFilter = newFilter.filter(
        (a) =>
          a.bus_type_id.english.bus_type
            .toLowerCase()
            .match(bus_type_id.toLowerCase()) ||
          a.bus_type_id.english.bus_type
            .toLowerCase()
            .match(bus_type_id.toLowerCase()) ||
          a.bus_type_id.english.bus_type
            .toLowerCase()
            .match(bus_type_id.toLowerCase())
      );
    }

    //random the value of array
    newFilter = newFilter.sort(() => 0.5 - Math.random());

    // sort according to departure time
    newFilter = newFilter.sort((a, b) => {
      if (a.departure < b.departure) return -1;
    });

    const adminPaymentMethod = await paymentMethodSchema.findOne({
      company_id: null,
    });

    const displayPrice = async function (obj) {
      const company = await companySch.findOne({
        _id: obj.company_id,
      });

      const commission = company.commission_rate
        ? company.commission_rate / 100
        : 0;
      const processingCharge = adminPaymentMethod.telebirr_charge
        ? adminPaymentMethod.telebirr_charge / 100
        : 0;
      const price = obj.price.birr ? obj.price.birr : 0;
      const display_price =
        commission * price + processingCharge * price + price;

      return display_price;
    };
    // newFilter = newFilter.filter((a) => a.added_by.isActive === true);

    let newData = await Promise.all(
      newFilter.map(async (item) => ({
        ...item._doc,
        total_seat: await totalSeat(item._doc),
        display_price: await displayPrice(item._doc),
        available_seat:
          (await totalSeat(item._doc)) - item.SeatBookingsCountAll.length,
      }))
    );

    if (max && min) {
      newData = newData.filter((a) => {
        return (
          a.display_price >= parseInt(min) && a.display_price <= parseInt(max)
        );
      });
    }

    if (
      moment(date).format("YYYY-MM-DD") <
      moment(new Date()).format("YYYY-MM-DD")
    ) {
      newData = [];
      return responseHelper.paginationSendResponse(
        res,
        httpStatus.OK,
        true,
        newData,
        config.get,
        page,
        size,
        newData.length
      );
    } else {
      return responseHelper.paginationSendResponse(
        res,
        httpStatus.OK,
        true,
        newData,
        config.get,
        page,
        size,
        max && min ? newData.length : datas.totaldata
      );
    }
  } catch (err) {
    next(err);
  }
};

//@desc details of bus
busController.busDetails = async (req, res, next) => {
  try {
    const bus_id = req.params.bus_id;
    const date = req.query.date;
    const route = await busSch
      .findOne({ _id: bus_id })
      .populate({
        path: "route_id bus_type_id",
        populate: { path: "to from", select: "english oromifa amharic" },
      })
      .populate({
        path: "added_by",
      });
    const company = await companySch.findOne({
      _id: route.company_id,
    });
    const adminPaymentMethod = await paymentMethodSchema.findOne({
      company_id: null,
    });

    const booking_details = await bookingSch
      .find({
        bus_id: bus_id,
        isDeleted: false,
        date: date,
      })
      .populate({ path: "ticket_id" });

    const outOfService = await outOfServiceSch.findOne({
      bus_id: bus_id,
      date: date,
    });

    const commission = company
      ? company.commission_rate
        ? company.commission_rate / 100
        : 0
      : 0;
    const processingCharge = adminPaymentMethod.telebirr_charge
      ? adminPaymentMethod.telebirr_charge / 100
      : 0;
    const price = route.price.birr ? route.price.birr : 0;
    const display_price = commission * price + processingCharge * price + price;
    let response = {};
    if (
      req.user.authUser["role"] === "super-admin" ||
      req.user.authUser["role"] === "admin"
    ) {
      response = {
        ...route._doc,
        booking_details,
        outOfService: outOfService ? true : false,
        display_price: display_price,
      };
    } else {
      response = {
        ...route._doc,
        booking_details,
        outOfService: outOfService ? true : false,
      };
    }

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      response,
      null,
      config.get,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc details of bus for customer
busController.busDetailsCustomer = async (req, res, next) => {
  try {
    const bus_id = req.params.bus_id;
    const date = req.query.date;

    const route = await busSch
      .findOne({ _id: bus_id })
      .populate({
        path: "added_by",
        select: "-password",
      })
      .populate({
        path: "route_id bus_type_id",
        populate: { path: "to from", select: "english amharic oromifa" },
      });
    if (!route) {
      return responseHelper.sendResponse(
        res,
        httpStatus.NOT_FOUND,
        true,
        null,
        null,
        config.notFound,
        null
      );
    }
    if (!date) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        true,
        null,
        null,
        config.dateRequired,
        null
      );
    }

    const booking_details = await bookingSch.find({
      bus_id: bus_id,
      isDeleted: false,
      date: moment(date).format("YYYY-MM-DD"),
    });
    const outOfService = await outOfServiceSch.findOne({
      bus_id: bus_id,
      date: date,
    });
    const adminPaymentMethod = await paymentMethodSchema.findOne({
      company_id: null,
    });

    const company = await companySch.findOne({
      _id: route.company_id,
    });
    const processingCharge = adminPaymentMethod.telebirr_charge
      ? adminPaymentMethod.telebirr_charge / 100
      : 0;

    const commissionRate = company.commission_rate
      ? company.commission_rate / 100
      : 0;

    const price = route.price.birr;

    const displayPrice =
      processingCharge * price + commissionRate * price + price;

    const telebirrAccount = adminPaymentMethod.telebirr_account;

    //const displayPrice ;
    const total_seat =
      (route.bus_type_id.bus_type_column_left.number
        ? route.bus_type_id.bus_type_column_left.number
        : 0) *
        (route.bus_type_id.bus_type_row_left.number
          ? route.bus_type_id.bus_type_row_left.number
          : 0) +
      (route.bus_type_id.bus_type_column_right.number
        ? route.bus_type_id.bus_type_column_right.number
        : 0) *
        (route.bus_type_id.bus_type_row_right.number
          ? route.bus_type_id.bus_type_row_right.number
          : 0) +
      (route.bus_type_id.bus_type_cabin.number
        ? route.bus_type_id.bus_type_cabin.number
        : 0) +
      (route.bus_type_id.bus_type_back.number
        ? route.bus_type_id.bus_type_back.number
        : 0);

    const available_seats = total_seat - booking_details.length;

    const comments = await reviewSch
      .find({ bus_id: bus_id })
      .populate({
        path: "user_id SeatBooking",
        select: "firstname lastname image email",
      })
      .sort("-_id");

    const response = {
      ...route._doc,
      booking_details,
      outOfService: outOfService ? true : false,
      total_seat,
      display_price: displayPrice,
      adminTelebirr: telebirrAccount,
      available_seats,
      comments,
    };

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      response,
      null,
      config.get,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc update bus details
busController.updateBus = async (req, res, next) => {
  try {
    const operationDate = req.body["operation_date"];

    operationDate.from = moment(operationDate.from).format("YYYY-MM-DD");
    operationDate.to = moment(operationDate.to).format("YYYY-MM-DD");
    const departureDate = req.body["departure"];

    let newDepartureDate;
    if (departureDate.split(":").length === 1) {
      newDepartureDate = `0${departureDate.split(":")[0]}:${
        departureDate.split(":")[1]
      }`;
    } else {
      newDepartureDate = departureDate;
    }

    await busSch.findOneAndUpdate(
      { _id: req.params.bus_id },
      {
        $set: {
          english: req.body["english"],
          amharic: req.body["amharic"],
          oromifa: req.body["oromifa"],
          route_id: req.body["route_id"],
          bus_type_id: req.body["bus_type_id"],
          departure: newDepartureDate,
          arrival: req.body["arrival"],
          price: req.body["price"],
          operation_date: operationDate,
          recurring: req.body["recurring"],
          image: req.body["image"],
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

//@desc delete bus details
busController.deleteBus = async (req, res, next) => {
  try {
    const bus_id = req.params.bus_id;
    const date = Date.now();
    const booking = await bookingSch.findOne({
      bus_id: bus_id,
      date: { $lt: date },
    });
    if (booking) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        config.validate.invalidBus,
        null
      );
    }
    await busSch.findOneAndUpdate(
      { _id: bus_id },
      { $set: { isDeleted: true } }
    );

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

//@desc get list of bus
busController.scheduleList = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let { route_id, date } = req.query;
    let sortq = "-_id";
    let selectq;
    const bus_allocation = await busAllocationSch.find(
      { user_id: req.user.authUser["_id"] },
      "bus_id"
    );
    const bus_list = bus_allocation.map((a) => a.bus_id);

    const cancelTrip = await cancelTripSch.find(
      {
        date: moment(date).format("YYYY-MM-DD"),
      },
      "bus_id"
    );
    const Company = await companySch.find({ isActive: false });

    let inActiveCompany = [];
    if (Company.length != 0) {
      inActiveCompany = Company.map((a) => a._id);
    }

    let cancelBusList = [];
    if (cancelTrip.length != 0) {
      cancelBusList = cancelTrip.map((a) => a.bus_id);
    }
    let searchq = {
      isDeleted: false,
      $and: [
        {
          "operation_date.to": { $gte: moment(date).format("YYYY-MM-DD") },
        },
        { "operation_date.from": { $lte: moment(date).format("YYYY-MM-DD") } },
      ],
    };
    if (bus_list.length >= 1) {
      searchq = {
        ...searchq,
        isDeleted: false,
        _id: { $in: bus_list },
      };
    }

    if (inActiveCompany.length >= 1) {
      searchq = {
        ...searchq,
        company_id: { $nin: inActiveCompany },
      };
    }

    if (cancelBusList.length >= 1) {
      searchq = {
        ...searchq,
        _id: { ...searchq._id, $nin: cancelBusList },
      };
    }

    let populate = {
      path: "added_by",
      select: "-password",
    };
    let populate1 = {
      path: "route_id bus_type_id",
      populate: { path: "to from", select: "english oromifa amharic" },
    };
    let newDate = moment(date).format("YYYY-MM-DD");
    let populate2 = {
      path: "SeatBookings",
      match: { date: newDate, status: { $ne: "canceled" }, isDeleted: false },
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

    if (
      req.user.authUser.role == "super-admin" ||
      req.user.authUser.role == "admin"
    ) {
      searchq = {
        ...searchq,
      };
    } else if (req.user.authUser["role"] == "bus-company") {
      searchq = {
        ...searchq,
        company_id: {
          ...searchq.company_id,
          $in: [req.user.authUser["company_id"]],
        },
      };
    }

    const totalSeat = function (obj) {
      const { bus_type_id } = obj;

      const total =
        (bus_type_id.bus_type_column_left.number
          ? bus_type_id.bus_type_column_left.number
          : 0) *
          (bus_type_id.bus_type_row_left.number
            ? bus_type_id.bus_type_row_left.number
            : 0) +
        (bus_type_id.bus_type_column_right.number
          ? bus_type_id.bus_type_column_right.number
          : 0) *
          (bus_type_id.bus_type_row_right.number
            ? bus_type_id.bus_type_row_right.number
            : 0) +
        (bus_type_id.bus_type_cabin.number
          ? bus_type_id.bus_type_cabin.number
          : 0) +
        (bus_type_id.bus_type_back.number
          ? bus_type_id.bus_type_back.number
          : 0);
      return total;
    };

    if (route_id) {
      searchq = {
        ...searchq,
        route_id: route_id,
      };
    } else {
      searchq = {
        ...searchq,
      };
    }

    if (
      moment.utc(date).format("YYYY-MM-DD") ===
      moment.utc(Date.now()).format("YYYY-MM-DD")
    ) {
      searchq = {
        ...searchq,
        departure: { $gte: moment(Date.now()).format("HH:mm") },
      };
    }

    console.log("final search", searchq);

    let datas = await responseHelper.getquerySendResponse(
      busSch,
      page,
      size,
      sortq,
      searchq,
      selectq,
      next,
      populate,
      populate1,
      populate2
    );
    //console.log("bus", datas.data);
    let newFilter;

    if (date) {
      if (
        moment(date).format("YYYY-MM-DD") <
        moment(Date.now()).format("YYYY-MM-DD")
      ) {
        let newData = [];
        return responseHelper.paginationSendResponse(
          res,
          httpStatus.OK,
          true,
          newData,
          config.get,
          page,
          size,
          newData.length
        );
      } else {
        newFilter = datas.data;
      }
      newFilter = datas.data;
      let newArray1 = [];

      if (req.user.authUser["role"] === "bus-company") {
        newFilter.map((a) =>
          a.route_id.added_by.map((b) => {
            if (
              JSON.stringify(b.company_id) ===
              JSON.stringify(req.user.authUser["company_id"])
            ) {
              if (b.isActive === true) {
                newArray1.push(a);
              }
            }
          })
        );
      } else {
        newFilter.map((a) =>
          a.route_id.added_by.map((b) => {
            if (JSON.stringify(a.company_id) === JSON.stringify(b.company_id)) {
              if (b.isActive === true) {
                newArray1.push(a);
              }
            }
          })
        );
      }

      const testObj = {
        1: "monday",
        2: "tuesday",
        3: "wednesday",
        4: "thursday",
        5: "friday",
        6: "saturday",
        7: "sunday",
      };
      const week = moment(date).isoWeekday();

      let newArray2 = newArray1.filter((a) => {
        return a.recurring[testObj[week]];
      });

      newArray2 = newArray2.sort((a, b) => {
        if (a.departure < b.departure) return -1;
      });

      let newData = newArray2.map((item) => ({
        ...item._doc,
        ...item.$$populatedVirtuals,
        total_seat: totalSeat(item._doc),
        available_seat: totalSeat(item._doc) - item.SeatBookings.length,
      }));

      return responseHelper.paginationSendResponse(
        res,
        httpStatus.OK,
        true,
        newData,
        config.get,
        page,
        size,
        datas.totaldata
      );
    }

    let newData = datas.data.map((item) => ({
      ...item._doc,
      ...item.$$populatedVirtuals,
      total_seat: totalSeat(item._doc),
      available_seat: totalSeat(item._doc) - item.SeatBookings.length,
    }));

    return responseHelper.paginationSendResponse(
      res,
      httpStatus.OK,
      true,
      newData,
      config.get,
      page,
      size,
      datas.totaldata
    );
  } catch (err) {
    next(err);
  }
};

// @desc cancel trip (out of service)
busController.cancelTrip = async (req, res, next) => {
  try {
    let cancelTrip = new cancelTripSch({
      added_by: req.user.authUser["_id"],
      bus_id: req.body["bus_id"],
      date: moment(req.body["date"]).format("YYYY-MM-DD"),
    });

    await cancelTrip.save();
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      cancelTrip,
      null,
      config.post,
      null
    );
  } catch (err) {
    next(err);
  }
};

busController.cancelTripList = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    const bus_id = req.params["bus_id"];
    let searchq = {
      bus_id: bus_id,
    };
    let sortq = "-_id";
    let selectq;
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
      cancelTripSch,
      page,
      size,
      sortq,
      searchq,
      selectq,
      next
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

// @desc delete trip (out of service)
busController.deleteOutOfServiceTrip = async (req, res, next) => {
  try {
    await cancelTripSch.findOneAndDelete({ _id: req.params.outOfService });

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

//@desc GET: finance list //dead code
busController.financeListNew = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq = {};
    let sortq = "-_id";
    let selectq;
    let { bus_number, start_date, end_date } = req.query;

    let populate = {
      path: "route_id bus_type_id company SeatBookings ",
      populate: { path: "to from", select: "english amharic oromifa" },
    };
    if (req.query.page && !isNaN(req.query.page) && req.query.page != 0) {
      page = Math.abs(req.query.page);
    } else {
      page = 1;
    }
    if (req.query.size && !isNaN(req.query.size) && req.query.size != 0) {
      size = Math.abs(req.query.size);
    }

    start_date
      ? (searchq = {
          $and: [
            { "operation_date.to": { $gte: end_date } },
            { "operation_date.from": { $lte: start_date } },
          ],
        })
      : (searchq = searchq);

    let datas = await responseHelper.getquerySendResponse(
      busSch,
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

    let newFilter = datas.data.filter(
      (a) =>
        a.english.bus_number.match(bus_number) ||
        a.amharic.bus_number.match(bus_number) ||
        a.oromifa.bus_number.match(bus_number)
    );

    let app_commission = function (obj) {
      const commissionRate = obj.company.commission_rate;
      const totalIncome = obj.SeatBookings.length * obj.price.usd;
      const commission = totalIncome ? (commissionRate / totalIncome) * 100 : 0;
      return parseFloat(commission.toFixed(3));
    };

    let newData = newFilter.map((item) => ({
      ...item._doc,
      collection: item.SeatBookings.length * item.price.usd,
      processing_charge: 100,
      app_commission: app_commission(item),
      total_income:
        item.SeatBookings.length * item.price.usd - app_commission(item),
    }));

    return responseHelper.paginationSendResponse(
      res,
      httpStatus.OK,
      true,
      newData,
      config.get,
      page,
      size,
      datas.totaldata
    );
  } catch (err) {
    next(err);
  }
};

busController.financeList = async (req, res, next) => {
  try {
    const { start_date, end_date, bus_number } = req.query;
    let dateRanges = [];
    let dataSets1 = [];
    let size_default = 10;
    let page;
    let size;
    page = req.query.page;
    size = req.query.size;
    const bus_allocation = await busAllocationSch.find(
      { user_id: req.user.authUser["_id"] },
      "bus_id"
    );
    const bus_list = bus_allocation.map((a) => a.bus_id);
    let { route_id, company_id } = req.query;

    let select = {
      company_id: req.user.authUser["company_id"],
      _id: { $in: bus_list },
    };

    if (
      req.user.authUser["role"] == "super-admin" ||
      req.user.authUser.role == "admin"
    ) {
      select = {};
    } else if (req.user.authUser["role"] == "bus-company") {
      select = { company_id: req.user.authUser["company_id"] };
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

    const bookingList = await bookingSch.find().sort({ date: -1 }).limit(1);
    let newDate = [];
    if (bookingList) {
      bookingList.map((a) => {
        newDate.push(a.date);
      });
    }

    if (
      moment(start_date).format("YYYY-MM-DD") ===
      moment(end_date).format("YYYY-MM-DD")
    ) {
      dateRanges = await generateGraphTimeline(
        moment(start_date).format("YYYY-MM-DD"),
        moment(newDate[0]).format("YYYY-MM-DD")
      );
    } else {
      dateRanges = await generateGraphTimeline(
        moment(start_date).format("YYYY-MM-DD"),
        moment(end_date).format("YYYY-MM-DD")
      );
    }

    let busDetails = await busSch.find(select).exec();

    if (company_id) {
      busDetails = busDetails.filter(
        (a) => JSON.stringify(a.company_id) == JSON.stringify(company_id)
      );
    }

    if (route_id) {
      busDetails = busDetails.filter(
        (a) => JSON.stringify(a.route_id) == JSON.stringify(route_id)
      );
    }
    if (bus_number) {
      busDetails = busDetails.filter(
        (a) => JSON.stringify(a._id) == JSON.stringify(bus_number)
      );
    }

    const companyFinanceDetail = await Promise.all(
      busDetails.map(async (bd, index) => {
        const getFinanceReport = (bus_id, date) => {
          return bookingSch.aggregate([
            {
              $match: {
                bus_id: bus_id,
                date: date,
                status: "sold-out",
              },
            },
            {
              $group: {
                _id: null,
                total_seat: { $sum: 1 },
                ticketed_by: {
                  $first: "$ticketed_by",
                },

                onlineTickets: {
                  $sum: {
                    $cond: [
                      {
                        $ne: ["$ticketed_by", "counter"],
                      },
                      { $sum: 1 },
                      0,
                    ],
                  },
                },
              },
            },
            { $skip: (page - 1) * size },
            { $limit: size * 1 },
          ]);
        };

        const financeDetails = await Promise.all(
          dateRanges.map(async (dr) => getFinanceReport(bd._id, dr.start))
        );

        let app_commission = async function (id, date) {
          const payment = await paymentSchema
            .find({ bus_id: id._id, booked_date: date })
            .populate({
              path: "booking_id",
              select:
                "bus_id status isPaid date position seat_number firstname lastname email phone ticketed_by",
              match: { bus_id: id._id, date: date, status: "sold-out" },
            });

          const totalAmount = payment.reduce((t, a) => {
            if (a.status === "paid") {
              t = t + (a.comission ? a.comission : 0);
            }
            return t;
          }, 0);
          return parseFloat(totalAmount.toFixed(3));
        };

        // const adminPaymentMethod = await paymentMethodSchema.findOne({
        //   company_id: null,
        // });
        let processing_charge = async function (id, date) {
          const payment = await paymentSchema
            .find({ bus_id: id._id, booked_date: date })
            .populate({
              path: "booking_id",
              select:
                "bus_id status isPaid date position seat_number firstname lastname email phone ticketed_by",
              match: { bus_id: id._id, date: date, status: "sold-out" },
            });

          const totalAmount = payment.reduce((t, a) => {
            if (a.status === "paid") {
              t = t + (a.processing ? a.processing : 0);
            }
            return t;
          }, 0);

          return parseFloat(totalAmount.toFixed(3));
        };
        let finance_report_status = async function (id, date) {
          const busFinanceReport = await busFinanceSchema.findOne({
            bus_id: id._id,
            date: date,
          });

          return busFinanceReport;
        };
        let totalCollection = async function (id, date) {
          const payment = await paymentSchema
            .find({ bus_id: id._id, booked_date: date })
            .populate({
              path: "booking_id",
              select:
                "bus_id status isPaid date position seat_number firstname lastname email phone ticketed_by",
              match: { bus_id: id._id, date: date, status: "sold-out" },
            });

          const totalAmount = payment.reduce((t, a) => {
            if (a.status === "paid") {
              t =
                t +
                ((a.bus_fee ? a.bus_fee : 0) +
                  (a.comission ? a.comission : 0) +
                  (a.processing ? a.processing : 0));
            }
            return t;
          }, 0);
          return parseFloat(totalAmount.toFixed(3));
        };
        let totalTicket = async function (id, date) {
          const numberOfSeat = await bookingSch
            .find({ bus_id: id._id, date: date, status: "sold-out" })
            .count();
          return numberOfSeat;
        };

        collection = await Promise.all(
          financeDetails.map(async (fd, index) => ({
            ...fd[index],
            bus_details: bd,
            collection: fd[0]?.total_seat
              ? fd[0]?.total_seat * bd.price.birr
              : 0,
            commission_rate: bd.company ? bd.company.commission_rate : 0,
            app_commission: await app_commission(
              bd,
              dateRanges.map((dr) => dr.start)[index]
            ),
            total_income: await totalCollection(
              bd,
              dateRanges.map((dr) => dr.start)[index]
            ),

            processing_charge: await processing_charge(
              bd,
              dateRanges.map((dr) => dr.start)[index]
            ),

            financeReportStatus: await finance_report_status(
              bd,
              dateRanges.map((dr) => dr.start)[index]
            ),
            date: dateRanges.map((dr) => dr.start)[index],
            totalTicket: await totalTicket(
              bd,
              dateRanges.map((dr) => dr.start)[index]
            ),
          }))
        );

        dataSets1.push(collection);
      })
    );

    let dataSets = dataSets1.flat();

    dataSets = dataSets.filter((a) => a.collection > 0);

    dataSets = dataSets.sort((a, b) => {
      return +new Date(b.date) - +new Date(a.date);
    });

    const response = {
      dataSets,
      dateRanges,
    };
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      response,
      null,
      config.get,
      null
    );
  } catch (err) {
    next(err);
  }
};

/* - - - - - Admin dashboard APIs start- - - - - */

//@desc Get: Dashboard latest bookings and departure
busController.adminDashboard = async (req, res, next) => {
  try {
    const today = format(new Date(new Date()), config.validate.DATE_FORMAT);
    const day = format(new Date(), "EEEE").toLowerCase();
    const company_id = req.user.authUser["company_id"];

    /*
      user allocated bus is obtain
   */
    const bus_allocation = await busAllocationSch.find(
      { user_id: req.user.authUser["_id"] },
      "bus_id"
    );

    /* 
      Map the bus_id
    */
    const bus_list = bus_allocation.map((a) => a.bus_id);

    /* 
      get the cancel bus list in the given date
    */
    const cancelTrip = await cancelTripSch.find(
      {
        date: moment(today).format("YYYY-MM-DD"),
      },
      "bus_id"
    );

    /* 
      map the bus id of the obtain list
    */

    let cancelBusList = [];
    if (cancelTrip.length != 0) {
      cancelBusList = cancelTrip.map((a) => a.bus_id);
    }

    /* 
      get the company list which is deactivated
    */
    const Company = await companySch.find({ isActive: false });

    /* 
      map the id of deactivate company
    */
    let inActiveCompany = [];
    if (Company.length != 0) {
      inActiveCompany = Company.map((a) => a._id);
    }

    //get all list of route
    const routeList = await routeSch.find();

    /* 
      get the company id by checking the status of route for each company
    */
    let disableRoute = [];
    routeList.map((a) => {
      a.added_by.map((b) => {
        if (b.isActive == false) {
          disableRoute.push(b.company_id);
        }
      });
    });

    let select = {
      date: today,
      status: "sold-out",
      company_id: company_id,
      bus_id: { $in: bus_list },
    };
    let select_bus = {
      $and: [
        { "operation_date.to": { $gte: today } },
        { "operation_date.from": { $lte: today } },
      ],
      isDeleted: false,
      company_id: { $nin: [...inActiveCompany, ...disableRoute] },
      _id: { $nin: cancelBusList },
    };
    let select_route = {};

    if (
      req.user.authUser["role"] == "super-admin" ||
      req.user.authUser["role"] == "admin"
    ) {
      select = { date: today, status: "sold-out" };
      select_bus = { ...select_bus, isDeleted: false };
      select_route = {};
    } else {
      select_bus = {
        ...select_bus,
        company_id: { ...select_bus.company_id.$nin, $in: company_id },
      };
    }

    const latest_booking = await bookingSch.find(select);

    if (
      req.user.authUser["role"] != "super-admin" &&
      req.user.authUser["role"] != "admin" &&
      req.user.authUser["role"] != "bus-company"
    ) {
      select_bus = {
        ...select_bus,
        _id: { ...select_bus._id.$nin, $in: bus_list },
      };
    }

    console.log("searchq", select_bus);
    const total_bus = await busSch.find(select_bus);

    if (
      req.user.authUser["role"] !== "super-admin" &&
      req.user.authUser["role"] !== "admin" &&
      req.user.authUser["role"] == "bus-company"
    ) {
      select_route = {
        "added_by.company_id": { $in: req.user.authUser["company_id"] },
      };
    }
    // if (bus_list.length >= 0) {
    //   select_bus = {
    //     ...select_bus,
    //     _id: { ...select_bus._id.$nin, $in: bus_list },
    //   };
    // }

    const bus_route = await routeSch.find(select_route).countDocuments();
    let isOutOfService = {};

    let new_departure = total_bus.filter(
      (a) =>
        a.operation_date.from <= Date.now() && a.operation_date.to >= Date.now()
    );
    const totalCompany = await companySch
      .find({
        isActive: true,
        isDeleted: false,
      })
      .count();

    const response = {
      new_bookings: latest_booking.length,
      new_departure: new_departure.length,
      total_bus: total_bus.length,
      total_route: bus_route,
      total_company: totalCompany,
    };

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      response,
      null,
      config.get,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc admin dashboard next departure list
busController.departureList = async (req, res, next) => {
  try {
    let size_default = 10;
    let page;
    let size;

    const today = format(new Date(new Date()), config.validate.DATE_FORMAT);
    const bus_allocation = await busAllocationSch.find(
      { user_id: req.user.authUser["_id"] },
      "bus_id"
    );

    //check the cancel trip bus list
    const cancelTrip = await cancelTripSch.find(
      {
        date: moment(today).format("YYYY-MM-DD"),
      },
      "bus_id"
    );
    //map the the bus id of cancel trip bus
    let cancelBusList = [];
    if (cancelTrip.length != 0) {
      cancelBusList = cancelTrip.map((a) => a.bus_id);
    }
    //get all company
    const Company = await companySch.find({ isActive: false });

    // map the list id of inactive company
    let inActiveCompany = [];
    if (Company.length != 0) {
      inActiveCompany = Company.map((a) => a._id);
    }
    //get all list of route
    const routeList = await routeSch.find();

    let disableRoute = [];
    routeList.map((a) => {
      a.added_by.map((b) => {
        if (b.isActive == false) {
          disableRoute.push(b.company_id);
        }
      });
    });

    let searchq = {
      $and: [
        { "operation_date.to": { $lte: today } },
        { "operation_date.from": { $gte: today } },
      ],
      isDeleted: false,
      company_id: { $nin: [...inActiveCompany, ...disableRoute] },
      _id: { $nin: cancelBusList },
    };

    let sortq = "-_id";
    let selectq;
    let populate = {
      path: "route_id bus_type_id",
      populate: { path: "to from", select: "english oromifa amharic" },
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

    if (
      req.user.authUser.role == "super-admin" ||
      req.user.authUser["role"] == "admin"
    ) {
      searchq = { ...searchq };
    } else if (req.user.authUser.role == "bus-company") {
      searchq = {
        ...searchq,
        company_id: {
          ...searchq.company_id.$nin,
          $in: req.user.authUser["company_id"],
        },
      };
    } else {
    }
    const bus_list = bus_allocation.map((a) => a.bus_id);
    if (bus_list.length >= 0) {
      searchq = {
        ...searchq,
        _id: { ...searchq._id.$nin, $in: bus_list },
      };
    }

    let datas = await responseHelper.getquerySendResponse(
      busSch,
      page,
      size,
      sortq,
      searchq,
      selectq,
      next,
      populate
    );

    let newFilter = datas.data;
    newFilter = newFilter.filter((a) => {
      return a.departure >= moment(new Date()).format("HH:mm");
    });

    let newData = newFilter.map((item) => ({
      ...item._doc,
      ...item.$$populatedVirtuals,
    }));

    return responseHelper.paginationSendResponse(
      res,
      httpStatus.OK,
      true,
      newData,
      config.get,
      page,
      size,
      datas.totaldata
    );
  } catch (err) {
    next(err);
  }
};

/* - - - - - Internal functions - - - - - */

function generateGraphTimeline(start_date, end_date) {
  start_date = format(new Date(start_date), config.validate.DATE_FORMAT);
  end_date = format(new Date(end_date), config.validate.DATE_FORMAT);
  const dates = [];
  while (start_date <= end_date) {
    dates.push({ start: start_date, end: start_date });
    let nextDayDate = addDays(new Date(start_date), 1);
    start_date = format(new Date(nextDayDate), config.validate.DATE_FORMAT);
  }
  return dates;
}
// scheduler.scheduleJob("1 * * * * *", async () => {
//   const bus = await busSch.find({ isDeleted: false });
//   const date = new Date();
//   const now_utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
//   console.log("iam busfincncereport creater");
//   for (let i = 0; i < bus.length; i++) {
//     if (
//       moment(date).format("YYYY-MM-DD") >=
//         moment(bus[i].operation_date.from).format("YYYY-MM-DD") &&
//       moment(date).format("YYYY-MM-DD") <=
//         moment(bus[i].operation_date.to).format("YYYY-MM-DD")
//     ) {
//       if (bus[i].departure >= moment(date).format("hh:mm")) {
//         const busFinanceDetails = await busFinanceSchema.findOne({
//           bus_id: bus[i]._id,
//           date: moment(date).format("YYYY-MM-DD"),
//         });
//         if (!busFinanceDetails) {
//           console.log("create");
//           const newBusFinance = new busFinanceSchema({
//             bus_id: bus[i]._id,
//             isSettel: false,
//             date: moment(date).format("YYYY-MM-DD"),
//           });
//           await newBusFinance.save();
//         }
//       }
//     }
//   }
// });

module.exports = busController;
