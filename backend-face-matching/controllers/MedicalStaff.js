const db = require("../models");

const updateDepartmentId = async (req, res) => {
  update = { where: { department_id: req.query.id_old } };

  await db.MedicalStaff.update({ department_id: req.query.id_new }, update);

  res.send(200).send();
};

const updateHospitalId = async (req, res) => {
  update = { where: { hospital_id: req.query.id_old } };

  await db.MedicalStaff.update({ hospital_id: req.query.id_new }, update);

  res.send(200).send();
};

module.exports = { updateDepartmentId, updateHospitalId };
