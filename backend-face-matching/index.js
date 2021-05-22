require("dotenv").config();
require("./config/passport/passport");

const express = require("express");
const db = require("./models");
const app = express();
const cors = require("cors");

const regionRoutes = require("./routes/Regions");
const provinceRoutes = require("./routes/Province");
const districtRoutes = require("./routes/District");
const subDistrictRoutes = require("./routes/SubDistrict");
const hospitalRoutes = require("./routes/Hospital");
const departmentRoutes = require("./routes/Department");
const requestRoutes = require("./routes/Request");
const makerRoutes = require("./routes/Maker");
const reserveRoutes = require("./routes/Reserve");
const dashboardRoutes = require("./routes/Dashboard");
const adminRoutes = require("./routes/Admin");
const medicalStaffRoutes = require("./routes/MedicalStaff");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/regions", regionRoutes);
app.use("/provinces", provinceRoutes);
app.use("/districts", districtRoutes);
app.use("/sub-districts", subDistrictRoutes);
app.use("/hospitals", hospitalRoutes);
app.use("/departments", departmentRoutes);
app.use("/requests", requestRoutes);
app.use("/makers", makerRoutes);
app.use("/reserves", reserveRoutes);
app.use("/dashboards", dashboardRoutes);
app.use("/admin", adminRoutes);
app.use("/medical-staff", medicalStaffRoutes);

db.sequelize.sync({ alter: false }).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
  });
});
