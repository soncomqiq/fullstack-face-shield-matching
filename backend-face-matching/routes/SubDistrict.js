const express = require("express");
const router = express.Router();
const subDistrictController = require("../controllers/SubDistrict");

router.get("/", subDistrictController.getAllSubDistrictById);

module.exports = router;
