const {
    findOrder,
    countOrders,
    placeOrder,
    getOrders,
    getCurrentOrder,
  } = require("../controllers/orderController"),
  express = require("express"),
  router = express.Router();

router.post("/placeOrder", findOrder, countOrders, placeOrder);
router.get("/getOrders", getOrders);
router.post("/getCurrentOrder", getCurrentOrder);

module.exports = router;
