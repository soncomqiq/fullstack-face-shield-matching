const express = require("express");
const router = express.Router();
const makerController = require("../controllers/Maker");
const passport = require("passport");

const auth = passport.authenticate("jwt", { session: false });

router.post("/register", makerController.registerMaker);
router.post("/login", makerController.loginMaker);
router.get("/check-token", auth, makerController.checkToken);

module.exports = router;
