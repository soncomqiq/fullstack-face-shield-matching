const express = require("express");
const router = express.Router();
const districtController = require("../controllers/District");

router.get("/", districtController.getAllDistrictById);

module.exports = router;
