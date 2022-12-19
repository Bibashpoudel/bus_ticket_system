const paymentSch = require("./paymentSchema");
const paymentMethodSch = require("./paymentMethodSchema");
const bookingSch = require("./../booking/bookingSchema");
const ticketSch = require("./../ticket/ticketSchema");
const busSch = require("./../buses/busSchema");
const companySch = require("../../modules/company/companySchema");
const httpStatus = require("http-status");
const responseHelper = require("../../helper/responseHelper");
const { nodemailer } = require("./../../helper/nodemailer");
const config = require("./paymentConfig");
const paypal = require("paypal-rest-sdk");
const configs = require("../../config");
const axios = require("axios");
const discountCodeSchema = require("../discountCode/discountCodeSchema");
const NodeRSA = require("node-rsa");

const crypto = require("crypto");
const { getTimeFormatter } = require("../../helper/dateConverter");
const { telebirrPaymentRequest } = require("./telebirrpayment");

const payment = {};

payment.createPaymentTelebirr = async (req, res, next) => {
  try {
    const {
      booking_id,
      amount,
      payment_type,
      user_id,
      discount_code_id,
      discount_amount,
      unique_id,
      bank_name,
      bus_id,
      company_id,
    } = req.body;
    console.log(req.body);

    console.log("booking id", booking_id);

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

    let ticketCheck;

    if (typeof booking_id === "string") {
      ticketCheck = await ticketSch.findOne({
        booking_id: booking_id,
      });
    } else {
      ticketCheck = await ticketSch.findOne({
        booking_id: { $all: booking_id },
      });
    }

    if (ticketCheck) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        true,
        config.ticketExist,
        null
      );
    }
    const ticket = await ticketSch
      .findOne({ bus_id: bus_id })
      .sort({ created_at: -1 });
    const bus = await busSch.findOne({ _id: bus_id });
    const companyDetails = await companySch.findOne({ _id: company_id });
    const adminPayment = await paymentMethodSch.findOne({
      company_id: null,
    });
    let discountCodeData;
    if (discount_code_id) {
      discountCodeData = await discountCodeSchema.findOne({
        _id: discount_code_id,
      });
    }
    const discount = discountCodeData ? discountCodeData.percent / 100 : 0;
    let discountAmount;
    let totalAmount;

    if (typeof booking_id === "string") {
      discountAmount = bus.price.birr * 1 * discount;
      totalAmount = bus.price.birr * 1 - discountAmount;
    } else {
      discountAmount = bus.price.birr * booking_id.length * discount;
      totalAmount = bus.price.birr * booking_id.length - discountAmount;
    }
    let processing_charge = adminPayment.telebirr_charge
      ? adminPayment.telebirr_charge / 100
      : 0;

    let commision_charge = companyDetails
      ? companyDetails.commission_rate / 100
      : 0;
    let processingAmount = parseFloat(processing_charge * totalAmount).toFixed(
      2
    );
    let comissionAmount = parseFloat(commision_charge * totalAmount).toFixed(2);

    const busNumber = bus.english.bus_number;

    let read_ticket_id;
    if (ticket) {
      const splitArray = ticket.read_ticket_id.split("-");
      const incrementValue = parseInt(splitArray[splitArray.length - 1]) + 1;

      read_ticket_id = `${busNumber.replaceAll(" ", "-")}-${incrementValue}`;
    } else {
      read_ticket_id = `${busNumber.replaceAll(" ", "-")}-101`;
    }
    let booking;

    if (typeof booking_id === "string") {
      booking = await bookingSch.findOne({ _id: booking_id });
    } else {
      booking = await bookingSch.findOne({ _id: booking_id[0] });
    }

    if (!booking) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        true,
        config.errorBookingData,
        null
      );
    }
    const date_time = `${booking.date}:${bus.departure}`;

    //const abc = await axios.post(api, requestMessage);

    const appKey = process.env.APPKEY;

    function generateRandomNumber() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

      for (var i = 0; i < 25; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }
    const nonce = generateRandomNumber();
    const outTradeNo = generateRandomNumber();
    const dateGen = Math.floor(Date.now() / 1000);

    let signObj = {
      appId: process.env.APPID, //
      nonce: nonce, //
      notifyUrl: `https://mengedegna.com/api/v1/notifyUrl`,
      outTradeNo: outTradeNo,
      receiveName: "Mengedegna",
      returnUrl: `https://mengedegna.com/my-ticket`,
      shortCode: process.env.SHORTCODE, //
      subject: process.env.PAYMENT_NAME, //
      timeoutExpress: "30", //
      timestamp: `${dateGen}`, //
      totalAmount: `${amount}`, //
    };
    signObj.appKey = appKey;

    function jsonSort(jsonObj) {
      let arr = [];
      for (var key in jsonObj) {
        arr.push(key);
      }
      arr.sort();
      let str = "";
      for (var i in arr) {
        str += arr[i] + "=" + jsonObj[arr[i]] + "&";
      }
      return str.substr(0, str.length - 1);
    }
    let StringA = jsonSort(signObj);
    console.log("string a", StringA);
    function sha256(data) {
      var hash = crypto.createHash("sha256");
      hash.update(data);
      return hash.digest("hex");
    }
    let StringB = sha256(StringA);

    let sign = StringB.toUpperCase();

    let jsonObj = {
      appId: process.env.APPID,
      nonce: nonce,
      notifyUrl: `https://mengedegna.com/api/v1/notifyUrl`,
      outTradeNo: outTradeNo,
      receiveName: "Mengedegna",
      returnUrl: `https://mengedegna.com/my-ticket`,
      shortCode: process.env.SHORTCODE,
      subject: process.env.PAYMENT_NAME,
      timeoutExpress: "30",
      timestamp: `${dateGen}`,
      totalAmount: `${amount}`,
    };
    let ussdjson = JSON.stringify(jsonObj);

    function insertStr(str, insertStr, sn) {
      var newstr = "";
      for (var i = 0; i < str.length; i += sn) {
        var tmp = str.substring(i, i + sn);
        newstr += tmp + insertStr;
      }
      return newstr;
    }

    const getPublicKey = function (key) {
      const result = insertStr(key, "\n", 64);

      return (
        "-----BEGIN PUBLIC KEY-----\n" + result + "-----END PUBLIC KEY-----"
      );
    };

    const publicKey = process.env.PUBLICKEY;
    console.log(publicKey);

    const genpublicKey = getPublicKey(publicKey);
    console.log(genpublicKey);
    const rsa_encrypt = (data) => {
      let key = new NodeRSA(genpublicKey);
      key.setOptions({ encryptionScheme: "pkcs1" });
      let encryptKey = key.encrypt(data, "base64");
      return encryptKey;
    };

    let ussd = rsa_encrypt(ussdjson);

    let requestMessage = { appid: signObj.appId, sign: sign, ussd: ussd };
    console.log(requestMessage);

    const api = process.env.TELE_BIR_API;

    const abc = await axios.post(api, requestMessage);

    const bookingid = booking_id.map((a) => a._id);
    if (abc) {
      if (abc.status == 200 && abc.data.code == 200) {
        const payUrl = abc.data.data.toPayUrl;
        const slicePayUrl = payUrl.split("transactionNo=");
        console.log(slicePayUrl);
        let createTicket = new ticketSch({
          booking_id: booking_id,
          isValidated: false,
          bus_id: bus_id,
          company_id: company_id,
          read_ticket_id: read_ticket_id,
          date: booking.date,
          status: "reserved",
          departure_time: bus.departure,
          date_time: date_time,
          user_id: booking.added_by ? booking.added_by : null,
          unique_id: booking.unique_id ? booking.unique_id : null,
          route_id: bus.route_id,
          passenger_name: `${booking.firstname} ${booking.lastname}`,
        });
        const createTicketDetails = await createTicket.save();

        let createPayment = new paymentSch({
          ticket_id: createTicket._id,
          bus_fee: totalAmount,
          comission: comissionAmount,
          processing: processingAmount,
          booked_date: booking.date,
          bus_id: bus_id,
          amount: amount,
          discount: discountAmount,
          payment_type: "telebirr",
          payment_gateway: "Telebirr",
          status: "pending",
          reference_number: outTradeNo,
          added_by: user_id ? user_id : null,
          booking_id: booking_id,
          discount_code: discount_code_id ? discount_code_id : null,
        });
        createPayment["user_id"] = user_id ? user_id : null;
        createPayment["unique_id"] = unique_id ? unique_id : null;

        const createPaymentDetails = await createPayment.save();
        await bookingSch.updateMany(
          { _id: { $in: booking_id } },
          {
            $set: {
              payment_id: createPaymentDetails._id,
              ticket_id: createTicketDetails._id,
            },
          }
        );
        createTicket.payment_id = createPaymentDetails._id;
        await createTicket.save();

        responseHelper.sendResponse(
          res,
          httpStatus.OK,
          true,
          payUrl,
          null,
          config.post,
          null
        );
        return;
      } else {
        console.log("error Message res", res);
      }
    } else {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        error,
        null,
        null
      );
    }
  } catch (error) {
    next(error);
  }
};
payment.NotifyUrl = async (req, res, next) => {
  const decryptvalue = req.body;
  console.log(decryptvalue);
  function insertStr(str, insertStr, sn) {
    var newstr = "";
    for (var i = 0; i < str.length; i += sn) {
      var tmp = str.substring(i, i + sn);
      newstr += tmp + insertStr;
    }
    return newstr;
  }

  const getPublicKey = function (key) {
    const result = insertStr(key, "\n", 64);

    return "-----BEGIN PUBLIC KEY-----\n" + result + "-----END PUBLIC KEY-----";
  };

  const publicKey = process.env.PUBLICKEY;

  const genpublicKey = getPublicKey(publicKey);

  const rsa_decrypt = (data) => {
    let key = new NodeRSA(genpublicKey);
    key.setOptions({ encryptingScheme: "pkcs1" });
    let decryptkey = key.decryptPublic(data, "utf8");
    return decryptkey;
  };

  let data;
  try {
    data = rsa_decrypt(decryptvalue);
    console.log(data);
    console.log(typeof data);
  } catch (error) {
    console.log(error);
  }
  console.log(typeof data);
  const NewData = JSON.parse(`${data}`);

  const payment = await paymentSch.findOne({
    reference_number: NewData.outTradeNo,
  });
  await paymentSch.findOneAndUpdate(
    { reference_number: NewData.outTradeNo },
    { $set: { status: "paid", isSettled: true } }
  );
  await bookingSch.updateMany(
    { payment_id: payment._id },
    { $set: { status: "sold-out", isPaid: true } }
  );
  await ticketSch.findOneAndUpdate(
    { payment_id: payment._id },
    { $set: { status: "sold-out" } }
  );
  console.log("payment", payment);

  res.send("test 123");
};
payment.ReturnUrl = async (req, res, next) => {
  res.send("test213");
};

