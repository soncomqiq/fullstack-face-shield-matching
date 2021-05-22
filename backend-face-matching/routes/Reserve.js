const express = require("express");
const router = express.Router();
const reserveController = require("../controllers/Reserve");
const passport = require("passport");

const auth = passport.authenticate("jwt", { session: false });
const authAdmin = passport.authenticate("jwt-admin", { session: false });

router.post("/", auth, reserveController.createNewReserve);
router.get("/", auth, reserveController.getAllReservesByMakerIds);
router.put("/:id", auth, reserveController.completedReserve);
router.delete("/:id", auth, reserveController.deleteReserve);
router.delete("/admin/:id", authAdmin, reserveController.deleteReserveForAdmin);
router.get("/for_admin", authAdmin, reserveController.getReserveAndMakerName);

module.exports = router;
