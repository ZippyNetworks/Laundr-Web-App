const {
    createCheckoutSession,
    createSetupIntent,
    chargeCustomer,
    getCardDetails,
  } = require("../controllers/stripeController"),
  express = require("express"),
  router = express.Router();

router.post("/createCheckoutSession", createCheckoutSession);
router.post("/createSetupIntent", createSetupIntent);
router.post("/chargeCustomer", chargeCustomer);
router.post("/getCardDetails", getCardDetails);

module.exports = router;
