const db = require("../models");

const getAllDistrictById = async (req, res) => {
  const province_id = req.query.province_id;

  const district = await db.ProvinceDistrictSubdistrict.findAll({
    where: { province_id },
    attributes: [
      db.Sequelize.fn("DISTINCT", "district"),
      ["district_id", "id"],
      "district",
    ],
  });

  res.status(200).send(district);
};

module.exports = { getAllDistrictById };
