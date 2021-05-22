const express = require("express");
const router = express.Router();

const MedicalStaffController = require("../controllers/MedicalStaff");

const passport = require("passport");

const authAdmin = passport.authenticate("jwt-admin", { session: false });
router.put("/", authAdmin, MedicalStaffController.updateDepartmentId);

router.put("/hospital_id", authAdmin, MedicalStaffController.updateHospitalId);

module.exports = router;
