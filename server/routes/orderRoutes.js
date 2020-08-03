const {
    checkExistingOrder,
    countOrders,
    placeOrder,
    fetchOrders,
    getExistingOrder,
  } = require("../controllers/orderController"),
  express = require("express"),
  router = express.Router();

router.post("/placeOrder", checkExistingOrder, countOrders, placeOrder);
router.post("/fetchOrders", fetchOrders);
router.get("/getExistingOrder", getExistingOrder);

module.exports = router;
