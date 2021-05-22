const db = require("../models");

const getHospitalByPdsId = async (req, res) => {
  const pds_id = req.query.pds_id;

  const hospital = await db.Hospital.findAll({
    where: { pds_id, isAccept: true },
  });

  res.status(200).send(hospital);
};

const getHospitalById = async (req, res) => {
  const hospitalId = Number(req.params.id);

  const targetHospital = await db.Hospital.findOne({
    where: { id: hospitalId },
  });

  res.status(200).send(targetHospital);
};

const getHospitalNonAccept = async (req, res) => {
  const target = Boolean(Number(req.params.id));
  const result = await db.Hospital.findAll({
    where: { isAccept: target },
    include: [db.MedicalStaff],
  });

  res.status(200).send(result);
};

const updateHospital = async (req, res) => {
  await db.Hospital.update(
    { hospital: req.body.hospital, isAccept: true },
    { where: { id: Number(req.query.id) } }
  );

  res.status(200).send();
};

const deleteHospital = async (req, res) => {
  await db.Hospital.destroy({ where: { id: req.query.id } });
  res.status(200).send();
};

module.exports = {
  getHospitalById,
  getHospitalByPdsId,
  getHospitalNonAccept,
  updateHospital,
  deleteHospital,
};
