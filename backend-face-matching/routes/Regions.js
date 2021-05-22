const express = require("express");
const router = express.Router();
const regionController = require("../controllers/Region");

router.get("/", regionController.getAllRegions);

module.exports = router;
