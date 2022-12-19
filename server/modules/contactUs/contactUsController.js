const contactUsSch = require("./contactUsSchema");
const httpStatus = require("http-status");
const responseHelper = require("../../helper/responseHelper");
const config = require("./contactUsConfig");
const { nodemailer } = require("./../../helper/nodemailer");

const contactUsController = {};

//@desc POST: Add support details
contactUsController.addContactDetails = async (req, res, next) => {
  try {
    let contactUsDetails = new contactUsSch({
      email: req.body["email"],
      fullname: req.body["fullname"],
      subject: req.body["subject"],
      message: req.body["message"],
    });

    const addSupport = await contactUsDetails.save();

    if (addSupport) {
      await nodemailer(
        {
          email: req.body["email"],
          fullname: req.body["fullname"],
          subject: req.body["subject"],
          message: req.body["message"],
        },
        "contactUs_Message",
        res
      );
    }
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      addSupport,
      null,
      config.sendMessage,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc GET: get support details
contactUsController.getContactUsList = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq;
    let sortq = "-_id";
    let select_email = "email";
    let select_phone = "phone";
    let select_calling_code = "calling_code";
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

    let datas = await responseHelper.getquerySendResponse(
      contactUsSch,
      page,
      size,
      sortq,
      searchq,
      select_email,
      next,
      populate
    );
    let phone = await responseHelper.getquerySendResponse(
      contactUsSch,
      page,
      size,
      sortq,
      searchq,
      select_phone,
      next,
      populate
    );
    let calling_code = await responseHelper.getquerySendResponse(
      contactUsSch,
      page,
      size,
      sortq,
      searchq,
      select_calling_code,
      next,
      populate
    );

    const response = {};
    response["email"] = datas.data;
    response["phone"] = phone.data;
    response["calling_code"] = calling_code.data;

    return responseHelper.paginationSendResponse(
      res,
      httpStatus.OK,
      true,
      response,
      "Data obtaied successfully",
      page,
      size,
      datas.totaldata
    );
  } catch (err) {
    next(err);
  }
};

module.exports = contactUsController;
