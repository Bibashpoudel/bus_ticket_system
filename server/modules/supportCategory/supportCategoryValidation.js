const httpStatus = require('http-status');
const config = require('./supportCategoryConfig');
const responseHelper = require('../../helper/responseHelper');
const otherHelper = require('../../helper/validationHelper');
const supportCategorySch = require('./supportCategorySchema');
const isEmpty = require('../../validation/isEmpty');

const validation = {};

validation.checkDataDuplicate = async (req, res, next) => {
  try {
    const { category } = req.body;

    let filter = {category: category };

    if (req.params.category_id) {
      filter._id = { $ne: req.params.category_id }
    }

    const data = await supportCategorySch.findOne(filter);
    const error = {};

    if (data) {
      error.category = 'Support category already exists';
      return responseHelper.sendResponse(res, httpStatus.CONFLICT, false, null, error, config.validate.duplicateData, null);
    }
    next();
  }
  catch (err) {
    next(err);
  }
};

validation.validateInput = async (req, res, next) => {
  const data = req.body;
  const validateArray = [
    {
      field: 'category',
      validate: [
        {
            condition: 'IsEmpty',
            msg: config.validate.empty,
        },
      ],
    },
  ];
  const errors = otherHelper.validation(data, validateArray);
  if (!isEmpty(errors)) {
    return responseHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, config.validate.invalid, null);
  } else {
    next();
  }
};


module.exports = validation;