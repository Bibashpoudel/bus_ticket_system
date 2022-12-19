const supportSch = require("./supportSchema");
const commentSch = require("./commentSchema");
const httpStatus = require("http-status");
const config = require("./supportConfig");
const responseHelper = require("../../helper/responseHelper");

const supportController = {};

//@desc POST: Add support details
supportController.createSupport = async (req, res, next) => {
  try {
    let supportDetails = new supportSch({
      title: req.body["title"],
      category: req.body["category"],
      description: req.body["description"],
      priority: req.body["priority"],
      image: req.body["image"],
      status: "open",
      added_by: req.user.authUser["_id"],
    });

    const addSupport = await supportDetails.save();
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      addSupport,
      null,
      config.post,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc GET: Get support details list
supportController.getSupportList = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq = { added_by: req.user.authUser["_id"] };
    let sortq = "-_id";
    let selectq;
    let populate = {
      path: "added_by category",
      select: "firstname lastname email image role phone category",
    };
    if (
      req.user.authUser["role"] === "super-admin" ||
      req.user.authUser["role"] === "admin"
    ) {
      searchq = {};
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

    let datas = await responseHelper.getquerySendResponse(
      supportSch,
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

//@desc GET: Get support details
supportController.supportDetails = async (req, res, next) => {
  try {
    const supportDetails = await supportSch
      .findOne({ _id: req.params.support_id })
      .populate({
        path: "added_by category",
        select: "firstname lastname email image role phone category",
      });
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      supportDetails,
      null,
      config.get,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc PATCH: update support details
supportController.updateSupportDetails = async (req, res, next) => {
  try {
    const supportDetails = await supportSch.findOneAndUpdate(
      { _id: req.params.support_id },
      {
        $set: {
          title: req.body["title"],
          category: req.body["category"],
          description: req.body["description"],
          priority: req.body["priority"],
          image: req.body["image"],
          status: req.body["status"],
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
      config.updateSupport,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc delete vehicle/bus route
supportController.deleteSupportTicket = async (req, res, next) => {
  try {
    const support_id = req.params.support_id;
    await supportSch.findOneAndDelete({ _id: support_id });
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

//@desc reply to support ticket
supportController.supportResponse = async (req, res, next) => {
  try {
    const comment = new commentSch({
      support_id: req.params.support_id,
      comment: req.body.comment,
      added_by: req.user.authUser["_id"],
    });
    const commentDetails = await comment.save();
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      commentDetails,
      null,
      config.post,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc get support ticket reply list
supportController.listSupportResponse = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq = { support_id: req.params.support_id };
    let sortq = "-_id";
    let selectq;
    let populate = {
      path: "added_by",
      select: "firstname lastname email image role phone",
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
      commentSch,
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

//@desc update support reply
supportController.updateSupportResponse = async (req, res, next) => {
  try {
    await commentSch.findOneAndUpdate(
      { _id: req.params.response_id },
      {
        $set: {
          comment: req.body.comment,
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
      config.updateSupport,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc delete support reply
supportController.deleteSupportResponse = async (req, res, next) => {
  try {
    await commentSch.findOneAndDelete({ _id: req.params.response_id });
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

//@desc get support reply details
supportController.getSupportResponse = async (req, res, next) => {
  try {
    const response = await commentSch
      .findOne({ _id: req.params.response_id })
      .populate({
        path: "added_by",
        select: "firstname lastname email image role phone",
      });
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

module.exports = supportController;
