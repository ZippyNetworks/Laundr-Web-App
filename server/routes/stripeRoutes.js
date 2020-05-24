const {
    createCheckoutSession,
    createSetupIntent,
    chargeCustomer,
  } = require("../controllers/stripeController"),
  express = require("express"),
  router = express.Router();

router.post("/createCheckoutSession", createCheckoutSession);
router.post("/createSetupIntent", createSetupIntent);
router.post("/chargeCustomer", chargeCustomer);

module.exports = router;
