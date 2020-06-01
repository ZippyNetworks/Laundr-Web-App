const {
    createCheckoutSession,
    createSetupIntent,
    fetchUser,
    chargeCustomer,
    updateSubscriptionLbs,
    chargeCustomer2,
    getCardDetails,
    setRegPaymentID,
  } = require("../controllers/stripeController"),
  express = require("express"),
  router = express.Router();

router.post("/createCheckoutSession", createCheckoutSession);
router.post("/createSetupIntent", createSetupIntent);
//todo: add middleware to routes like this! move fetchuser middleware to usercontroller. have one for findbyphone and findbyemail
router.post(
  "/chargeCustomer",
  fetchUser,
  chargeCustomer,
  updateSubscriptionLbs
);
router.post("/chargeCustomer2", chargeCustomer2);
router.post("/getCardDetails", getCardDetails);
router.post("/setRegPaymentID", setRegPaymentID);

module.exports = router;
