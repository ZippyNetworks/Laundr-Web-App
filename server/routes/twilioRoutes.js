const { verifyPhone } = require("../controllers/twilioController"),
  express = require("express"),
  router = express.Router();

router.post("/verifyPhone", verifyPhone);

module.exports = router;
