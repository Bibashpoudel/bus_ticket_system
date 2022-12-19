const bookingSch = require("./bookingSchema");
const vehicleSch = require("./../vehicle/vehicleSchema");
const paymentSch = require("./../payment/paymentSchema");
const busAllocationSch = require("../busAllocation/busAllocationSchema");
const busSch = require("./../buses/busSchema");
const ticketSch = require("./../ticket/ticketSchema");
const httpStatus = require("http-status");
const responseHelper = require("../../helper/responseHelper");
const config = require("./bookingConfig");
const scheduler = require("node-schedule");
const moment = require("moment");
const { format, endOfWeek, addDays } = require("date-fns");
const { nodemailer } = require("./../../helper/nodemailer");
const companySchema = require("../company/companySchema");
const paymentMethodSchema = require("../payment/paymentMethodSchema");
const notificationSchema = require("../notification/notificationSchema");
const fcmTokenSch = require("../user/fcmToken");
const notificationHelper = require("../../helper/notificationHelper");
const _ = require("lodash");
const { default: parseISO } = require("date-fns/parseISO");
const { getTimeFormatter } = require("../../helper/dateConverter");
const { paginationSendResponse } = require("../../helper/responseHelper");

const booking = {};

//@desc book vehicle/bus
booking.vehicleBooking = async (req, res, next) => {
  try {
    const vehicle_id = req.params["vehicle_id"];
    let bookingDetails = new bookingSch({
      bus_id: vehicle_id,
      booked_seat: req.body["booked_seat"],
      seat_position: req.body["seat_position"],
      unique_id: req.body["unique_id"],
    });

    const findSeat = await vehicleSch.findOne({ _id: vehicle_id });
    let index;
    //update seat when booked or cancelled booking
    switch (req.body.seat_position) {
      case "right":
        index = findSeat.seat_plan.rightRowsSeatNumbering.findIndex(
          (i) => i.id == req.body.booked_seat
        );
        if (index > -1) {
          let newData = [...findSeat.seat_plan.rightRowsSeatNumbering];
          if (req.body.unique_id == newData[index]?.unique_id) {
            if (newData[index].isBooked) {
              newData[index].isBooked = false;
              newData[index].unique_id = null;
              const cancelBooking = await vehicleSch.findOneAndUpdate(
                { _id: vehicle_id },
                {
                  $set: { ["seat_plan.rightRowsSeatNumbering"]: newData },
                  available_seats: findSeat.available_seats + 1,
                }
              );
              if (cancelBooking) {
                await bookingSch.remove({
                  isPaid: false,
                  vehicle_id: vehicle_id,
                  booked_seat: req.body.booked_seat,
                  unique_id: req.body.unique_id,
                });
              }
              return responseHelper.sendResponse(
                res,
                httpStatus.OK,
                true,
                null,
                null,
                "Booking cancelled",
                null
              );
            } else {
              newData[index].isBooked = true;
              newData[index].unique_id = req.body.unique_id;
              await vehicleSch.findOneAndUpdate(
                { _id: vehicle_id },
                {
                  $set: {
                    ["seat_plan.rightRowsSeatNumbering"]: newData,
                    available_seats: findSeat.available_seats - 1,
                  },
                }
              );
            }
          } else {
            if (newData[index].isBooked) {
              return responseHelper.sendResponse(
                res,
                httpStatus.BAD_REQUEST,
                false,
                "Already Booked",
                null,
                "Already Booked",
                null
              );
            } else {
              newData[index].isBooked = true;
              newData[index].unique_id = req.body.unique_id;
              await vehicleSch.findOneAndUpdate(
                { _id: vehicle_id },
                {
                  $set: {
                    ["seat_plan.rightRowsSeatNumbering"]: newData,
                    available_seats: findSeat.available_seats - 1,
                  },
                }
              );
            }
          }
        } else {
          return responseHelper.sendResponse(
            res,
            httpStatus.BAD_REQUEST,
            false,
            "Seat Not found",
            null,
            "Seat Not found",
            null
          );
        }
        break;
      case "left":
        index = findSeat.seat_plan.leftRowsSeatNumbering.findIndex(
          (i) => i.id == req.body.booked_seat
        );
        if (index > -1) {
          let newData = [...findSeat.seat_plan.leftRowsSeatNumbering];
          if (req.body.unique_id == newData[index]?.unique_id) {
            if (newData[index].isBooked) {
              newData[index].isBooked = false;
              newData[index].unique_id = "";
              await vehicleSch.findOneAndUpdate(
                { _id: vehicle_id },
                {
                  $set: {
                    ["seat_plan.leftRowsSeatNumbering"]: newData,
                    available_seats: findSeat.available_seats + 1,
                  },
                }
              );
              return responseHelper.sendResponse(
                res,
                httpStatus.OK,
                true,
                null,
                null,
                "Booking cancelled",
                null
              );
            } else {
              newData[index].isBooked = true;
              newData[index].unique_id = req.body.unique_id;
              await vehicleSch.findOneAndUpdate(
                { _id: vehicle_id },
                {
                  $set: {
                    ["seat_plan.leftRowsSeatNumbering"]: newData,
                    available_seats: findSeat.available_seats - 1,
                  },
                }
              );
            }
          } else {
            if (newData[index].isBooked) {
              return responseHelper.sendResponse(
                res,
                httpStatus.BAD_REQUEST,
                false,
                "Already Booked",
                null,
                "Already Booked",
                null
              );
            } else {
              newData[index].isBooked = true;
              newData[index].unique_id = req.body.unique_id;
              await vehicleSch.findOneAndUpdate(
                { _id: vehicle_id },
                {
                  $set: {
                    ["seat_plan.leftRowsSeatNumbering"]: newData,
                    available_seats: findSeat.available_seats - 1,
                  },
                }
              );
            }
          }
        } else {
          return responseHelper.sendResponse(
            res,
            httpStatus.BAD_REQUEST,
            false,
            "Seat Not found",
            null,
            "Seat Not found",
            null
          );
        }
        break;
      case "cabin":
        index = findSeat.seat_plan.cabinSeatNumbering.findIndex(
          (i) => i.id == req.body.booked_seat
        );
        if (index > -1) {
          let newData = [...findSeat.seat_plan.cabinSeatNumbering];
          if (req.body.unique_id == newData[index]?.unique_id) {
            if (newData[index].isBooked) {
              newData[index].isBooked = false;
              newData[index].unique_id = "";
              await vehicleSch.findOneAndUpdate(
                { _id: vehicle_id },
                {
                  $set: {
                    ["seat_plan.cabinSeatNumbering"]: newData,
                    available_seats: findSeat.available_seats + 1,
                  },
                }
              );
              return responseHelper.sendResponse(
                res,
                httpStatus.OK,
                true,
                null,
                null,
                "Booking cancelled",
                null
              );
            } else {
              newData[index].isBooked = true;
              newData[index].unique_id = req.body.unique_id;
              await vehicleSch.findOneAndUpdate(
                { _id: vehicle_id },
                {
                  $set: {
                    ["seat_plan.cabinSeatNumbering"]: newData,
                    available_seats: findSeat.available_seats - 1,
                  },
                }
              );
            }
          } else {
            if (newData[index].isBooked) {
              return responseHelper.sendResponse(
                res,
                httpStatus.BAD_REQUEST,
                false,
                "Already Booked",
                null,
                "Already Booked",
                null
              );
            } else {
              newData[index].isBooked = true;
              newData[index].unique_id = req.body.unique_id;
              await vehicleSch.findOneAndUpdate(
                { _id: vehicle_id },
                {
                  $set: {
                    ["seat_plan.cabinSeatNumbering"]: newData,
                    available_seats: findSeat.available_seats - 1,
                  },
                }
              );
            }
          }
        } else {
          return responseHelper.sendResponse(
            res,
            httpStatus.BAD_REQUEST,
            false,
            "Seat Not found",
            null,
            "Seat Not found",
            null
          );
        }
        break;
      case "back":
        index = findSeat.seat_plan.backExtraSeatNumbering.findIndex(
          (i) => i.id == req.body.booked_seat
        );
        if (index > -1) {
          let newData = [...findSeat.seat_plan.backExtraSeatNumbering];
          if (req.body.unique_id == newData[index]?.unique_id) {
            if (newData[index].isBooked) {
              newData[index].isBooked = false;
              newData[index].unique_id = "";
              await vehicleSch.findOneAndUpdate(
                { _id: vehicle_id },
                {
                  $set: {
                    ["seat_plan.backExtraSeatNumbering"]: newData,
                    available_seats: findSeat.available_seats + 1,
                  },
                }
              );
              return responseHelper.sendResponse(
                res,
                httpStatus.OK,
                true,
                null,
                null,
                "Booking cancelled",
                null
              );
            } else {
              newData[index].isBooked = true;
              newData[index].unique_id = req.body.unique_id;
              await vehicleSch.findOneAndUpdate(
                { _id: vehicle_id },
                {
                  $set: {
                    ["seat_plan.backExtraSeatNumbering"]: newData,
                    available_seats: findSeat.available_seats - 1,
                  },
                }
              );
            }
          } else {
            if (newData[index].isBooked) {
              return responseHelper.sendResponse(
                res,
                httpStatus.BAD_REQUEST,
                false,
                "Already Booked",
                null,
                "Already Booked",
                null
              );
            } else {
              newData[index].isBooked = true;
              newData[index].unique_id = req.body.unique_id;
              await vehicleSch.findOneAndUpdate(
                { _id: vehicle_id },
                {
                  $set: {
                    ["seat_plan.backExtraSeatNumbering"]: newData,
                    available_seats: findSeat.available_seats - 1,
                  },
                }
              );
            }
          }
        } else {
          return responseHelper.sendResponse(
            res,
            httpStatus.BAD_REQUEST,
            false,
            "Seat Not found",
            null,
            "Seat Not found",
            null
          );
        }
        break;
      case "default":
        break;
    }
    const create_booking = await bookingDetails.save();

    //Remove booking if not confirmed in 10 minutes
    if (create_booking) {
      // schedule job for 10 minutes
      const job = await scheduler.scheduleJob("1 * * * * *", async () => {
        const booking_confirmed = await bookingSch.findOne({
          _id: bookingDetails._id,
        });
        console.log("Booking cancelled if not confirmed in 10 minutes");
        if (booking_confirmed.isPaid == false) {
          await bookingSch.deleteOne({ _id: bookingDetails._id });

          //booking cancelled, if not confirmed in 10 minutes
          switch (req.body.seat_position) {
            case "right":
              index = findSeat.seat_plan.rightRowsSeatNumbering.findIndex(
                (i) => i.id == req.body.booked_seat
              );
              if (index > -1) {
                let newData = [...findSeat.seat_plan.rightRowsSeatNumbering];

                newData[index].isBooked = false;
                newData[index].unique_id = null;
                await vehicleSch.findOneAndUpdate(
                  { _id: vehicle_id },
                  {
                    $set: {
                      ["seat_plan.rightRowsSeatNumbering"]: newData,
                      available_seats: findSeat.available_seats,
                    },
                  }
                );
                await scheduler.gracefulShutdown();
              }
              break;
            case "left":
              index = findSeat.seat_plan.leftRowsSeatNumbering.findIndex(
                (i) => i.id == req.body.booked_seat
              );
              if (index > -1) {
                let newData = [...findSeat.seat_plan.leftRowsSeatNumbering];

                newData[index].isBooked = false;
                newData[index].unique_id = null;
                await vehicleSch.findOneAndUpdate(
                  { _id: vehicle_id },
                  {
                    $set: {
                      ["seat_plan.leftRowsSeatNumbering"]: newData,
                      available_seats: findSeat.available_seats,
                    },
                  }
                );
                await scheduler.gracefulShutdown();
              }
              break;
            case "cabin":
              index = findSeat.seat_plan.cabinSeatNumbering.findIndex(
                (i) => i.id == req.body.booked_seat
              );
              if (index > -1) {
                let newData = [...findSeat.seat_plan.cabinSeatNumbering];

                newData[index].isBooked = false;
                newData[index].unique_id = null;
                await vehicleSch.findOneAndUpdate(
                  { _id: vehicle_id },
                  {
                    $set: {
                      ["seat_plan.cabinSeatNumbering"]: newData,
                      available_seats: findSeat.available_seats,
                    },
                  }
                );
                await scheduler.gracefulShutdown();
              }
              break;
            case "back":
              index = findSeat.seat_plan.backExtraSeatNumbering.findIndex(
                (i) => i.id == req.body.booked_seat
              );
              if (index > -1) {
                let newData = [...findSeat.seat_plan.backExtraSeatNumbering];

                newData[index].isBooked = false;
                newData[index].unique_id = null;
                await vehicleSch.findOneAndUpdate(
                  { _id: vehicle_id },
                  {
                    $set: {
                      ["seat_plan.backExtraSeatNumbering"]: newData,
                      available_seats: findSeat.available_seats,
                    },
                  }
                );
                await scheduler.gracefulShutdown();
              }
              break;
            case "default":
              break;
          }
        } else {
          await scheduler.gracefulShutdown();
        }
      });
    }

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      req.body,
      null,
      config.validate.booked,
      null
    );
  } catch (err) {
    next(err);
  }
};

