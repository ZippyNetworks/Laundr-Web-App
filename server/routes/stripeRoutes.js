const {
    createCheckoutSession,
    createSetupIntent,
    fetchUser,
    chargeCustomer,
    updateSubscriptionLbs,
    createSelfPortal,
    getCardDetails,
    setRegPaymentID,
    detachOldPaymentID,
  } = require("../controllers/stripeController"),
  express = require("express"),
  router = express.Router();

router.post("/createCheckoutSession", createCheckoutSession);
router.post("/createSetupIntent", createSetupIntent);
//todo: add middleware to routes like this! move fetchuser middleware to usercontroller. have one for findbyphone and findbyemail
//think of other middlewares to add to reduce repeated code!
router.post(
  "/chargeCustomer",
  fetchUser,
  chargeCustomer,
  updateSubscriptionLbs
);
router.post("/getCardDetails", getCardDetails);
router.post("/setRegPaymentID", setRegPaymentID, detachOldPaymentID);
router.post("/createSelfPortal", createSelfPortal);

module.exports = router;
