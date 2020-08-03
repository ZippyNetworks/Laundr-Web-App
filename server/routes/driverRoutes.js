const {
    findOrder,
    assignOrderPickup,
    enterOrderWeight,
    setWasherDelivered,
    assignOrderDropoff,
    setUserDelivered,
  } = require("../controllers/driverController"),
  express = require("express"),
  router = express.Router();

router.put("/assignOrderPickup", findOrder, assignOrderPickup);
router.put("/updateOrderWeight", findOrder, enterOrderWeight);
router.put("/setWasherDelivered", findOrder, setWasherDelivered);
router.put("/assignOrderDropoff", findOrder, assignOrderDropoff);
router.put("/setUserDelivered", findOrder, setUserDelivered);

module.exports = router;
