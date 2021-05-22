const express = require("express");
const router = express.Router();

const { register, login, checkToken } = require("../controllers/Admin");
const passport = require("passport");

const auth = passport.authenticate("jwt-admin", { session: false });

router.post("/register", register);

router.post("/login", login);

router.get("/check_token", auth, checkToken);

module.exports = router;