//@desc Create payment for booked vehicle/bus (paypal)
payment.createPayment = async (req, res, next) => {
  try {
    const adminPayment = await paymentMethodSch.findOne({
      company_id: null,
    });
    console.log("paymentreq", req.body);
    const paypalBaseUrl = configs.paypalBaseUrl;
    const {
      payer_id,
      PAYID,
      booking_id,
      discount_code_id,
      payment_type,
      bus_id,
      company_id,
    } = req.body;
    const payload = { payer_id };

    let ticketCheck;

    if (typeof booking_id === "string") {
      ticketCheck = await ticketSch.findOne({
        booking_id: booking_id,
      });
    } else {
      ticketCheck = await ticketSch.findOne({
        booking_id: { $all: booking_id },
      });
    }

    if (ticketCheck) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        true,
        config.ticketExist,
        null
      );
    }

    const payment = await axios.post(
      `${paypalBaseUrl}/v1/payments/payment/${PAYID}/execute`,
      payload,
      {
        headers: { Authorization: `Bearer ${req.body.token}` },
      }
    );
    const ticket = await ticketSch
      .findOne({ bus_id: bus_id })
      .sort({ created_at: -1 });
    const bus = await busSch.findOne({ _id: bus_id });

    const companyDetails = await companySch.findOne({ _id: company_id });
    let discountCodeData;
    if (discount_code_id) {
      discountCodeData = await discountCodeSchema.findOne({
        _id: discount_code_id,
      });
    }

    let booking;

    if (typeof booking_id === "string") {
      booking = await bookingSch.findOne({ _id: booking_id });
    } else {
      booking = await bookingSch.findOne({ _id: booking_id[0] });
    }

    if (!booking) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        true,
        config.errorBookingData,
        null
      );
    }
    const discount = discountCodeData ? discountCodeData.percent / 100 : 0;
    const discountAmount = discount * bus.price.birr * booking_id.length;
    let totalAmount = bus.price.birr * booking_id.length - discountAmount;

    let processing_charge = adminPayment
      ? adminPayment.telebirr_charge / 100
      : 0;
    let processingAmount = parseFloat(processing_charge * totalAmount).toFixed(
      2
    );
    let commision_charge = companyDetails
      ? companyDetails.commission_rate / 100
      : 0;
    let comissionAmount = parseFloat(commision_charge * totalAmount).toFixed(2);

    const busNumber = bus.english.bus_number;

    let read_ticket_id;
    if (ticket) {
      const splitArray = ticket.read_ticket_id.split("-");
      const incrementValue = parseInt(splitArray[splitArray.length - 1]) + 1;

      read_ticket_id = `${busNumber.replaceAll(" ", "-")}-${incrementValue}`;
    } else {
      read_ticket_id = `${busNumber.replaceAll(" ", "-")}-101`;
    }

    if (payment.data.state == "approved") {
      let payment_id;
      let total_amount;

      const payment_details = payment.data.transactions.map((p) => {
        let createPayment = new paymentSch({
          amount: p.amount.total,
          bus_fee: totalAmount,
          comission: comissionAmount,
          processing: processingAmount,
          bus_id: bus_id,
          booked_date: booking.date,
          payment_type: req.body["payment_type"],
          payment_gateway: req.body["payment_gateway"],
          booking_id: booking_id,
          status: "paid",
          transaction_id: payment.data.id,
          currency: p.amount.currency,
          added_by: req.user ? req.user.authUser["_id"] : null,
          discount_code: discount_code_id,
          discount: discountAmount,
        });

        createPayment["user_id"] = req.user ? req.user.authUser["_id"] : null;
        createPayment["unique_id"] = req.body["unique_id"]
          ? req.body["unique_id"]
          : null;

        createPayment.save();

        payment_id = createPayment._id;
        total_amount = createPayment.amount;
      });
      const response = await Promise.all(payment_details);

      const date_time = `${booking.date}:${bus.departure}`;
      let createTicket = new ticketSch({
        booking_id: booking_id,
        isValidated: false,
        bus_id: bus_id,
        company_id: company_id,
        read_ticket_id: read_ticket_id,
        date: booking.date,
        status: "sold-out",
        departure_time: bus.departure,
        date_time: date_time,
        user_id: booking.added_by ? booking.added_by : null,
        unique_id: booking.unique_id ? booking.unique_id : null,
        route_id: bus.route_id,
        passenger_name: `${booking.firstname} ${booking.lastname}`,
      });
      const createTicketDetails = await createTicket.save();
      await bookingSch.updateMany(
        { _id: { $in: booking_id } },
        {
          $set: {
            isPaid: true,
            status: "sold-out",
            payment_id: payment_id,
            ticket_id: createTicketDetails._id,
          },
        }
      );
      await paymentSch.findOneAndUpdate(
        { _id: payment_id._id },
        {
          $set: {
            ticket_id: createTicketDetails._id,
          },
        }
      );
      let booking_details;
      if (typeof booking_id === "string") {
        booking_details = await bookingSch.findOne({ _id: booking_id });
      } else {
        booking_details = await bookingSch.findOne({
          _id: booking_id[0],
        });
      }

      const bus_details = await busSch
        .findOne(
          { _id: booking_details.bus_id },
          "english departure arrival price"
        )
        .populate({
          path: "route_id",
          select: "to from",
          populate: { path: "to from", select: "english" },
        });

      const { phone, firstname, lastname, email, date } = booking_details;
      const payment_type = req.body["payment_type"];
      const amount = total_amount;
      const to = bus_details.route_id.to.english.location;
      const from = bus_details.route_id.from.english.location;
      const departure = bus_details.departure;
      const arrival = bus_details.arrival;
      const bus_name = bus_details.english.name;
      const bus_plate_number = bus_details.english.plate_number;
      const seat_number = req.body["seat_number"];
      const ethotime = getTimeFormatter(departure);
      //email ticket
      await nodemailer(
        {
          createTicket,
          email,
          phone,
          firstname,
          lastname,
          seat_number,
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

      return responseHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        createTicket,
        null,
        config.post,
        null
      );
    } else {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        config.failedPayment,
        null
      );
    }
  } catch (err) {
    next(err);
  }
};
payment.createPaymentWeb = async (req, res, next) => {
  try {
    const adminPayment = await paymentMethodSch.findOne({
      company_id: null,
    });
    // const paypalBaseUrl = configs.paypalBaseUrl;
    const {
      payer_id,
      PAYID,
      booking_id,
      discount_code_id,
      payment_type,
      bus_id,
      company_id,
      amount,
      transaction_id,
    } = req.body;
    const payload = { payer_id };

    let ticketCheck;

    if (typeof booking_id === "string") {
      ticketCheck = await ticketSch.findOne({
        booking_id: booking_id,
      });
    } else {
      ticketCheck = await ticketSch.findOne({
        booking_id: { $all: booking_id },
      });
    }

    if (ticketCheck) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        true,
        config.ticketExist,
        null
      );
    }

    const ticket = await ticketSch
      .findOne({ bus_id: bus_id })
      .sort({ created_at: -1 });
    const bus = await busSch.findOne({ _id: bus_id });

    const companyDetails = await companySch.findOne({ _id: company_id });
    let discountCodeData;

    try {
      if (discount_code_id && discount_code_id != " ") {
        discountCodeData = await discountCodeSchema.findOne({
          _id: discount_code_id,
        });
      }
    } catch (error) {
      next(error);
    }

    let booking;
    if (typeof booking_id === "string") {
      booking = await bookingSch.findOne({ _id: booking_id });
    } else {
      booking = await bookingSch.findOne({ _id: booking_id[0] });
    }

    if (!booking) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        true,
        config.errorBookingData,
        null
      );
    }
    const discount = discountCodeData ? discountCodeData.percent / 100 : 0;
    // const discountAmount = discount * bus.price.birr * booking_id.length;
    // let totalAmount = bus.price.birr * booking_id.length - discountAmount;
    let discountAmount;
    let totalAmount;

    if (typeof booking_id === "string") {
      discountAmount = bus.price.birr * 1 * discount;
      totalAmount = bus.price.birr * 1 - discountAmount;
    } else {
      discountAmount = bus.price.birr * booking_id.length * discount;
      totalAmount = bus.price.birr * booking_id.length - discountAmount;
    }

    let processing_charge = adminPayment
      ? adminPayment.telebirr_charge / 100
      : 0;
    let processingAmount = parseFloat(processing_charge * totalAmount).toFixed(
      2
    );
    let commision_charge = companyDetails
      ? companyDetails.commission_rate / 100
      : 0;
    let comissionAmount = parseFloat(commision_charge * totalAmount).toFixed(2);

    const busNumber = bus.english.bus_number;

    let read_ticket_id;
    if (ticket) {
      const splitArray = ticket.read_ticket_id.split("-");
      const incrementValue = parseInt(splitArray[splitArray.length - 1]) + 1;

      read_ticket_id = `${busNumber.replaceAll(" ", "-")}-${incrementValue}`;
    } else {
      read_ticket_id = `${busNumber.replaceAll(" ", "-")}-101`;
    }

    // if (payment.data.state == "approved") {

    let createPayment = new paymentSch({
      amount: amount,
      bus_fee: totalAmount,
      comission: comissionAmount,
      processing: processingAmount,
      bus_id: bus_id,
      booked_date: booking.date,
      payment_type: req.body["payment_type"],
      payment_gateway: req.body["payment_gateway"],
      booking_id: booking_id,
      status: "paid",
      transaction_id: transaction_id,
      currency: "USD",
      added_by: req.user ? req.user.authUser["_id"] : null,
      discount_code: discount_code_id ? discount_code_id : null,
      discount: discountAmount,
    });

    createPayment["user_id"] = req.user ? req.user.authUser["_id"] : null;
    createPayment["unique_id"] = req.body["unique_id"]
      ? req.body["unique_id"]
      : null;

    createPayment.save();

    let payment_id = createPayment._id;
    let total_amount = createPayment.amount;

    // const response = await Promise.all(payment_details);
    let booking_details;
    if (typeof booking_id === "string") {
      booking_details = await bookingSch.findOne({ _id: booking_id });
    } else {
      booking_details = await bookingSch.findOne({
        _id: booking_id[0],
      });
    }

    const bus_details = await busSch
      .findOne(
        { _id: booking_details.bus_id },
        "english departure arrival price"
      )
      .populate({
        path: "route_id",
        select: "to from",
        populate: { path: "to from", select: "english" },
      });

    const date_time = `${booking.date}:${bus_details.departure}`;
    let createTicket = new ticketSch({
      booking_id: booking_id,
      isValidated: false,
      bus_id: bus_id,
      company_id: company_id,
      status: "sold-out",
      date: booking.date,
      departure_time: bus_details.departure,
      read_ticket_id: read_ticket_id,
      date_time: date_time,
      user_id: booking.added_by ? booking.added_by : null,
      unique_id: booking.unique_id ? booking.unique_id : null,
      route_id: bus.route_id,
      passenger_name: `${booking.firstname} ${booking.lastname}`,
    });
    const createTicketDetails = await createTicket.save();
    await bookingSch.updateMany(
      { _id: { $in: booking_id } },
      {
        $set: {
          isPaid: true,
          status: "sold-out",
          payment_id: payment_id,
          ticket_id: createTicketDetails._id,
        },
      }
    );
    await paymentSch.findOneAndUpdate(
      { _id: payment_id._id },
      {
        $set: {
          ticket_id: createTicketDetails._id,
        },
      }
    );

    const { phone, firstname, lastname, email, date } = booking_details;
    const payment_types = req.body["payment_type"];
    const amounts = total_amount;
    const to = bus_details.route_id.to.english.location;
    const from = bus_details.route_id.from.english.location;
    const departure = bus_details.departure;
    const arrival = bus_details.arrival;
    const bus_name = bus_details.english.name;
    const bus_plate_number = bus_details.english.plate_number;
    const seat_number = req.body["seat_number"];
    const ethotime = getTimeFormatter(departure);
    //email ticket
    await nodemailer(
      {
        createTicket,
        email,
        phone,
        firstname,
        lastname,
        seat_number,
        bus_details,
        date,
        amount: amounts,
        to,
        from,
        departure: ethotime,
        arrival,
        bus_name,
        bus_plate_number,
        payment_type: payment_types,
      },
      "sendTicket",
      res
    );

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      createTicket,
      null,
      config.post,
      null
    );
    // } else {
    //   return responseHelper.sendResponse(
    //     res,
    //     httpStatus.BAD_REQUEST,
    //     false,
    //     null,
    //     null,
    //     config.failedPayment,
    //     null
    //   );
    // }
  } catch (err) {
    next(err);
  }
};

