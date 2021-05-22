const db = require("../models");

const getAllProvinces = async (req, res) => {
  const regionId = req.body.region_id;
  let provinces;

  if (regionId) {
    provinces = await db.Province.findAll({
      where: { region_id: regionId },
    });
  } else {
    provinces = await db.Province.findAll();
  }

  res.status(200).send(provinces);
};

module.exports = { getAllProvinces };
