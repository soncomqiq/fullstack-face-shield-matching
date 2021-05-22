const express = require("express");
const router = express.Router();
const requestController = require("../controllers/Request");

const passport = require("passport");

const authAdmin = passport.authenticate("jwt-admin", { session: false });

router.post("/", requestController.createNewRequest);
router.get("/", requestController.getAllRequest);
router.get("/name", requestController.getRequestAndPhone);
router.get("/:id", requestController.getRequestById);

router.patch("/urgent", authAdmin, requestController.updatePatchRequest);

module.exports = router;
