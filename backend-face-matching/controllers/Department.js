const db = require("../models");

const getDepartments = async (req, res) => {
  const nonAccept = Boolean(Number(req.query.non_accept));
  const accepts = Boolean(Number(req.query.accepts));
  const includedRequest = Boolean(Number(req.query.included_request));
  let query = { where: {} };

  console.log(nonAccept);
  if (nonAccept) {
    query.where.isAccept = false;
  }
  if (accepts) {
    query.where.isAccept = true;
  }
  console.log(includedRequest);
  if (includedRequest) {
    query["include"] = { model: db.MedicalStaff, include: [db.Request] };
  }
  const departments = await db.Department.findAll(query);
  res.status(200).send(departments);
};

const updateDepartments = async (req, res) => {
  update = { where: { id: req.query.id } };
  await db.Department.update(
    { isAccept: true, department: req.body.department },
    update
  );
  res.status(200).send({ message: "Success" });
};

const deleteDepartment = async (req, res) => {
  await db.Department.destroy({ where: { id: req.query.id } });
  res.status(204).send();
};

module.exports = { getDepartments, updateDepartments, deleteDepartment };