//@desc Create payment for reserved buses in Cash deposit slip or bank transfer receipt
payment.cashDeposit = async (req, res, next) => {
  try {
    const {
      ticket_id,
      payment_type,
      reference_number,
      user_id,
      discount_code_id,
      unique_id,
      bank_name,
    } = req.body;
    // if (req.file) {
    //   req.body.receipt = req.file.path;
    // }
    const find_ticket = await paymentSch.findOne({ ticket_id: ticket_id });
    if (!find_ticket) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        config.validate.invalidTicket,
        null
      );
    }
    const createPayment = await paymentSch.findOneAndUpdate(
      { ticket_id: ticket_id },
      {
        $set: {
          ticket_id: ticket_id,
          amount: find_ticket.amount,
          payment_type: payment_type,
          payment_gateway: bank_name,
          status: "pending",
          reference_number: reference_number,
          receipt: req.body.receipt,
          added_by: user_id ? user_id : null,
          discount_code: discount_code_id ? discount_code_id : null,
          user_id: user_id ? user_id : null,
          unique_id: unique_id ? unique_id : null,
        },
      }
    );

    const ticket_details = await ticketSch.find({ _id: ticket_id });

    await bookingSch.updateMany(
      { _id: { $in: ticket_details.booking_id } },
      { $set: { payment_id: createPayment._id, ticket_id: ticket_id } }
    );

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      createPayment,
      null,
      config.post,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc Create payment for reserved buses in Cash deposit slip or bank transfer receipt
