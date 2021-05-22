const db = require("../models");

const getAllStatisticDashboard = async (req, res) => {
  const numberOfMakers = await db.Maker.count();
  const numberOfHospitals = await db.MedicalStaff.aggregate(
    "hospital_id",
    "count",
    { distinct: true }
  );
  const result1 = await db.Request.findAll({
    attributes: [
      [
        db.sequelize.fn("sum", db.sequelize.col("request_amount")),
        "request_amount",
      ],
    ],
    raw: true,
  });
  const result2 = await db.Request.findAll({
    attributes: [
      [
        db.sequelize.fn("sum", db.sequelize.col("reserve_amount")),
        "reserve_amount",
      ],
    ],
    raw: true,
  });
  const result3 = await db.Request.findAll({
    attributes: [
      [
        db.sequelize.fn("sum", db.sequelize.col("delivered_amount")),
        "delivered_amount",
      ],
    ],
    raw: true,
  });


  res.status(200).send({
    number_of_makers: numberOfMakers,
    number_of_hospitals: numberOfHospitals,
    request_amount: Number(result1[0].request_amount),
    reserve_amount: Number(result2[0].reserve_amount),
    delivered_amount: Number(result3[0].delivered_amount),
  });
};

module.exports = { getAllStatisticDashboard };
