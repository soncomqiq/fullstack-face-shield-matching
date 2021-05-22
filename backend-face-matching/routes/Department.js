const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/Department");
const passport = require("passport");

const auth = passport.authenticate("jwt-admin", { session: false });

router.get("/", departmentController.getDepartments);

router.put("/", auth, departmentController.updateDepartments);
module.exports = router;

router.delete("/", auth, departmentController.deleteDepartment);

module.exports = router;