payment.cashDepositMobile = async (req, res, next) => {
  try {
    const {
      booking_id,
      amount,
      payment_type,
      reference_number,
      user_id,
      discount_code_id,
      discount_amount,
      unique_id,
      bank_name,
      bus_id,
      company_id,
    } = req.body;

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

    let ticketCheck;

    if (typeof booking_id === "string") {
      ticketCheck = await ticketSch.findOne({
        booking_id: booking_id,
      });
    } else {
      ticketCheck = await ticketSch.findOne({
        booking_id: { $all: booking_id },
      });
    }

    if (ticketCheck) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        true,
        config.ticketExist,
        null
      );
    }
    const ticket = await ticketSch
      .findOne({ bus_id: bus_id })
      .sort({ created_at: -1 });
    const bus = await busSch.findOne({ _id: bus_id });
    const companyDetails = await companySch.findOne({ _id: company_id });
    const adminPayment = await paymentMethodSch.findOne({
      company_id: null,
    });
    let discountCodeData;
    if (discount_code_id) {
      discountCodeData = await discountCodeSchema.findOne({
        _id: discount_code_id,
      });
    }
    const discount = discountCodeData ? discountCodeData.percent / 100 : 0;
    let discountAmount;
    let totalAmount;

    if (typeof booking_id === "string") {
      discountAmount = bus.price.birr * 1 * discount;
      totalAmount = bus.price.birr * 1 - discountAmount;
    } else {
      discountAmount = bus.price.birr * booking_id.length * discount;
      totalAmount = bus.price.birr * booking_id.length - discountAmount;
    }
    let processing_charge = adminPayment.telebirr_charge
      ? adminPayment.telebirr_charge / 100
      : 0;

    let commision_charge = companyDetails
      ? companyDetails.commission_rate / 100
      : 0;
    let processingAmount = parseFloat(processing_charge * totalAmount).toFixed(
      2
    );
    let comissionAmount = parseFloat(commision_charge * totalAmount).toFixed(2);

    const busNumber = bus.english.bus_number;

    let read_ticket_id;
    if (ticket) {
      const splitArray = ticket.read_ticket_id.split("-");
      const incrementValue = parseInt(splitArray[splitArray.length - 1]) + 1;

      read_ticket_id = `${busNumber.replaceAll(" ", "-")}-${incrementValue}`;
    } else {
      read_ticket_id = `${busNumber.replaceAll(" ", "-")}-101`;
    }
    let booking;

    if (typeof booking_id === "string") {
      booking = await bookingSch.findOne({ _id: booking_id });
    } else {
      booking = await bookingSch.findOne({ _id: booking_id[0] });
    }

    if (!booking) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        true,
        config.errorBookingData,
        null
      );
    }

    const bookingid = booking_id.map((a) => a._id);
    cconsole.log(bookingid);
    const date_time = `${booking.date}:${bus.departure}`;
    let createTicket = new ticketSch({
      booking_id: booking_id,
      isValidated: false,
      bus_id: bus_id,
      company_id: company_id,
      read_ticket_id: read_ticket_id,
      date: booking.date,
      status: "reserved",
      departure_time: bus.departure,
      date_time: date_time,
      user_id: booking.added_by ? booking.added_by : null,
      unique_id: booking.unique_id ? booking.unique_id : null,
      route_id: bus.route_id,
      passenger_name: `${booking.firstname} ${booking.lastname}`,
    });
    const createTicketDetails = await createTicket.save();

    let createPayment = new paymentSch({
      ticket_id: createTicket._id,
      bus_fee: totalAmount,
      comission: comissionAmount,
      processing: processingAmount,
      booked_date: booking.date,
      bus_id: bus_id,
      amount: amount,
      discount: discountAmount,
      payment_type: payment_type,
      payment_gateway: bank_name,
      status: "pending",
      reference_number: reference_number,
      added_by: user_id ? user_id : null,
      booking_id: booking_id,
      discount_code: discount_code_id ? discount_code_id : null,
    });

    createPayment["user_id"] = user_id ? user_id : null;
    createPayment["unique_id"] = unique_id ? unique_id : null;

    const createPaymentDetails = await createPayment.save();

    await bookingSch.updateMany(
      { _id: { $in: booking_id } },
      {
        $set: {
          payment_id: createPaymentDetails._id,
          ticket_id: createTicketDetails._id,
        },
      }
    );

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      createPayment,
      null,
      config.post,
      null
    );
  } catch (err) {
    next(err);
  }
};

