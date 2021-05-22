const express = require("express");
const router = express.Router();
const hospitalController = require("../controllers/Hospital");
const passport = require("passport");

const authAdmin = passport.authenticate("jwt-admin", { session: false });

router.get("/", authAdmin, hospitalController.getHospitalByPdsId);
router.get("/:id", authAdmin, hospitalController.getHospitalById);

router.get(
  "/non_accepts/:id",
  authAdmin,
  hospitalController.getHospitalNonAccept
);

router.put("/", authAdmin, hospitalController.updateHospital);

router.delete("/", authAdmin, hospitalController.deleteHospital);

module.exports = router;
