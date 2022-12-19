const bookingSch = require("../booking/bookingSchema");
const ticketSch = require("../ticket/ticketSchema");
const fcmTokenSch = require("../user/fcmToken");
const notificationSch = require("./notificationSchema");
const notificationHelper = require("../../helper/notificationHelper");
const httpStatus = require("http-status");
const responseHelper = require("../../helper/responseHelper");
const config = require("./notificationConfig");
const scheduler = require("node-schedule");
const moment = require("moment");
const _ = require("lodash");
const {
  format,
  endOfWeek,
  addDays,
  differenceInHours,
  differenceInMinutes,
} = require("date-fns");
const paymentSchema = require("../payment/paymentSchema");

const notificationController = {};

//@desc get ticked notification details
notificationController.getDetails = async (req, res, next) => {
  try {
    const ticketDetails = await ticketSch
      .findOne({ _id: req.params["ticket_id"] })
      .populate({
        path: "booking_id",
        populate: {
          path: "bus_id payment_id",
          populate: {
            path: "route_id",
            select: "to from",
            populate: { path: "to from", select: "english amharic oromifa" },
          },
        },
      });

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

//@desc get notification list
notificationController.getList = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq = { user_id: req.user.authUser["_id"] };
    let sortq = "-_id";
    let selectq;
    let populate;

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
    await notificationSch.updateMany(
      { user_id: req.user.authUser["_id"] },
      { $set: { isSeen: true } }
    );

    let datas = await responseHelper.getquerySendResponse(
      notificationSch,
      page,
      size,
      sortq,
      searchq,
      selectq,
      next,
      populate
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
  } catch (err) {
    next(err);
  }
};

//@desc get notification list
notificationController.getListGuestUser = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq = { unique_id: req.params["unique_id"] };
    let sortq = "-_id";
    let selectq;
    let populate;

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

    await notificationSch.updateMany(
      { unique_id: req.params["unique_id"] },
      { $set: { isSeen: true } }
    );

    let datas = await responseHelper.getquerySendResponse(
      notificationSch,
      page,
      size,
      sortq,
      searchq,
      selectq,
      next,
      populate
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
  } catch (err) {
    next(err);
  }
};

//@desc enable notifiation
notificationController.enableNotification = async (req, res, next) => {
  try {
    let filter = { unique_id: req.params["unique_id"] };
    if (req.query["user_id"]) {
      filter = { user_id: req.query["user_id"] };
    }
    const notificationEnabled = await fcmTokenSch.findOne(filter);
    if (notificationEnabled.enable_notification == true) {
      await fcmTokenSch.findOneAndUpdate(filter, {
        $set: { enable_notification: false },
      });
    } else {
      await fcmTokenSch.findOneAndUpdate(filter, {
        $set: { enable_notification: true },
      });
    }
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      null,
      null,
      config.put,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc notification information
notificationController.notificationInfo = async (req, res, next) => {
  try {
    const notification = await fcmTokenSch.findOne({
      unique_id: req.params["unique_id"],
    });
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      notification,
      null,
      config.get,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc notification information
notificationController.notificationCount = async (req, res, next) => {
  try {
    let filter = { unique_id: req.params["unique_id"], isSeen: false };
    if (req.query["user_id"]) {
      filter = { user_id: req.query["user_id"], isSeen: false };
    }
    const notification = await notificationSch.findOne(filter).countDocuments();
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      notification,
      null,
      config.get,
      null
    );
  } catch (err) {
    next(err);
  }
};

//Cron-job to notify one hour prior departure
scheduler.scheduleJob("1 * * * * *", async () => {
  try {
    const date = new Date();
    const newdate = format(new Date(date), config.validate.DATE_FORMAT);

    const formatDate = moment(newdate).format("YYYY-MM-DD");
    const now_utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

    const title = "Departure";
    const amTitle = "መነሻ";
    const orTitle = "Ka’umsa";
    const body = "Ticket you have booked is departing in one hour";
    const amBody = " ያስያዙት ትኬት በአንድ ሰአት ውስጥ ይነሳል";
    const orBody = "Tikeetiin qabsiistan sa'a tokko keessaatti ni ka'a";

    let find_bookings = await bookingSch
      .find(
        {
          ticketed_by: "online-app",
          date: formatDate,
          isPaid: true,
          isDeleted: false,
        },
        "bus_id payment_id ticket_id"
      )
      .populate({ path: "bus_id" });

    // const bibashabc = find_bookings.toJSON();

    find_bookings = find_bookings
      .map((a) => a.toJSON())
      .map((a) => {
        return { ...a, ticket: JSON.stringify(a.ticket_id) };
      });

    find_bookings = _.uniqBy(find_bookings, "ticket");

    for (let i = 0; i < find_bookings.length; i++) {
      const time = find_bookings[i].bus_id.departure.trim();

      const lessTime = moment(new Date())
        .add(1, "hours")
        .format("HH:mm ")
        .trim();

      if (time == lessTime) {
        /* notify through push notification */
        const ticket = await ticketSch
          .findOne({ _id: find_bookings[i].ticket_id, isCanceled: false })
          .populate({
            path: "booking_id",
            populate: {
              path: "bus_id payment_id",
              populate: {
                path: "route_id",
                select: "to from",
                populate: {
                  path: "to from",
                  select: "english amharic oromifa",
                },
              },
            },
          });
        const data = JSON.stringify(ticket._id);

        const unique_id = ticket.booking_id[0].unique_id
          ? ticket.booking_id[0].unique_id
          : null;
        const user_id = ticket.booking_id[0].added_by
          ? ticket.booking_id[0].added_by
          : null;

        let user_token = await fcmTokenSch.findOne({ user_id: user_id });
        if (user_token == null) {
          user_token = await fcmTokenSch.findOne({ unique_id: unique_id });
        }

        if (user_token.enable_notification != true) {
          continue;
        }

        const token = [user_token.fcm_token];

        const message = {
          notification: {
            title: title,
            body: body,
          },
          data: { ticket_id: data },
        };

        notificationHelper(token, message);
        const english = {
          title: title,
          body: body,
        };
        const oromifa = {
          title: orTitle,
          body: orBody,
        };
        const amharic = {
          title: amTitle,
          body: amBody,
        };

        /* save notification to view history */
        const notification = new notificationSch({
          user_id: user_token.user_id ? user_token.user_id : null,
          fcm_token: user_token.fcm_token,
          unique_id: unique_id,
          english: english,
          oromifa: oromifa,
          amharic: amharic,
          ticket_id: ticket._id,
        });
        await notification.save();
      }
    }
  } catch (err) {
    throw err;
  }
});

module.exports = notificationController;
