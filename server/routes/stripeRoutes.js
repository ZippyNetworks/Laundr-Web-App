const { createCheckoutSession } = require("../controllers/stripeController"),
  express = require("express"),
  router = express.Router();

router.post("/createCheckoutSession", createCheckoutSession);

module.exports = router;
