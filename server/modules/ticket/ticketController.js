const ticketSch = require("./ticketSchema");
const bookingSch = require("./../booking/bookingSchema");
const busAllocationSch = require("./../busAllocation/busAllocationSchema");
const httpStatus = require("http-status");
const responseHelper = require("../../helper/responseHelper");
const config = require("./ticketConfig");
const { format, endOfWeek, addDays } = require("date-fns");
const moment = require("moment");

const ticketController = {};

//@desc create ticked for vehicle/bus
ticketController.getDetails = async (req, res, next) => {
  try {
    const ticketDetails = await bookingSch
      .findOne({ unique_id: req.body["unique_id"] })
      .populate({ path: "ticket" });

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      ticketDetails,
      null,
      config.get,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc GET: customer booking history list
ticketController.getBookingHistory = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq = {};
    let sortq = "-_id";
    let selectq;
    let { status } = req.query;
    let today = format(new Date(), config.validate.DATE_FORMAT);
    const time = moment(new Date()).format("HH:mm");

    const date_time = `${today}:${time}`;

    status == "history"
      ? (searchq = {
          date_time: { $lte: date_time },
        })
      : (searchq = {
          date_time: { $gt: date_time },
        });
    searchq = {
      ...searchq,
      user_id: req.user.authUser._id,
    };
    console.log("search", searchq);
    let populate = {
      path: "booking_id",
      match: { added_by: req.user.authUser._id },
      select:
        "bus_id isPaid position seat_number column_id row_id date back_id cabin_id code_id email firstname lastname phone payment_id created_at",
      populate: {
        path: "bus_id payment_id",
        select:
          "english amharic oromifa price departure arrival payment_gateway amount",
        populate: {
          path: "route_id",
          select: "to from",
          populate: { path: "to from", select: "english amharic oromifa" },
        },
      },
    };
    let populate2 = {
      path: "company_id",
      populate: {
        path: "user_id",
        select: "-password",
      },
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
      ticketSch,
      page,
      size,
      sortq,
      searchq,
      selectq,
      next,
      populate,
      populate2
    );
    let filter;
    filter = datas.data.filter((a) => a.booking_id[0]);
    console.log(datas.totaldata, filter.length);
    return responseHelper.paginationSendResponse(
      res,
      httpStatus.OK,
      true,
      filter,
      config.get,
      page,
      size,
      filter.length
    );
  } catch (err) {
    next(err);
  }
};

//@desc GET: guest user booking history list
ticketController.guestUserBookingHistory = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq = {};
    let sortq = "-_id";
    let selectq;
    let { status, unique_id } = req.query;
    let today = format(new Date(), config.validate.DATE_FORMAT);
    const time = moment(new Date()).format("HH:mm");
    const date_time = `${today}:${time}`;
    status == "history"
      ? (searchq = {
          date_time: { $lte: date_time },
        })
      : (searchq = {
          date_time: { $gt: date_time },
        });

    searchq = {
      ...searchq,
      unique_id: unique_id,
    };
    console.log("search", searchq);
    let populate = {
      path: "booking_id payment_id",
      match: { unique_id: unique_id },
      select:
        "bus_id isPaid position seat_number column_id row_id date back_id cabin_id code_id email firstname lastname phone payment_id created_at unique_id",
      populate: {
        path: "bus_id payment_id",
        select:
          "english amharic oromifa price departure arrival payment_gateway amount",
        populate: {
          path: "route_id",
          select: "to from",
          populate: { path: "to from", select: "english amharic oromifa" },
        },
      },
    };
    let populate2 = {
      path: "company_id",
      populate: {
        path: "user_id",
        select: "-password",
      },
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
      ticketSch,
      page,
      size,
      sortq,
      searchq,
      selectq,
      next,
      populate,
      populate2
    );

    const filter = datas.data.filter((a) => a.booking_id[0]);
    return responseHelper.paginationSendResponse(
      res,
      httpStatus.OK,
      true,
      filter,
      config.get,
      page,
      size,
      datas.totaldata
    );
  } catch (err) {
    next(err);
  }
};

//@desc Patch: validator > validate ticket
ticketController.validateTicket = async (req, res, next) => {
  try {
    const { ticket_id, bus_id } = req.params;

    const bus_allocation = await busAllocationSch.findOne({
      user_id: req.user.authUser["_id"],
      bus_id: bus_id,
    });

    const data = await ticketSch
      .findOne(
        { read_ticket_id: ticket_id.trim() },
        "-created_at -updated_at -added_by -updated_by"
      )
      .populate({
        path: "booking_id",
        select: "-created_at -updated_at -added_by -updated_by",
        populate: {
          path: "bus_id payment_id",
          select:
            "-recurring -operation_date -created_at -updated_at -added_by -updated_by",
          populate: {
            path: "route_id",
            select: "to from",
            populate: { path: "to from", select: "english amharic oromifa" },
          },
        },
      });

    if (!bus_allocation) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        config.validate.notAllocated,
        null
      );
    } else if (!data) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        config.validate.invalidId,
        null
      );
    } else if (data.booking_id[0].bus_id._id != bus_id) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        config.validate.invalidId,
        null
      );
    } else if (data.booking_id[0].status === "reserved") {
      return responseHelper.sendResponse(
        res,
        httpStatus.OK,
        false,
        data,
        null,
        config.validate.notConfirm,
        null
      );
    } else if (data.isCanceled == true) {
      return responseHelper.sendResponse(
        res,
        httpStatus.OK,
        false,
        data,
        null,
        config.validate.canceled,
        null
      );
    } else if (data.isValidated == true) {
      return responseHelper.sendResponse(
        res,
        httpStatus.OK,
        false,
        data,
        null,
        config.validate.validated,
        null
      );
    }
    const validate = await ticketSch.findOneAndUpdate(
      { read_ticket_id: ticket_id },
      { $set: { isValidated: true } }
    );

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      data,
      null,
      config.update,
      null
    );
  } catch (err) {
    next(err);
  }
};

module.exports = ticketController;
