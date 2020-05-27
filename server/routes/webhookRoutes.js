const { handleWebhook } = require("../controllers/webhookController"),
  express = require("express"),
  router = express.Router(),
  bodyParser = require("body-parser");

router.post("/", bodyParser.raw({ type: "application/json" }), handleWebhook);

module.exports = router;
