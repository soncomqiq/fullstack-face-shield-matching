const db = require("../models");

const getAllRegions = async (req, res) => {
  const regions = await db.Region.findAll();
  res.status(200).send(regions);
};

module.exports = { getAllRegions };
