const {
    createCheckoutSession,
    createSetupIntent,
    chargeCustomer,
    getCardDetails,
    setRegPaymentID,
  } = require("../controllers/stripeController"),
  express = require("express"),
  router = express.Router();

router.post("/createCheckoutSession", createCheckoutSession);
router.post("/createSetupIntent", createSetupIntent);
router.post("/chargeCustomer", chargeCustomer);
router.post("/getCardDetails", getCardDetails);
router.post("/setRegPaymentID", setRegPaymentID);

module.exports = router;