// @desc create booking
booking.createBooking = async (req, res, next) => {
  try {
    let bookingDetails = {};
    const bus_id = req.params["bus_id"];
    const reqType = req.body["requestType"];
    const bus_company = await busSch.findOne({ _id: bus_id });
    const date = format(new Date(req.body.date), config.validate.DATE_FORMAT);

    if (reqType == "select") {
      if (req.body._id) {
        await bookingSch.findOneAndDelete({ _id: req.body._id });
        return responseHelper.sendResponse(
          res,
          httpStatus.OK,
          true,
          null,
          null,
          config.unSelect,
          null
        );
      }

      const isReserved = await bookingSch.findOne({
        bus_id: bus_id,
        position: req.body["position"],
        seat_number: req.body["seat_number"],
        date: date,
        isDeleted: false,
      });
      if (isReserved) {
        return responseHelper.sendResponse(
          res,
          httpStatus.BAD_REQUEST,
          false,
          null,
          null,
          config.validate.unavailable,
          null
        );
      }

      bookingDetails = new bookingSch({
        bus_id: bus_id,
        unique_id: req.body["unique_id"],
        position: req.body["position"],
        seat_number: req.body["seat_number"],
        column_id: req.body["column_id"],
        row_id: req.body["row_id"],
        cabin_id: req.body["cabin_id"],
        back_id: req.body["back_id"],
        date: date,
        company_id: bus_company["company_id"],
      });

      await bookingDetails.save();
      return responseHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        bookingDetails,
        null,
        config.validate.reserved,
        null
      );
    }

    let bookingRecords = req.body.bookingRecords;
    if (typeof bookingRecords === "string") {
      bookingRecords = JSON.parse(bookingRecords);
    }

    const bookingPromiseArray = bookingRecords.map((obj) =>
      bookingSch.findOneAndUpdate(
        { _id: obj._id },
        {
          $set: {
            bus_id: obj.bus_id,
            unique_id: obj.unique_id,
            position: obj.position,
            column_id: obj.column_id,
            row_id: obj.row_id,
            cabin_id: obj.cabin_id,
            back_id: obj.back_id,
            seat_number: obj.seat_number,
            date: date,
            firstname: obj.firstname,
            lastname: obj.lastname,
            dob: obj.dob,
            gender: obj.gender,
            email: obj.email,
            phone: obj.phone,
            code_id: obj.code_id,
            status: req.user
              ? req.user.authUser["role"] == "super-admin" ||
                req.user.authUser["role"] == "admin"
                ? "reserved"
                : "sold-out"
              : "sold-out",
            isPaid: req.user
              ? req.user.authUser["role"] == "super-admin" ||
                req.user.authUser["role"] == "admin"
                ? false
                : true
              : true,
            added_by: req.user ? req.user.authUser["_id"] : null,
            company_id: bus_company["company_id"],
            ticketed_by: req.user
              ? req.user.authUser["role"] == "super-admin" ||
                req.user.authUser["role"] == "admin"
                ? "admin"
                : "counter"
              : "counter",
          },
        }
      )
    );
    const response = await Promise.all(bookingPromiseArray);

    /* Create ticket and email client */

    const seat_booked_id = bookingRecords.map((b) => b._id);
    console.log("booking id list", seat_booked_id[0]);

    const bookingData = await bookingSch.findOne({ _id: seat_booked_id[0] });
    console.log(bookingData);
    const ticket = await ticketSch
      .findOne({ bus_id: bus_id })
      .sort({ created_at: -1 });
    const bus = await busSch.findOne({ _id: bus_id });
    const busNumber = bus.english.bus_number;

    let read_ticket_id;
    if (ticket) {
      const splitArray = ticket.read_ticket_id.split("-");
      const incrementValue = parseInt(splitArray[splitArray.length - 1]) + 1;

      read_ticket_id = `${busNumber.replaceAll(" ", "-")}-${incrementValue}`;
    } else {
      read_ticket_id = `${busNumber.replaceAll(" ", "-")}-101`;
    }
    const date_time = `${date}:${bus.departure}`;
    let createTicket = new ticketSch({
      booking_id: seat_booked_id,
      bus_id: bus_id,
      company_id: bus_company["company_id"],
      isValidated: false,
      read_ticket_id: read_ticket_id,
      date: date,
      status: req.user
        ? req.user.authUser["role"] == "super-admin" ||
          req.user.authUser["role"] == "admin"
          ? "reserved"
          : "sold-out"
        : "sold-out",
      departure_time: bus.departure,
      date_time: date_time,
      route_id: bus.route_id,
      passenger_name: `${bookingData.firstname} ${bookingData.lastname}`,
    });
    await createTicket.save();
    const bus_details = await busSch
      .findOne({ _id: bus_id }, "english departure arrival price")
      .populate({
        path: "route_id",
        select: "to from",
        populate: { path: "to from", select: "english" },
      });

    const companyCharge = await companySchema.findOne({
      _id: bus_company["company_id"],
    });
    const teleberCharge = await paymentMethodSchema.findOne({
      company_id: null,
    });
    const { phone, firstname, lastname, email, payment_type } = req.body;

    const amount = bus_details.price.birr * bookingRecords.length;
    const to = bus_details.route_id.to.english.location;
    const from = bus_details.route_id.from.english.location;
    const departure = bus_details.departure;
    const arrival = bus_details.arrival;
    const bus_name = bus_details.english.name;
    const bus_plate_number = bus_details.english.plate_number;

    const commisionCharge = companyCharge.commission_rate
      ? companyCharge.commission_rate / 100
      : 0;
    const processingCharge = teleberCharge.telebirr_charge
      ? teleberCharge.telebirr_charge / 100
      : 0;
    const comissionAmount = parseFloat(commisionCharge * amount).toFixed(2);
    const processingAmount = parseFloat(processingCharge * amount).toFixed(2);
    const totalAmount =
      commisionCharge * amount + processingCharge * amount + amount;
    const first2Str = String(phone).slice(2, -1); // 👉️ '13'
    const trimPhone = Number(first2Str);

    const getSeatName = (obj) => {
      switch (obj.position) {
        case "cabin":
          return `C${obj.seat_number}`;
        case "left":
          return `A${obj.seat_number}`;
        case "right":
          return `B${obj.seat_number}`;
        case "back":
          return `L${obj.seat_number}`;
        default:
          return "";
      }
    };
    const seat = bookingRecords
      .map((b) => {
        return { ...b, seatName: getSeatName(b) };
      })
      .reduce((t, s) => {
        t = `${t}${s.seatName},`;
        return t;
      }, "");

    const busPosition = seat.slice(0, -1);

    const ethotime = getTimeFormatter(departure);

    if (
      (req.user && req.user.authUser["role"] == "super-admin") ||
      req.user.authUser["role"] == "admin"
    ) {
      //email ticket reference number and link
      //await nodemailer({ createTicket, email }, "uploadReceipt", res);
    } else {
      //email ticket
      if (email && email != "") {
        await nodemailer(
          {
            createTicket,
            email,
            phone: trimPhone,
            firstname,
            lastname,
            busPosition,
            bus_details,
            date,
            amount,
            to,
            from,
            departure: ethotime,
            arrival,
            bus_name,
            bus_plate_number,
            payment_type,
          },
          "sendTicket",
          res
        );
      }
    }
    let createPayment;
    if (
      req.user.authUser["role"] === "super-admin" ||
      req.user.authUser["role"] == "admin"
    ) {
      createPayment = new paymentSch({
        booking_id: seat_booked_id,
        ticket_id: createTicket._id,
        bus_id: bus_id,
        isSettled: true,
        booked_date: date,
        comission: comissionAmount,
        processing: processingAmount,
        bus_fee: amount,
        amount: totalAmount,
        payment_gateway: req.body["reference_no"] ? "Telebirr" : "Cash",
        payment_type: req.body["payment_type"],
        status: req.user
          ? req.user.authUser["role"] == "super-admin" ||
            req.user.authUser["role"] == "admin" ||
            req.user.authUser["role"] == "  "
            ? "unpaid"
            : "paid"
          : "paid",
        currency: "birr",
        added_by: req.user ? req.user.authUser["_id"] : null,
        reference_number: req.body["reference_no"],
        company_id: bus_company["company_id"],
      });
      await createPayment.save();
    } else {
      createPayment = new paymentSch({
        booking_id: seat_booked_id,
        ticket_id: createTicket._id,
        isSettled: true,
        bus_id: bus_id,
        bus_fee: amount,
        booked_date: date,
        comission: 0,
        processing: 0,
        amount: amount,
        payment_type: req.body["payment_type"],
        payment_gateway: req.body["reference_no"] ? "Telebirr" : "Cash",
        status: req.user
          ? req.user.authUser["role"] == "super-admin" ||
            req.user.authUser["role"] == "admin" ||
            req.user.authUser["role"] == "  "
            ? "unpaid"
            : "paid"
          : "paid",
        currency: "birr",
        added_by: req.user ? req.user.authUser["_id"] : null,
        reference_number: req.body["reference_no"],
        company_id: bus_company["company_id"],
      });
      await createPayment.save();
    }

    await bookingSch.updateMany(
      { _id: { $in: seat_booked_id } },
      { $set: { payment_id: createPayment._id, ticket_id: createTicket._id } }
    );

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      createTicket,
      null,
      config.validate.booked,
      null
    );
  } catch (err) {
    next(err);
  }
};

