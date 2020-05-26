const {
    register,
    checkDuplicate,
    login,
    updateToken,
  } = require("../controllers/userController"),
  express = require("express"),
  router = express.Router();

router.post("/register", register);
router.post("/checkDuplicate", checkDuplicate);
router.post("/login", login);
router.post("/updateToken", updateToken);

module.exports = router;
