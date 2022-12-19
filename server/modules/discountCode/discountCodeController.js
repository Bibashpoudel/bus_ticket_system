const discountCodeSch = require("./discountCodeSchema");
const bookingSch = require("./../booking/bookingSchema");
const paymentSch = require("./../payment/paymentSchema");
const httpStatus = require("http-status");
const responseHelper = require("../../helper/responseHelper");
const config = require("./discountCodeConfig");
const { format } = require("date-fns");

const discountCodeController = {};

//@desc POST: Create discount code to vehicle/bus
discountCodeController.addDiscountCode = async (req, res, next) => {
  try {
    const { amount, percent } = req.body;
    if (!amount && !percent) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        config.validate.emptyAmount,
        null
      );
    }
    let discountCodeDetails = new discountCodeSch({
      added_by: req.user.authUser["_id"],
      code: req.body["code"],
      code_type: req.body["code_type"],
      amount: req.body["amount"],
      percent: req.body["percent"],
      start_date: req.body["start_date"],
      end_date: req.body["end_date"],
      company_id: req.user.authUser["company_id"],
    });

    await discountCodeDetails.save();
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      discountCodeDetails,
      null,
      config.post,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc GET: verify discount code for vehicle/bus
discountCodeController.validateCode = async (req, res, next) => {
  try {
    const company_id = req.body.company_id;
    const unique_id = req.body.unique_id;
    const codeExists = await discountCodeSch.findOne({ code: req.body.code });
    const today = format(new Date(), "MM/dd/yyyy");

    if (
      codeExists &&
      format(new Date(codeExists.end_date), "MM/dd/yyyy") >= today &&
      format(new Date(codeExists.start_date), "MM/dd/yyyy") <= today &&
      codeExists.company_id == company_id
    ) {
      if (req.user) {
        const payment = await paymentSch.findOne({
          discount_code: codeExists._id,
          user_id: req.user.authUser["_id"],
        });
        if (payment) {
          return responseHelper.sendResponse(
            res,
            httpStatus.BAD_REQUEST,
            false,
            null,
            null,
            config.validate.codeUsed,
            null
          );
        }
        return responseHelper.sendResponse(
          res,
          httpStatus.OK,
          true,
          codeExists,
          null,
          config.get,
          null
        );
      } else if (req.body.unique_id) {
        const payment = await paymentSch.findOne({
          discount_code: codeExists._id,
          unique_id: unique_id,
        });
        if (payment) {
          return responseHelper.sendResponse(
            res,
            httpStatus.BAD_REQUEST,
            false,
            null,
            null,
            config.validate.codeUsed,
            null
          );
        }
        return responseHelper.sendResponse(
          res,
          httpStatus.OK,
          true,
          codeExists,
          null,
          config.get,
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
      config.validate.invalidCode,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc GET: verify discount code for vehicle/bus
discountCodeController.promoCodeList = async (req, res, next) => {
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
      searchq = {};
    }

    let datas = await responseHelper.getquerySendResponse(
      discountCodeSch,
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

discountCodeController.getPromoCodeDetails = async (req, res, next) => {
  try {
    const code_id = req.params.code_id;
    const code_details = await discountCodeSch.findOne({ _id: code_id });
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      code_details,
      null,
      config.get,
      null
    );
  } catch (err) {
    next(err);
  }
};

discountCodeController.updatePromoCodeDetails = async (req, res, next) => {
  try {
    const code_id = req.params.code_id;

    const updateCodeDetails = await discountCodeSch.findOneAndUpdate(
      { _id: code_id },
      {
        $set: {
          updated_by: req.user.authUser["_id"],
          code: req.body["code"],
          code_type: req.body["code_type"],
          amount: req.body["amount"],
          percent: req.body["percent"],
          reach_count: req.body["reach_count"],
          start_date: req.body["start_date"],
          end_date: req.body["end_date"],
        },
      }
    );
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      req.body,
      null,
      config.update,
      null
    );
  } catch (err) {
    next(err);
  }
};

discountCodeController.deletePromoCode = async (req, res, next) => {
  try {
    const code_id = req.params.code_id;

    const code_used = await bookingSch.findOne({ code_id: code_id });
    if (code_used) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        config.validate.invalidDelete,
        null
      );
    }
    const updateCodeDetails = await discountCodeSch.findOneAndDelete({
      _id: code_id,
    });
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      req.body,
      null,
      config.delete,
      null
    );
  } catch (err) {
    next(err);
  }
};

module.exports = discountCodeController;