// @desc <guest user> create booking through mobile device
booking.mobileBooking = async (req, res, next) => {
  try {
    let bookingDetails = {};
    const bus_id = req.params["bus_id"];
    const reqType = req.body["requestType"];
    const bus_company = await busSch.findOne({ _id: bus_id });
    const date = format(
      new Date(req.body["date"]),
      config.validate.DATE_FORMAT
    );
    if (reqType == "select") {
      if (req.body._id) {
        await bookingSch.findOneAndDelete({ _id: req.body._id });
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

      const isReserved = await bookingSch.findOne({
        bus_id: bus_id,
        position: req.body["position"],
        seat_number: req.body["seat_number"],
        date: date,
        isDeleted: false,
      });
      if (isReserved) {
        return responseHelper.sendResponse(
          res,
          httpStatus.BAD_REQUEST,
          true,
          null,
          null,
          config.validate.unavailable,
          null
        );
      }

      bookingDetails = new bookingSch({
        bus_id: bus_id,
        unique_id: req.body["unique_id"],
        position: req.body["position"],
        seat_number: req.body["seat_number"],
        column_id: req.body["column_id"],
        row_id: req.body["row_id"],
        cabin_id: req.body["cabin_id"],
        back_id: req.body["back_id"],
        date: date,
        company_id: bus_company["company_id"],
      });

      await bookingDetails.save();
      return responseHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        bookingDetails,
        null,
        config.validate.reserved,
        null
      );
    }

    let bookingRecords = req.body.bookingRecords;
    if (typeof bookingRecords === "string") {
      bookingRecords = JSON.parse(bookingRecords);
    }

    const bookingPromiseArray = bookingRecords.map((obj) =>
      bookingSch.findOneAndUpdate(
        { _id: obj._id },
        {
          $set: {
            bus_id: obj.bus_id,
            unique_id: req.body["unique_id"],
            position: obj.position,
            column_id: obj.column_id,
            row_id: obj.row_id,
            cabin_id: obj.cabin_id,
            back_id: obj.back_id,
            seat_number: obj.seat_number,
            date: date,
            firstname: obj.firstname,
            lastname: obj.lastname,
            dob: obj.dob,
            gender: obj.gender,
            email: obj.email,
            phone: obj.phone,
            code_id: obj.code_id,
            status: "reserved",
            isPaid: false,
            added_by: req.user ? req.user.authUser["_id"] : null,
            ticketed_by: req.body["ticketed_by"],
          },
        }
      )
    );
    const response = await Promise.all(bookingPromiseArray);

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      bookingRecords,
      null,
      config.validate.reserved,
      null
    );
  } catch (err) {
    next(err);
  }
};

