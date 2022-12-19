const busTypeSch = require("./busTypeSchema");
const busSch = require("../buses/busSchema");
const busAllocationSch = require("../busAllocation/busAllocationSchema");
const httpStatus = require("http-status");
const responseHelper = require("../../helper/responseHelper");
const config = require("./busTypeConfig");

const busTypeController = {};

//@desc Add busType seat plan
busTypeController.addBusType = async (req, res, next) => {
  try {
    let busTypeDetails = new busTypeSch({
      added_by: req.user.authUser["company_id"],
      bus_type_column_left: req.body["bus_type_column_left"],
      bus_type_row_left: req.body["bus_type_row_left"],
      bus_type_column_right: req.body["bus_type_column_right"],
      bus_type_row_right: req.body["bus_type_row_right"],
      bus_type_cabin: req.body["bus_type_cabin"],
      bus_type_back: req.body["bus_type_back"],
      driver_seat_position: req.body["driver_seat_position"],
      english: req.body["english"],
      amharic: req.body["amharic"],
      oromifa: req.body["oromifa"],
      company_id: req.user.authUser["company_id"],
    });

    busTypeDetails.bus_type_column_left._id = generateObjID();
    busTypeDetails.bus_type_row_left._id = generateObjID();
    busTypeDetails.bus_type_column_right._id = generateObjID();
    busTypeDetails.bus_type_row_right._id = generateObjID();
    busTypeDetails.bus_type_cabin._id = generateObjID();
    busTypeDetails.bus_type_back._id = generateObjID();

    await busTypeDetails.save();

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      busTypeDetails,
      null,
      config.post,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc get list of bus types
busTypeController.busTypeList = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    const bus_allocation = await busAllocationSch.find(
      { user_id: req.user.authUser["_id"] },
      "bus_id"
    );
    const allocated_list = bus_allocation.map((a) => a.bus_id);
    const find_bus = await busSch.find(
      { _id: { $in: allocated_list } },
      "bus_type_id"
    );
    const bus_list = find_bus.map((a) => a.bus_type_id);

    let searchq = {
      added_by: req.user.authUser["company_id"],
      _id: { $in: bus_list },
      isDeleted: false,
    };
    let sortq = "-_id";
    let selectq;
    let populate = { path: "to from", select: "location" };
    let { search } = req.query;
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

    const totalSeat = function (obj) {
      const {
        bus_type_column_left,
        bus_type_row_left,
        bus_type_column_right,
        bus_type_row_right,
        bus_type_cabin,
        bus_type_back,
      } = obj;

      const total =
        (bus_type_column_left.number ? bus_type_column_left.number : 0) *
          (bus_type_row_left.number ? bus_type_row_left.number : 0) +
        (bus_type_column_right.number ? bus_type_column_right.number : 0) *
          (bus_type_row_right.number ? bus_type_row_right.number : 0) +
        (bus_type_cabin.number ? bus_type_cabin.number : 0) +
        (bus_type_back.number ? bus_type_back.number : 0);

      return total;
    };

    if (
      req.user.authUser.role == "super-admin" ||
      req.user.authUser.role == "admin"
    ) {
      searchq = { isDeleted: false };
    } else if (req.user.authUser.role == "bus-company") {
      searchq = { added_by: req.user.authUser["company_id"], isDeleted: false };
    }

    let datas = await responseHelper.getquerySendResponse(
      busTypeSch,
      page,
      size,
      sortq,
      searchq,
      selectq,
      next,
      populate
    );
    let newData = datas.data.map((item) => ({
      ...item._doc,
      total_seat: totalSeat(item._doc),
    }));

    if (search) {
      let newFilter = datas.data.filter(
        (a) =>
          a.english.bus_type.match(search) ||
          a.amharic.bus_type.match(search) ||
          a.oromifa.bus_type.match(search)
      );

      newData = newFilter.map((item) => ({
        ...item._doc,
        total_seat: totalSeat(item._doc),
      }));

      return responseHelper.paginationSendResponse(
        res,
        httpStatus.OK,
        true,
        newData,
        config.get,
        page,
        size,
        newData.length
      );
    }

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

//@desc details of bus type
busTypeController.busTypeDetails = async (req, res, next) => {
  try {
    const busType = await busTypeSch
      .findOne({ _id: req.params.busType_id })
      .populate({ path: "added_by updated_by", select: "firstname lastname" });

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      busType,
      null,
      config.get,
      null
    );
  } catch (err) {
    next(err);
  }
};

//@desc delete vehicle/bus type
busTypeController.deleteBusType = async (req, res, next) => {
  try {
    const busType_id = req.params.busType_id;
    const busExists = await busSch.findOne({ bus_type_id: busType_id });

    if (busExists) {
      return responseHelper.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        false,
        null,
        null,
        config.validate.busTypeExists,
        null
      );
    }

    await busTypeSch.findOneAndUpdate(
      { _id: busType_id },
      { $set: { isDeleted: false } }
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

//@desc update vehicle/bus type
busTypeController.updateBusType = async (req, res, next) => {
  try {
    await busTypeSch.findOneAndUpdate(
      { _id: req.params["busType_id"] },
      {
        $set: {
          updated_by: req.user.authUser["_id"],
          "bus_type_column_left.number":
            req.body.bus_type_column_left["number"],
          "bus_type_column_left.name": req.body.bus_type_column_left["name"],
          "bus_type_row_left.number": req.body.bus_type_row_left["number"],
          "bus_type_row_left.name": req.body.bus_type_row_left["name"],
          "bus_type_column_right.number":
            req.body.bus_type_column_right["number"],
          "bus_type_column_right.name": req.body.bus_type_column_right["name"],
          "bus_type_row_right.number": req.body.bus_type_row_right["number"],
          "bus_type_row_right.name": req.body.bus_type_row_right["name"],
          "bus_type_cabin.number": req.body.bus_type_cabin["number"],
          "bus_type_cabin.name": req.body.bus_type_cabin["name"],
          "bus_type_back.number": req.body.bus_type_back["number"],
          "bus_type_back.name": req.body.bus_type_back["name"],
          driver_seat_position: req.body["driver_seat_position"],
          english: req.body["english"],
          amharic: req.body["amharic"],
          oromifa: req.body["oromifa"],
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

//@desc GET: class_type title of the vehicle/bus
busTypeController.getClassTypeList = async (req, res, next) => {
  try {
    const data = await busTypeSch.find(
      { isDeleted: false },
      "english oromifa amharic"
    );
    let array = [];
    let newData = data.filter((a) => {
      if (array.length == 0) {
        array.push(a);
      }
      array.find((b) => {
        if (a.english.bus_type !== b.english.bus_type) {
          array.push(a);
        }
      });
    });

    return responseHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      array,
      null,
      config.get,
      null
    );
  } catch (err) {
    next(err);
  }
};

function generateObjID() {
  let ObjectId = (
    m = Math,
    d = Date,
    h = 16,
    s = (s) => m.floor(s).toString(h)
  ) => s(d.now() / 1000) + " ".repeat(h).replace(/./g, () => s(m.random() * h));
  return ObjectId();
}

module.exports = busTypeController;
