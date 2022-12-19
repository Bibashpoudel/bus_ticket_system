const emailSch = require("./emailSettingSchema");
const httpStatus = require("http-status");
const responseHelper = require("../../helper/responseHelper");
const config = require("./emailSettingConfig");

const emailController = {};

//@desc add mailing server credentials
emailController.addCretentials = async (req, res, next) => {
  try {
    let emailDetails = new emailSch({
      service: req.body["service"],
      host: req.body["host"],
      port: req.body["port"],
      sender: req.body["sender"],
      account: req.body["account"],
      security: req.body["security"],
      password: req.body["password"],
      name: req.body["name"],
      added_by: req.user.authUser["_id"],
    });
    await emailDetails.save();

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      emailDetails,
      null,
      config.post,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc GET: verify discount code for vehicle/bus
emailController.getEmailCredentialList = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq = { added_by: req.user.authUser["_id"] };
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
      emailSch,
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

emailController.getEmailCredentialDetails = async (req, res, next) => {
  try {
    const emailSetting_id = req.params.emailSetting_id;
    const emailSetting_details = await emailSch.findOne({
      _id: emailSetting_id,
    });
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      emailSetting_details,
      null,
      config.get,
      null
    );
  } catch (err) {
    next(err);
  }
};

emailController.updateEmailCredentialDetails = async (req, res, next) => {
  try {
    const emailSetting_id = req.params.emailSetting_id;

    const emailSettingDetails = await emailSch.findOneAndUpdate(
      { _id: emailSetting_id },
      {
        $set: {
          updated_by: req.user.authUser["_id"],
          service: req.body["service"],
          host: req.body["host"],
          port: req.body["port"],
          sender: req.body["sender"],
          account: req.body["account"],
          security: req.body["security"],
          password: req.body["password"],
          name: req.body["name"],
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

emailController.deleteEmailCredential = async (req, res, next) => {
  try {
    const emailSetting_id = req.params.emailSetting_id;
    const emailSetting_details = await emailSch.findOneAndDelete({
      _id: emailSetting_id,
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

module.exports = emailController;