// @desc <both mobile user> cancel reserved booking
booking.cancelBooking = async (req, res, next) => {
  try {
    const booking_id = req.body.booking_id;
    const date = Date.now();

    for (i = 0; i <= booking_id.length; i++) {
      const bookingDetails = await bookingSch.findOne({
        _id: booking_id[i],
        date: moment(date).format("YYYY-MM-DD"),
        status: "confirm",
      });
      if (bookingDetails) {
        return responseHelper.sendResponse(
          res,
          httpStatus.BAD_REQUEST,
          false,
          null,
          null,
          config.cancelledFail,
          null
        );
      }
      await bookingSch.findOneAndDelete({ _id: booking_id[i] });
    }
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      null,
      null,
      config.cancelled,
      null
    );
  } catch (err) {
    next(err);
  }
};

// @desc delete the payment and ticked done through telebirr cancel
booking.deletePayment = async (req, res, next) => {
  try {
    const { booking_id } = req.body;

    if (!booking_id) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        true,
        config.bookingIdInvalid,
        null
      );
    }

    if (typeof booking_id === "string") {
      await ticketSch.findOneAndDelete({
        booking_id: booking_id,
      });
      paymentCheck = await paymentSch.findOneAndDelete({
        booking_id: booking_id,
      });
    } else {
      await ticketSch.findOneAndDelete({
        booking_id: { $all: booking_id },
      });
      await paymentSch.findOneAndDelete({
        booking_id: { $all: booking_id },
      });
    }

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      false,
      null,
      true,
      config.delete,
      null
    );
  } catch (error) {
    next(error);
  }
};

