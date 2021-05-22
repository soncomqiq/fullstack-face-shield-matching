const db = require("../models");

const getAllSubDistrictById = async (req, res) => {
  const province_id = req.query.province_id;
  const district_id = req.query.district_id;

  const subDistrict = await db.ProvinceDistrictSubdistrict.findAll({
    where: { province_id, district_id },
    attributes: [
      db.Sequelize.fn("DISTINCT", "sub_district"),
      "id",
      "sub_district_id",
      "sub_district",
    ],
  });

  res.status(200).send(subDistrict);
};

module.exports = { getAllSubDistrictById };
