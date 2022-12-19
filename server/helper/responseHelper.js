"use strict";
module.exports = {
  sendResponse: (res, status, success, data, errors, msg, token) => {
    try {
      const response = {};
      if (success !== null) response.success = success;
      if (data !== null) response.data = data;
      if (errors !== null) response.errors = errors;
      if (msg !== null) response.msg = msg;
      if (token !== null) response.token = token;
      console.log(status);
      return res.status(status).json(response);
    } catch (error) {
      console.log("responseerror", error);
    }
  },

  paginationSendResponse: (
    res,
    status,
    success,
    data,
    msg,
    pageno,
    pagesize,
    totaldata
  ) => {
    const response = {};
    if (data) response.data = data;
    if (success !== null) response.success = success;
    if (msg) response.msg = msg;
    if (pageno) response.page = pageno;
    if (pagesize) response.size = pagesize;
    if (typeof totaldata === "number") response.totaldata = totaldata;
    return res.status(status).json(response);
  },

  getquerySendResponse: async (
    model,
    page,
    size,
    sortq,
    findquery,
    selectquery,
    next,
    populate,
    populate1,
    populate2
  ) => {
    let datas = {};

    try {
      datas.data = await model
        .find(findquery)
        .select(selectquery)
        .sort(sortq)
        .skip((page - 1) * size)
        .limit(size * 1)
        .populate(populate)
        .populate(populate1)
        .populate(populate2);
      datas.totaldata = await model.countDocuments(findquery);

      return datas;
    } catch (err) {
      next(err);
    }
  },
};