// @desc create booking through mobile device when logged in
booking.mobileBookingCustomer = async (req, res, next) => {
  try {
    let bookingDetails = {};
    const bus_id = req.params["bus_id"];
    const reqType = req.body["requestType"];
    const bus_company = await busSch.findOne({ _id: bus_id });
    const date = format(
      new Date(req.body["date"]),
      config.validate.DATE_FORMAT
    );

    if (reqType == "select") {
      if (req.body._id) {
        await bookingSch.findOneAndDelete({ _id: req.body._id });
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

      const isReserved = await bookingSch.findOne({
        bus_id: bus_id,
        position: req.body["position"],
        seat_number: req.body["seat_number"],
        date: date,
      });
      if (isReserved) {
        return responseHelper.sendResponse(
          res,
          httpStatus.BAD_REQUEST,
          true,
          null,
          null,
          config.validate.unavailable,
          null
        );
      }
      bookingDetails = new bookingSch({
        bus_id: bus_id,
        unique_id: req.body["unique_id"],
        position: req.body["position"],
        seat_number: req.body["seat_number"],
        column_id: req.body["column_id"],
        row_id: req.body["row_id"],
        cabin_id: req.body["cabin_id"],
        back_id: req.body["back_id"],
        date: date,
        company_id: bus_company["company_id"],
        ticketed_by: req.body["ticketed_by"],
      });

      await bookingDetails.save();
      return responseHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        bookingDetails,
        null,
        config.validate.reserved,
        null
      );
    }

    let bookingRecords = req.body.bookingRecords;
    if (typeof bookingRecords === "string") {
      bookingRecords = JSON.parse(bookingRecords);
    }

    const bookingPromiseArray = bookingRecords.map((obj) =>
      bookingSch.findOneAndUpdate(
        { _id: obj._id },
        {
          $set: {
            bus_id: obj.bus_id,
            unique_id: req.body["unique_id"],
            position: obj.position,
            column_id: obj.column_id,
            row_id: obj.row_id,
            cabin_id: obj.cabin_id,
            back_id: obj.back_id,
            seat_number: obj.seat_number,
            date: date,
            firstname: req.user.authUser["firstname"],
            lastname: req.user.authUser["lastname"],
            dob: obj.dob,
            gender: obj.gender,
            email: req.user.authUser["email"],
            phone: obj.phone,
            code_id: obj.code_id,
            status: "reserved",
            isPaid: false,
            added_by: req.user.authUser["_id"],
            ticketed_by: req.body["ticketed_by"],
          },
        }
      )
    );
    await Promise.all(bookingPromiseArray);

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      bookingRecords,
      null,
      config.validate.reserved,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc GET: booking list
booking.getBookingList = async (req, res, next) => {
  try {
    const size_default = 100;
    let page;
    let size;
    const bus_allocation = await busAllocationSch.find(
      { user_id: req.user.authUser["_id"] },
      "bus_id"
    );
    const bus_list = bus_allocation.map((a) => a.bus_id);
    let searchq = {
      isDeleted: false,
      company_id: req.user.authUser["company_id"],
      bus_id: { $in: bus_list },
    };
    let sortq = "-_id";
    let selectq;
    let populate = {
      path: "bus_id added_by payment_id",
      select: "-password",
      populate: { path: "bus_type_id route_id", populate: { path: "to from" } },
    };
    let {
      status,
      to,
      from,
      route_id,
      bus_number,
      passenger_name,
      list_type,
      isConfirmed,
    } = req.query;

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
      searchq = { isDeleted: false };
    }

    if (req.user.authUser["role"] == "bus-company") {
      searchq = {
        isDeleted: false,
        company_id: req.user.authUser["company_id"],
      };
    }

    list_type ? (searchq["status"] = list_type) : (searchq = searchq);
    status ? (searchq["status"] = status) : (searchq = searchq);
    isConfirmed ? (searchq["isPaid"] = isConfirmed) : (searchq = searchq);
    passenger_name
      ? (searchq["firstname"] = { $regex: passenger_name, $options: "i" })
      : (searchq = searchq);

    let datas = await responseHelper.getquerySendResponse(
      bookingSch,
      page,
      size,
      sortq,
      searchq,
      selectq,
      next,
      populate
    );
    const payment = await paymentSch.find({}).count();

    if (to && from && bus_number && route_id) {
      let newFilter = datas.data.filter(
        (a) =>
          (a.bus_id.route_id._id = route_id) &&
          moment(a.created_at).format("YYYY-MM-DD") <=
            moment(to).format("YYYY-MM-DD") &&
          moment(a.created_at).format("YYYY-MM-DD") >=
            moment(from).format("YYYY-MM-DD") &&
          (a.bus_id.english.bus_number.match(bus_number) ||
            a.bus_id.amharic.bus_number.match(bus_number) ||
            a.bus_id.oromifa.bus_number.match(bus_number))
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
    } else if (to && from && route_id) {
      let newFilter = datas.data.filter(
        (a) =>
          moment(a.created_at).format("YYYY-MM-DD") <=
            moment(to).format("YYYY-MM-DD") &&
          moment(a.created_at).format("YYYY-MM-DD") >=
            moment(from).format("YYYY-MM-DD") &&
          (a.bus_id.route_id._id = route_id)
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
    } else if (to && from && bus_number) {
      let newFilter = datas.data.filter(
        (a) =>
          moment(a.created_at).format("YYYY-MM-DD") <=
            moment(to).format("YYYY-MM-DD") &&
          moment(a.created_at).format("YYYY-MM-DD") >=
            moment(from).format("YYYY-MM-DD") &&
          (a.bus_id.english.bus_number.match(bus_number) ||
            a.bus_id.amharic.bus_number.match(bus_number) ||
            a.bus_id.oromifa.bus_number.match(bus_number))
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
    } else if (to && from) {
      let newFilter = datas.data.filter(
        (a) =>
          moment(a.created_at).format("YYYY-MM-DD") <=
            moment(to).format("YYYY-MM-DD") &&
          moment(a.created_at).format("YYYY-MM-DD") >=
            moment(from).format("YYYY-MM-DD")
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
    } else if (bus_number || route_id) {
      let newFilter = datas.data.filter(
        (a) =>
          (a.bus_id.route_id._id = route_id) ||
          a.bus_id.english.bus_number.match(bus_number) ||
          a.bus_id.amharic.bus_number.match(bus_number) ||
          a.bus_id.oromifa.bus_number.match(bus_number)
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
booking.getGroupBookingList = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq;
    let sortq = "-_id";
    let to = req.query["to"];
    let from = req.query["from"];
    let status = req.query["status"];
    let route_id = req.query["route_id"];
    let bus_number = req.query["bus_number"];
    let passenger_name = req.query["passenger_name"];
    let bus_company = req.query["bus_company"];
    const bus_allocation = await busAllocationSch.find(
      { user_id: req.user.authUser["_id"] },
      "bus_id"
    );
    const bus_list = bus_allocation.map((a) => a.bus_id);
    searchq = {
      isCanceled: false,
    };

    //search using from and to filter
    if (from && to) {
      searchq = {
        ...searchq,
        $and: [
          { date: { $gte: moment.utc(from).format("YYYY-MM-DD") } },
          { date: { $lte: moment.utc(to).format("YYYY-MM-DD") } },
        ],
      };
    }

    // search using status filter
    if (status) {
      searchq = {
        ...searchq,
        status: status,
      };
    }

    if (
      req.user.authUser["role"] === "super-admin" ||
      req.user.authUser["role"] === "admin"
    ) {
      searchq = { ...searchq };
    } else {
      searchq = {
        ...searchq,
        company_id: req.user.authUser["company_id"],
      };
    }
    if (bus_list.length >= 1) {
      searchq = {
        ...searchq,
        bus_id: { $in: bus_list },
      };
    }

    let selectq;

    let populate = {
      path: "booking_id",
      select:
        "bus_id status isPaid date position seat_number firstname lastname email phone ticketed_by gender dob",
      populate: {
        path: "payment_id",
      },
    };
    if (passenger_name) {
      searchq = {
        ...searchq,
        passenger_name: { $regex: passenger_name, $options: "i" },
      };
    }

    let populate2 = {
      path: "bus_id",
      select: "-recurring -review",
    };
    let populate1 = {
      path: "route_id",
      populate: {
        path: "to from",
      },
    };
    if (route_id) {
      searchq = {
        ...searchq,
        route_id: route_id,
      };
    }
    if (bus_number) {
      searchq = {
        ...searchq,
        bus_id: bus_number,
      };
    }
    if (bus_company) {
      searchq = {
        ...searchq,
        company_id: bus_company,
      };
    }
    console.log("populate", populate);
    console.log("search", searchq);

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
      populate1,
      populate2
    );

    let newFilter = datas.data.filter((a) => a.booking_id[0]);

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

//@desc GET: booking details
booking.getBookingDetails = async (req, res, next) => {
  try {
    const booking_id = req.params["booking_id"];
    const find_booking = await bookingSch
      .findOne({ _id: booking_id })
      .populate({
        path: "bus_id",
        select: "english amharic oromifa bus_type_id route_id",
        populate: "bus_type_id route_id",
      });

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      find_booking,
      null,
      config.get,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc PATCH: update booking
booking.updateBooking = async (req, res, next) => {
  try {
    const booking_id = req.params["booking_id"];
    const update_booking = await bookingSch.findOneAndUpdate(
      { _id: booking_id },
      {
        $set: {
          firstname: req.body["firstname"],
          lastname: req.body["lastname"],
          dob: req.body["dob"],
          gender: req.body["gender"],
          bus_id: req.body["bus_id"],
          email: req.body["email"],
          phone: req.body["phone"],
          unique_id: req.body["unique_id"],
          position: req.body["position"],
          column_id: req.body["column_id"],
          row_id: req.body["row_id"],
          cabin_id: req.body["cabin_id"],
          back_id: req.body["back_id"],
          seat_number: req.body["seat_number"],
          status: req.body["status"],
          code_id: req.body["code_id"],
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

//@desc Cancel booking through web application
booking.deleteBooking = async (req, res, next) => {
  try {
    const date = new Date();
    const cancelList = req.body.cancelList;

    for (let i = 0; i < cancelList.length; i++) {
      if (date >= moment(cancelList[i].created_at).toDate()) {
        return responseHelper.sendResponse(
          res,
          httpStatus.BAD_REQUEST,
          false,
          null,
          null,
          config.deleteFailed,
          null
        );
      }
      await bookingSch.findOneAndUpdate(
        { _id: cancelList[i]._id },
        { $set: { isDeleted: true } }
      );
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

//@desc Cancel booking through moblie application (auth user)
booking.deleteBookingMobileUser = async (req, res, next) => {
  try {
    const date = new Date();
    const cancelList = req.body.cancelList;
    const ticket_id = req.params.ticket_id;
    const payment_id = req.body.payment_id;

    const timeDiff = (time) => {
      var current = moment(new Date(Date.now()));
      const givenTime = moment(time);
      const diff = moment.duration(givenTime.diff(current)).asHours();

      return diff;
    };

    for (let i = 0; i < cancelList.length; i++) {
      let booking_date =
        cancelList[i].date + " " + cancelList[i].bus_id.departure;

      if (timeDiff(booking_date) <= 12) {
        return responseHelper.sendResponse(
          res,
          httpStatus.BAD_REQUEST,
          false,
          null,
          null,
          config.deleteFailed,
          null
        );
      }
      await bookingSch.findOneAndUpdate(
        { _id: cancelList[i]._id },
        { $set: { isDeleted: true, status: "canceled" } }
      );
    }

    await ticketSch.findOneAndUpdate(
      { _id: ticket_id },
      { $set: { isCanceled: true } }
    );
    await paymentSch.findOneAndUpdate(
      { _id: payment_id },
      { $set: { status: "canceled" } }
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

//@desc GET: booking report list
booking.getReportingList = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    const bus_allocation = await busAllocationSch.find(
      { user_id: req.user.authUser["_id"] },
      "bus_id"
    );
    const bus_list = bus_allocation.map((a) => a.bus_id);
    let searchq = {
      isDeleted: false,
      company_id: req.user.authUser["company_id"],
      _id: { $in: bus_list },
    };
    let sortq = "-_id";
    let selectq;
    let { start_date, end_date, route_id, bus_number, bus_company, date } =
      req.query;
    const newDate = moment.utc(start_date).format("YYYY-MM-DD");
    const endDate = moment.utc(end_date).format("YYYY-MM-DD");
    let populate = {
      path: "route_id company",
      populate: { path: "to from", select: "english oromifa amharic " },
    };
    let populate2 = {
      path: "SeatBookings",
      match: {
        status: "sold-out",
        date: { $gte: newDate, $lte: endDate },
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

    if (
      req.user.authUser.role == "super-admin" ||
      req.user.authUser["role"] == "admin"
    ) {
      searchq = { isDeleted: false };
    } else if (req.user.authUser.role == "bus-company") {
      searchq = {
        company_id: req.user.authUser["company_id"],
        isDeleted: false,
      };
    }
    if (route_id) {
      searchq = {
        ...searchq,
        route_id: route_id,
      };
    }
    if (bus_company) {
      searchq = {
        ...searchq,
        company_id: bus_company,
      };
    }
    if (bus_number) {
      searchq = {
        ...searchq,
        _id: bus_number,
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

    let newFilter = datas.data.filter((a) => a);

    const totalCalculation = (a) => {
      let total = 0;
      let start;
      let end;

      if (start_date) {
        if (
          moment(a.operation_date.from).format("YYYY-MM-DD") >=
          moment.utc(start_date).format("YYYY-MM-DD")
        ) {
          start = moment(a.operation_date.from).format("YYYY-MM-DD");
        } else {
          start = moment.utc(start_date).format("YYYY-MM-DD");
        }
      }
      if (end_date) {
        if (
          moment(a.operation_date.to).format("YYYY-MM-DD") >=
            moment.utc(end_date).format("YYYY-MM-DD") &&
          moment.utc(end_date).format("YYYY-MM-DD") >
            moment.utc(new Date()).format("YYYY-MM-DD")
        ) {
          console.log("abc");
          end = moment.utc(new Date()).format("YYYY-MM-DD");
        } else if (
          moment(a.operation_date.to).format("YYYY-MM-DD") <=
            moment.utc(end_date).format("YYYY-MM-DD") &&
          moment.utc(end_date).format("YYYY-MM-DD") <
            moment.utc(new Date()).format("YYYY-MM-DD")
        ) {
          console.log("cde");
          end = moment(a.operation_date.to).format("YYYY-MM-DD");
        } else {
          end = moment.utc(end_date).format("YYYY-MM-DD");
        }
        if (
          moment(a.operation_date.from).format("YYYY-MM-DD") >
          moment.utc(end_date).format("YYYY-MM-DD")
        ) {
          start = moment.utc(start_date).format("YYYY-MM-DD");
          end = moment.utc(start_date).format("YYYY-MM-DD");
        }
      }

      // diffValue = moment.duration(end.diff(start)).asDays();
      // console.log(diffValue);
      // const diff = Math.round(diffValue);

      const end1 = new Date(end);
      const start1 = new Date(start);

      var oneDay = 1000 * 60 * 60 * 24;
      var difference_ms = Math.abs(end1 - start1);
      var diff = Math.round(difference_ms / oneDay);

      console.log(diff);

      let concurrentdate = moment(start_date);
      for (i = 1; i <= diff; i++) {
        const week = moment(concurrentdate).isoWeekday();

        concurrentdate = moment(concurrentdate, "DD-MM-YYYY").add(1, "days");

        if (week === 1) {
          a.recurring.sunday ? (total = total + 1) : total;
        }
        if (week === 2) {
          a.recurring.monday ? (total = total + 1) : total;
        }
        if (week === 3) {
          a.recurring.tuesday ? (total = total + 1) : total;
        }
        if (week === 4) {
          a.recurring.wednesday ? (total = total + 1) : total;
        }
        if (week === 5) {
          a.recurring.thursday ? (total = total + 1) : total;
        }
        if (week === 6) {
          a.recurring.friday ? (total = total + 1) : total;
        }
        if (week === 7) {
          a.recurring.saturday ? (total = total + 1) : total;
        }
      }

      return total;
    };
    const totaldistanceTravel = (a) => {
      let total = 0;
      console.log(a.company_id);
      a.route_id.added_by.map((b) => {
        if (JSON.stringify(a.company_id) == JSON.stringify(b.company_id)) {
          total = b.distance;
        }
      });

      return total;
    };

    const weeks = generateGraphTimelineByWeeks(start_date, end_date);

    let newData = newFilter.map((item) => ({
      ...item._doc,
      total_travels: totalCalculation(item),
      total_distance:
        parseInt(totalCalculation(item)) * parseInt(totaldistanceTravel(item)),
      total_tickets_sold: item.SeatBookings ? item.SeatBookings.length : 0,
      total_income:
        item.SeatBookings.length * item.company
          ? item.company.commission_rate
          : 0,
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

booking.getpasangerList = async (req, res, next) => {
  try {
    let size_default = 10;
    let page;
    let size;
    let searchq = { isDeleted: false, status: "sold-out", isPaid: true };
    let sortq = "-_id";
    let selectq;
    let populate;
    let populate1;
    let populate2;
    let { bus_number, route_id, start_date, end_date, bus_company } = req.query;

    const bus_allocation = await busAllocationSch.find(
      { user_id: req.user.authUser["_id"] },
      "bus_id"
    );
    const bus_list = bus_allocation.map((a) => a.bus_id);

    if (bus_list.lenght >= 1) {
      searchq = {
        isDeleted: false,
        _id: { $in: bus_list },
      };
    }
    if (start_date && end_date) {
      searchq = {
        ...searchq,
        $and: [{ date: { $gte: start_date } }, { date: { $lte: end_date } }],
      };
    }

    if (bus_number) {
      searchq = {
        ...searchq,
        bus_id: bus_number,
      };
    }
    if (bus_company) {
      searchq = {
        ...searchq,
        company_id: bus_company,
      };
    }
    if (route_id) {
      populate = {
        path: "bus_id",
        match: { route_id: route_id },
      };
    } else {
      populate = {
        path: "bus_id",
      };
    }

    if (
      req.user.authUser.role == "super-admin" ||
      req.user.authUser["role"] == "admin"
    ) {
      populate = {
        ...populate,
      };
    } else if (req.user.authUser.role == "bus-company") {
      populate = {
        ...populate,
        match: {
          ...populate.match,
          company_id: req.user.authUser["company_id"],
        },
      };
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

    console.log("final search", searchq);

    let datas = await responseHelper.getquerySendResponse(
      bookingSch,
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

//@desc GET: customer booking history list
booking.getBookingListaa = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq = {
      isDeleted: false,
      company_id: req.user.authUser["company_id"],
      bus_id: { $in: bus_list },
    };
    let sortq = "-_id";
    let selectq;
    let populate = {
      path: "bus_id added_by",
      select: "-password",
      populate: { path: "bus_type_id route_id", populate: { path: "to from" } },
    };
    let { status, to, from, route_id, bus_number, passenger_name } = req.query;

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
      searchq = {};
    }

    if (req.user.authUser["role"] == "bus-company") {
      searchq = {
        isDeleted: false,
        company_id: req.user.authUser["company_id"],
      };
    }

    status ? (searchq["status"] = status) : (searchq = searchq);
    passenger_name
      ? (searchq["firstname"] = { $regex: passenger_name, $options: "i" })
      : (searchq = searchq);

    let datas = await responseHelper.getquerySendResponse(
      bookingSch,
      page,
      size,
      sortq,
      searchq,
      selectq,
      next,
      populate
    );

    if (to && from && bus_number && route_id) {
      let newFilter = datas.data.filter(
        (a) =>
          (a.bus_id.route_id._id = route_id) &&
          moment(a.created_at).format("YYYY-MM-DD") <=
            moment(to).format("YYYY-MM-DD") &&
          moment(a.created_at).format("YYYY-MM-DD") >=
            moment(from).format("YYYY-MM-DD") &&
          (a.bus_id.english.bus_number.match(bus_number) ||
            a.bus_id.amharic.bus_number.match(bus_number) ||
            a.bus_id.oromifa.bus_number.match(bus_number))
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

//@desc GET: booking details
booking.getTicketDetails = async (req, res, next) => {
  try {
    const ticket_id = req.params.ticket_id;
    const bookingDetails = await ticketSch
      .findOne({ _id: ticket_id })
      .populate({
        path: "booking_id",
        select: "-added_by -updated_by -ticket_id",
        populate: {
          path: "payment_id",
        },
      })
      .populate({
        path: "bus_id",
        populate: {
          path: "route_id",
          populate: {
            path: "from to",
          },
        },
      })
      .populate({
        path: "company_id",
        select: "-password",
      });
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      bookingDetails,
      null,
      config.get,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc GET: admin confirm booking payment
booking.confirmBooking = async (req, res, next) => {
  try {
    const ticket_id = req.params.ticket_id;
    const bus_id = req.body.bus_id;

    await bookingSch.updateMany(
      { ticket_id: ticket_id },
      { $set: { status: "sold-out", isPaid: true } }
    );
    await paymentSch.findOneAndUpdate(
      { ticket_id: ticket_id },
      { $set: { status: "paid", isSettled: true } }
    );
    await ticketSch.findOneAndUpdate(
      { _id: ticket_id },
      { $set: { status: "sold-out" } }
    );
    const bus_details = await busSch
      .findOne({ _id: bus_id }, "english departure arrival price")
      .populate({
        path: "route_id",
        select: "to from ",
        populate: { path: "to from", select: "english" },
      });

    const bookedSeat = await bookingSch
      .find({ ticket_id: ticket_id })
      .populate({
        path: "payment_id",
        select: "payment_type",
      });

    const createTicket = await ticketSch.findOne({ _id: ticket_id });

    const phone = bookedSeat[0].phone;
    const firstname = bookedSeat[0].firstname;
    const lastname = bookedSeat[0].lastname;
    const email = bookedSeat[0].email;
    const date = bookedSeat[0].date;
    const payment_type = bookedSeat[0].payment_id.payment_type;

    const amount = bus_details.price.birr * bookedSeat.length;
    const to = bus_details.route_id.to.english.location;
    const from = bus_details.route_id.from.english.location;
    const departure = bus_details.departure;
    const arrival = bus_details.arrival;
    const bus_name = bus_details.english.name;
    const bus_plate_number = bus_details.english.plate_number;
    const getSeatName = (obj) => {
      switch (obj.position) {
        case "cabin":
          return `C${obj.seat_number}`;
        case "left":
          return `A${obj.seat_number}`;
        case "right":
          return `B${obj.seat_number}`;
        case "back":
          return `L${obj.seat_number}`;
        default:
          return "";
      }
    };
    const seat = bookedSeat
      .map((b) => {
        return { ...b, seatName: getSeatName(b) };
      })
      .reduce((t, s) => {
        t = `${t}${s.seatName},`;
        return t;
      }, "");

    const busPosition = seat.slice(0, -1);
    const ethotime = getTimeFormatter(departure);

    if (
      (req.user && req.user.authUser["role"] == "super-admin") ||
      req.user.authUser["role"] == "admin"
    ) {
      if (!_.isEmpty(email) && !_.isNull(email)) {
        await nodemailer(
          {
            createTicket,
            email,
            phone,
            firstname,
            lastname,
            busPosition,
            bus_details,
            date,
            amount,
            to,
            from,
            departure: ethotime,
            arrival,
            bus_name,
            bus_plate_number,
            payment_type,
          },
          "sendTicket",
          res
        );
      }

      if (
        bookedSeat[0].ticketed_by === "online-web" ||
        bookedSeat[0].ticketed_by === "online-app"
      ) {
        const unique_id = bookedSeat[0].unique_id
          ? bookedSeat[0].unique_id
          : null;
        if (unique_id) {
          // const user_id = bookedSeat[0].added_by
          //   ? bookedSeat[0].added_by
          //   : null;

          let user_token;

          user_token = await fcmTokenSch.findOne({ unique_id: unique_id });

          // if (user_token == null) {
          //   user_token = await fcmTokenSch.findOne({ unique_id: unique_id });
          // }
          let title = "Seat Booked";
          let orTitle = "Teessumn qabameera";
          let amTitle = "መቀመጫ ተይዟል";
          let body = "Ticket you have booked is confirmed";
          let orBody = "Tikeetiin buufattan mirkanaa'eera";
          let amBody = "ያስያዙት ትኬት ተረጋግጧል";

          if (user_token) {
            if (user_token.enable_notification == true) {
              let token = [user_token.fcm_token];

              const message = {
                notification: {
                  title: title,
                  body: body,
                },
                data: { ticket_id: ticket_id },
              };

              if (token && bookedSeat[0].ticketed_by === "online-app") {
                notificationHelper(token, message);
              }
            }
          }
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
          const notification = new notificationSchema({
            user_id: user_token
              ? user_token.user_id
                ? user_token.user_id
                : null
              : null,
            fcm_token: user_token
              ? user_token.fcm_token
                ? user_token.fcm_token
                : null
              : null,
            unique_id: unique_id,
            english: english,
            oromifa: oromifa,
            amharic: amharic,
            ticket_id: createTicket._id,
          });
          await notification.save();
        }
      }
    }
    return responseHelper.sendResponse(
      res,
      httpStatus.CREATED,
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
booking.declineBooking = async (req, res, next) => {
  try {
    const ticket_id = req.body["ticket_id"];
    const declineMessage = req.body["message"];

    const bookedSeat = await bookingSch
      .find({ ticket_id: ticket_id })
      .populate({
        path: "payment_id",
        select: "payment_type",
      });

    const bus_details = await busSch
      .findOne({ _id: bookedSeat[0].bus_id })
      .populate({
        path: "route_id",
        select: "to from ",
        populate: { path: "to from", select: "english" },
      });

    const phone = bookedSeat[0].phone;
    const firstname = bookedSeat[0].firstname;
    const lastname = bookedSeat[0].lastname;
    const email = bookedSeat[0].email;
    const date = bookedSeat[0].date;
    const payment_type = bookedSeat[0].payment_id.payment_type;

    const amount = bus_details.price.birr * bookedSeat.length;
    const to = bus_details.route_id.to.english.location;
    const from = bus_details.route_id.from.english.location;
    const departure = bus_details.departure;
    const arrival = bus_details.arrival;
    const bus_name = bus_details.english.name;
    const bus_plate_number = bus_details.english.plate_number;
    const getSeatName = (obj) => {
      switch (obj.position) {
        case "cabin":
          return `C${obj.seat_number}`;
        case "left":
          return `A${obj.seat_number}`;
        case "right":
          return `B${obj.seat_number}`;
        case "back":
          return `L${obj.seat_number}`;
        default:
          return "";
      }
    };
    const seat = bookedSeat
      .map((b) => {
        return { ...b, seatName: getSeatName(b) };
      })
      .reduce((t, s) => {
        t = `${t}${s.seatName},`;
        return t;
      }, "");

    const busPosition = seat.slice(0, -1);

    await bookingSch.deleteMany({ ticket_id: ticket_id });
    await paymentSch.deleteMany({ ticket_id: ticket_id });
    await ticketSch.deleteOne({ _id: ticket_id });
    const ethotime = getTimeFormatter(departure);
    if (
      (req.user && req.user.authUser["role"] == "super-admin") ||
      req.user.authUser["role"] == "admin"
    ) {
      //email ticket
      if (!_.isEmpty(email) && !_.isNull(email)) {
        await nodemailer(
          {
            email,
            phone,
            firstname,
            lastname,
            busPosition,
            bus_details,
            date,
            amount,
            to,
            from,
            departure: ethotime,
            arrival,
            bus_name,
            bus_plate_number,
            payment_type,
            message: declineMessage,
          },
          "sendCancelMessage",
          res
        );
      }
      //const data = JSON.stringify(ticket_id);

      if (
        bookedSeat[0].ticketed_by === "online-web" ||
        bookedSeat[0].ticketed_by === "online-app"
      ) {
        const unique_id = bookedSeat[0].unique_id
          ? bookedSeat[0].unique_id
          : null;
        if (unique_id) {
          let user_token;

          user_token = await fcmTokenSch.findOne({ unique_id: unique_id });

          let title = "Booking Canceled";
          let orTitle = "Qabannaan bakka haqameera";
          let amTitle = "ቦታ ማስያዝ ተሰርዟል";
          let body = declineMessage ? declineMessage : "Booking Canceled";
          let orBody = declineMessage
            ? declineMessage
            : "Qabannaan bakka haqameera";
          let amBody = declineMessage ? declineMessage : "ቦታ ማስያዝ ተሰርዟል";
          if (user_token) {
            if (user_token.enable_notification === true) {
              let token = [user_token.fcm_token];

              const message = {
                notification: {
                  title: title,
                  body: body,
                },
                data: { ticket_id: ticket_id },
              };
              if (token && bookedSeat[0].ticketed_by === "online-app") {
                notificationHelper(token, message);
              }
            }
          }

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
          const notification = new notificationSchema({
            user_id: user_token
              ? user_token.user_id
                ? user_token.user_idget
                : null
              : null,
            fcm_token: user_token
              ? user_token.fcm_token
                ? user_token.fcm_token
                : null
              : null,
            unique_id: unique_id,
            english: english,
            oromifa: oromifa,
            amharic: amharic,
            ticket_id: ticket_id ? ticket_id : null,
          });
          await notification.save();
        }
      }
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
  } catch (error) {
    next(error);
  }
};
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

function generateGraphTimelineByWeeks(start_date, end_date) {
  start_date = format(new Date(start_date), config.validate.DATE_FORMAT);
  end_date = format(new Date(end_date), config.validate.DATE_FORMAT);
  const dates = [];

  while (start_date <= end_date) {
    const endDateOfWeek = format(
      endOfWeek(new Date(start_date)),
      config.validate.DATE_FORMAT
    );
    const end = endDateOfWeek > end_date ? end_date : endDateOfWeek;
    dates.push({ start: start_date, end: end });

    /* Setting start date of next week */
    let nextStartDate = addDays(new Date(end), 1);
    start_date = format(new Date(nextStartDate), config.validate.DATE_FORMAT);
  }
  return dates;
}

scheduler.scheduleJob("1 * * * * *", async () => {
  const find_bookings = await bookingSch.find({ status: "reserved" });
  const date = new Date();
  const now_utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

  for (let i = 0; i < find_bookings.length; i++) {
    const booking_expired =
      date >= moment(find_bookings[i].created_at).add(30, "m").toDate();

    if (booking_expired) {
      console.log(
        `Expired booking ${find_bookings[i]._id} removed successfully`
      );
      await bookingSch.findOneAndDelete({ _id: find_bookings[i]._id });
      const find_payment = await paymentSch.findOne({
        _id: find_bookings[i].payment_id,
      });
      if (find_payment) {
        await paymentSch.findOneAndDelete({ _id: find_bookings[i].payment_id });
      }
      const find_ticket = await ticketSch.findOne({
        _id: find_bookings[i].ticket_id,
      });
      if (find_ticket) {
        await ticketSch.findOneAndDelete({ _id: find_bookings[i].ticket_id });
      }
    }
  }
});

module.exports = booking;
