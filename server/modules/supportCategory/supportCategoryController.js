const supportCategorySch = require('./supportCategorySchema');
const httpStatus = require('http-status');
const config = require('./supportCategoryConfig');
const responseHelper = require('../../helper/responseHelper');

const supportCategoryController = {};

//@desc Post: add support category
supportCategoryController.addSupportCategory = async(req, res, next) => {
  try { 
    const createCategory = new supportCategorySch({
      category: req.body['category'],
      added_by: req.user.authUser['_id']
    });
    await createCategory.save();
    return responseHelper.sendResponse(res, httpStatus.OK, true, createCategory, null, config.post, null);
  } catch (err) {
    next(err)
  }
};

//@desc GET: Get support category details list
supportCategoryController.getSupportList = async (req, res, next) => {
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

    let datas = await responseHelper.getquerySendResponse(supportCategorySch, page, size, sortq, searchq, selectq, next, populate);

    return responseHelper.paginationSendResponse(res, httpStatus.OK, true, datas.data, config.get, page, size, datas.totaldata)
  } catch (err) {
    next(err);
  }
};

//@desc GET: Get support category details
supportCategoryController.supportCategoryDetails = async (req, res, next) => {
  try {
    const supportCategoryDetails = await supportCategorySch.findOne({_id: req.params.category_id});
    return responseHelper.sendResponse(res, httpStatus.OK, true, supportCategoryDetails, null, config.get, null);
  } catch (err) {
    next(err);
  }
};

//@desc Patch: update support category
supportCategoryController.updateSupportCategory = async(req, res, next) => {
  try { 
    await supportCategorySch.findOneAndUpdate({_id: req.params.category_id},{$set: {
      category: req.body['category'],
      updated_by: req.user.authUser['_id']
    }});
    return responseHelper.sendResponse(res, httpStatus.OK, true, req.body, null, config.updateSupport, null);
  } catch (err) {
    next(err)
  }
};

//@desc Delete: delete support category
supportCategoryController.deleteSupportCategory = async(req, res, next) => {
  try { 
    await supportCategorySch.findOneAndDelete({_id: req.params.category_id});
    return responseHelper.sendResponse(res, httpStatus.OK, true, null, null, config.delete, null);
  } catch (err) {
    next(err)
  }
};

module.exports = supportCategoryController;