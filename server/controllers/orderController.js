const { showConsoleError, caughtError } = require("../helpers/errors");
const Order = require("../models/Order");

//change to fetchorder
const checkExistingOrder = async (req, res, next) => {
  try {
    //find an order that isn't cancelled or confirmed finished
    const order = await Order.findOne({
      "userInfo.email": req.body.email,
      "orderInfo.status": { $nin: [7, 8] },
    });

    if (order) {
      return res.json({
        success: false,
        message: "User already has an active order.",
      });
    } else {
      next();
    }
  } catch (error) {
    showConsoleError("checking existing order", error);
    return res.json({
      success: false,
      message: caughtError("checking existing order"),
    });
  }
};

const countOrders = async (req, res, next) => {
  try {
    const count = await Order.countDocuments();

    if (count) {
      res.locals.count = count;
    } else {
      res.locals.count = 0;
    }

    next();
  } catch (error) {
    showConsoleError("counting orders", error);
    return res.json({
      success: false,
      message: caughtError("counting orders"),
    });
  }
};

const placeOrder = async (req, res) => {
  try {
    const orderCount = res.locals.count;

    const order = await Order.create({
      userInfo: {
        email: req.body.email,
        phone: req.body.phone,
        fname: req.body.fname,
        lname: req.body.lname,
      },
      washerInfo: {
        scented: req.body.scented,
        delicates: req.body.delicates,
        separate: req.body.separate,
        towelsSheets: req.body.towelsSheets,
        prefs: req.body.washerPrefs,
        address: "978 SW 2nd Ave, Gainesville, FL 32601", //default
        email: "w1@gmail.com", //default
        phone: "laundrPhone#", //default
      },
      pickupInfo: {
        prefs: req.body.addressPrefs,
        date: req.body.pickupDate,
        time: req.body.pickupTime,
        driverEmail: "N/A",
      },
      dropoffInfo: {
        date: "N/A",
        time: "N/A",
        driverEmail: "N/A",
      },
      orderInfo: {
        coupon: req.body.coupon,
        status: 0,
        weight: "N/A",
        cost: req.body.cost,
        created: req.body.created,
        address: req.body.address,
        orderID: orderCount + 1,
      },
    });

    return res.json({
      success: true,
      message: "Order successfully placed.",
      orderID: order.orderInfo.orderID,
    });
  } catch (error) {
    showConsoleError("placing order", error);
    return res.json({
      success: false,
      message: caughtError("placing order"),
    });
  }
};

const fetchOrders = async (req, res) => {
  //filter by email here so other info not leaked
  try {
    const statuses = req.body.statuses;
    const filter = req.body.filter;

    const orders = await Order.find().where("orderInfo.status").in(statuses);

    //if any filtering by email needs to be applied
    if (filter) {
      const filterConfig = req.body.filterConfig;
      const filterEmail = req.body.filterEmail;

      switch (filterConfig) {
        case "driverAccepted":
          orders = orders.filter((order) => {
            return (
              order.pickupInfo.driverEmail === filterEmail ||
              order.dropoffInfo.driverEmail === filterEmail
            );
          });
          break;

        case "washerAssigned":
          orders = orders.filter((order) => {
            return order.washerInfo.email === filterEmail;
          });
          break;
      }
    }

    return res.json({ success: true, message: orders });
  } catch (error) {
    showConsoleError("getting orders", error);
    return res.json({
      success: false,
      message: caughtError("getting orders"),
    });
  }
};

const getExistingOrder = async (req, res) => {
  //find the order that isn't cancelled or done, should only ever be one. if more than one, undefined behavior since findOne returns only one
  try {
    const order = await Order.findOne({
      "userInfo.email": req.query.email,
      "orderInfo.status": { $nin: [7, 8] },
    });

    if (order) {
      return res.json({
        success: true,
        message: order,
      });
    } else {
      return res.json({
        success: true,
        message: "N/A",
      });
    }
  } catch (error) {
    showConsoleError("getting existing order", error);
    return res.json({
      success: false,
      message: caughtError("getting existing order"),
    });
  }
};

module.exports = {
  checkExistingOrder,
  countOrders,
  placeOrder,
  fetchOrders,
  getExistingOrder,
};