payment.transactionList = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;

    let sortq = "-_id";
    let selectq;
    const bus_id = req.params.bus_id;
    const { date } = req.query;
    let searchq = { bus_id: bus_id, booked_date: date };
    console.log(date);
    let populate = {
      path: "booking_id",
      select:
        "bus_id status isPaid date position seat_number firstname lastname email phone ticketed_by ticket_id",
      match: { bus_id: bus_id, date: date, status: "sold-out" },
    };
    let populate2 = {
      path: "ticket_id",
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
      paymentSch,
      page,
      size,
      sortq,
      searchq,
      selectq,
      next,
      populate,
      populate2
    );
    console.log(datas);
    let newFilter = datas.data.filter((a) => a.booking_id[0]);
    console.log("new Filter", newFilter);
    const totalAmount = newFilter.reduce((t, a) => {
      if (a.booking_id[0].ticketed_by !== "counter") {
        t = t + a.bus_fee;
      }

      return t;
    }, 0);
    const totalDiscount = newFilter.reduce((t, a) => {
      t = t + (a.discount ? a.discount : 0);

      return t;
    }, 0);
    const totalProcessing = newFilter.reduce((t, a) => {
      t = t + (a.processing ? a.processing : 0);

      return t;
    }, 0);
    const totalComission = newFilter.reduce((t, a) => {
      t = t + (a.comission ? a.comission : 0);

      return t;
    }, 0);

    return responseHelper.paginationSendResponse(
      res,
      httpStatus.OK,
      true,
      {
        data: newFilter,
        totalAmount,
        totalDiscount,
        totalProcessing,
        totalComission,
      },
      config.get,
      page,
      size,
      newFilter.length
    );
  } catch (err) {
    next(err);
  }
};

