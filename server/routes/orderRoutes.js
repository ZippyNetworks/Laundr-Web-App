const {
    checkExistingOrder,
    countOrders,
    placeOrder,
    fetchOrders,
    getExistingOrder,
    cancelOrder,
    setDropoff,
  } = require("../controllers/orderController"),
  express = require("express"),
  router = express.Router();

//todo: middleware for finding order like in driver + washer

router.post("/placeOrder", checkExistingOrder, countOrders, placeOrder);
router.post("/fetchOrders", fetchOrders);
router.get("/getExistingOrder", getExistingOrder);
router.delete("/cancelOrder", cancelOrder);
router.put("/setDropoff", setDropoff);

module.exports = router;
