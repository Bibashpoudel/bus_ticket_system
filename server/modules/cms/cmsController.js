const cmsSch = require("./cmsSchema");
const httpStatus = require("http-status");
const responseHelper = require("../../helper/responseHelper");
const config = require("./cmsConfig");

const cmsController = {};

//@desc POST: Create cms page
cmsController.addCms = async (req, res, next) => {
  try {
    let cmsDetails = new cmsSch({
      added_by: req.user.authUser["_id"],
      english: req.body["english"],
      amharic: req.body["amharic"],
      oromifa: req.body["oromifa"],
      description: req.body["description"],
      type: req.body["type"],
    });

    await cmsDetails.save();
    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      cmsDetails,
      null,
      config.post,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc get cms list
cmsController.listCms = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq = {};
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

    let datas = await responseHelper.getquerySendResponse(
      cmsSch,
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

//@desc details of cms page
cmsController.cmsDetails = async (req, res, next) => {
  try {
    const cms = await cmsSch.findOne({ _id: req.params.cms_id });

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      cms,
      null,
      config.get,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc update details of cms page
cmsController.updateCmsDetails = async (req, res, next) => {
  try {
    const cms_id = req.params.cms_id;

    const updateCmsDetails = await cmsSch.findOneAndUpdate(
      { _id: cms_id },
      {
        $set: {
          updated_by: req.user.authUser["_id"],
          english: req.body["english"],
          amharic: req.body["amharic"],
          oromifa: req.body["oromifa"],
          description: req.body["description"],
          type: req.body["type"],
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

//@desc delete bus company
cmsController.deleteContent = async (req, res, next) => {
  try {
    await cmsSch.findOneAndDelete({ _id: req.params.cms_id });

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

module.exports = cmsController;