//@desc add mailing server credentials
payment.addCompanyPaymentMethod = async (req, res, next) => {
  try {
    //const company = await companySch.findOne({ _id: req.body.company_id });

    const updatePaymentMethod = await paymentMethodSch.findOne({
      company_id: company_id,
    });

    if (!updatePaymentMethod) {
      let paymentMethodDetails = new paymentMethodSch({
        telebirr_account: req.body["telebirr_account"],
        cbe_account: req.body["cbe_account"],
        added_by: req.user.authUser["_id"],
        company_id: company_id,
      });
      await paymentMethodDetails.save();

      return responseHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        paymentMethodDetails,
        null,
        config.paymentMethodPost,
        null
      );
    }

    updatePaymentMethod.telebirr_account = req.body["telebirr_account"];
    updatePaymentMethod.cbe_account = req.body["cbe_account"];

    await updatePaymentMethod.save();
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      updatePaymentMethod,
      null,
      config.paymentMethodUpdate,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc add payment methods for compnay
payment.addPaymentMethod = async (req, res, next) => {
  try {
    const paymentMethodId = req.body["_id"];
    const paymentMethod = await paymentMethodSch.findById(paymentMethodId);
    if (paymentMethod) {
      paymentMethod.paypal_client_id = req.body["paypal_client_id"];
      paymentMethod.paypal_secret_key = req.body["paypal_secret_key"];
      paymentMethod.telebirr_account = req.body["telebirr_account"];
      paymentMethod.ticket_price_usd = req.body["ticket_price_usd"];
      paymentMethod.updated_by = req.user.authUser["_id"];
      paymentMethod.telebirr_charge = req.body["telebirr_charge"];
      await paymentMethod.save();

      const busList = await busSch.find({ isDeleted: false });

      for (let i = 0; i < busList.length; i++) {
        await busSch.findOneAndUpdate(
          { _id: busList[i]._id },
          {
            $set: {
              "price.usd": req.body["ticket_price_usd"],
            },
          }
        );
      }

      return responseHelper.sendResponse(
        res,
        httpStatus.OK,
        true,
        paymentMethod,
        null,
        config.paymentMethodUpdate,
        null
      );
    }

    let paymentMethodDetails = new paymentMethodSch({
      paypal_client_id: req.body["paypal_client_id"],
      paypal_secret_key: req.body["paypal_secret_key"],
      telebirr_account: req.body["telebirr_account"],
      added_by: req.user.authUser["_id"],
      ticket_price_usd: req.body["ticket_price_usd"],
      telebirr_charge: req.body["telebirr_charge"],
    });
    await paymentMethodDetails.save();

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      paymentMethodDetails,
      null,
      config.post,
      null
    );
  } catch (err) {
    next(err);
  }
};
//@desc GET: verify discount code for vehicle/bus
payment.getPaymentMethodList = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq = { company_id: req.user.authUser["company_id"] };
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

    if (
      req.user.authUser["role"] == "super-admin" ||
      req.user.authUser.role == "admin"
    ) {
      searchq = { company_id: null };
    }

    let datas = await responseHelper.getquerySendResponse(
      paymentMethodSch,
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
//@desc Get: company payment methods details filter according to company id
payment.getCompanyPaymentMethodDetails = async (req, res, next) => {
  try {
    const paymentMethod_id = req.params.paymentMethod_id;
    const paymentMethod = await paymentMethodSch.findOne({
      _id: paymentMethod_id,
    });
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      paymentMethod,
      null,
      config.get,
      null
    );
  } catch (err) {
    next(err);
  }
};
payment.getPaymentMethodDetails = async (req, res, next) => {
  try {
    const company_id = req.params.company_id;
    // const company = await companySch.findOne({ _id: company_id });

    const paymentMethod = await paymentMethodSch.findOne({
      company_id: company_id,
    });

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      paymentMethod,
      null,
      config.get,
      null
    );
  } catch (err) {
    next(err);
  }
};

payment.updatePaymentMethodDetails = async (req, res, next) => {
  try {
    const paymentMethod_id = req.params.paymentMethod_id;

    const paymentMethodDetails = await paymentMethodSch.findOneAndUpdate(
      { _id: paymentMethod_id },
      {
        $set: {
          updated_by: req.user.authUser["_id"],
          paypal_client_id: req.body["paypal_client_id"],
          paypal_secret_key: req.body["paypal_secret_key"],
          telebirr_account: req.body["telebirr_account"],
          cbe_account: req.body["cbe_account"],
          ticket_price_usd: req.body["ticket_price_usd"],
          added_by: req.user.authUser["_id"],
        },
      }
    );
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      req.body,
      null,
      config.paymentMethodUpdate,
      null
    );
  } catch (err) {
    next(err);
  }
};

payment.deletePaymentMethodDetails = async (req, res, next) => {
  try {
    const paymentMethod_id = req.params.paymentMethod_id;

    const paymentMethod_details = await paymentMethodSch.findOneAndDelete({
      _id: paymentMethod_id,
    });
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

module.exports = payment;
