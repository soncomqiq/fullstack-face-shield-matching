const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/Dashboard");

router.get("/", dashboardController.getAllStatisticDashboard);

module.exports = router;
