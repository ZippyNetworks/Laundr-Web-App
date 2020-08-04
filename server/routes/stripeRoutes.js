const {
    createCheckoutSession,
    createSetupIntent,
    findUser,
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
router.post("/chargeCustomer", findUser, chargeCustomer, updateSubscriptionLbs);
router.post("/getCardDetails", getCardDetails);
router.post("/setRegPaymentID", findUser, setRegPaymentID);
router.post("/createSelfPortal", createSelfPortal);

module.exports = router;
