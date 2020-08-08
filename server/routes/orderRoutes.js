const {
    checkExistingOrder,
    countOrders,
    placeOrder,
    fetchOrders,
    getExistingOrder,
    cancelOrder,
  } = require("../controllers/orderController"),
  express = require("express"),
  router = express.Router();

router.post("/placeOrder", checkExistingOrder, countOrders, placeOrder);
router.post("/fetchOrders", fetchOrders);
router.get("/getExistingOrder", getExistingOrder);
router.delete("/cancelOrder", cancelOrder);

module.exports = router;
