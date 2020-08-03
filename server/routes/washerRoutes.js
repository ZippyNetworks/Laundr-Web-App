const { findOrder, setWasherDone } = require("../controllers/washerController"),
  express = require("express"),
  router = express.Router();

router.put("/setWasherDone", findOrder, setWasherDone);

module.exports = router;
