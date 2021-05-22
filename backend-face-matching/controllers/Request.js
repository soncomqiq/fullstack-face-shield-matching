const db = require("../models");
const { Op } = require("sequelize");

const createNewRequest = async (req, res) => {
  const provinceId = Number(req.body.province_id);
  const subDistrictId = Number(req.body.sub_district_id);
  const requestAmount = Number(req.body.amount);
  const requestName = req.body.name;
  const requestLineId = req.body.line_id;

  let departmentId = Number(req.body.department_id);
  let hospitalId = Number(req.body.hospital_id);

  if (departmentId === -1) {
    const departmentName = req.body.department_name;
    const targetDepartment = await db.Department.findOne({
      where: { department: departmentName },
    });

    if (targetDepartment) {
      departmentId = Number(targetDepartment.id);
    } else {
      const newDepartment = await db.Department.create({
        department: departmentName,
        isAccept: false,
      });

      departmentId = Number(newDepartment.id);
    }
  }

  if (hospitalId === -1) {
    const hospitalName = req.body.hospital_name;

    const newHospital = await db.Hospital.create({
      hospital: hospitalName,
      pds_id: subDistrictId,
      isAccept: false,
    });

    hospitalId = Number(newHospital.id);
  }

  const newMagicalStaff = await db.MedicalStaff.create({
    name: requestName,
    line_id: requestLineId,
    department_id: departmentId,
    hospital_id: hospitalId,
  });

  const targetRegion = await db.Province.findOne({
    where: { id: provinceId },
    attributes: ["region_id"],
  });

  console.log(targetRegion);

  const newRequest = await db.Request.create({
    request_amount: requestAmount,
    reserve_amount: 0,
    delivered_amount: 0,
    isUrgent: false,
    medical_staff_id: newMagicalStaff.id,
    region_id: targetRegion.region_id,
  });

  res.status(201).send(newRequest);
};

const getAllRequest = async (req, res) => {
  const hospitalId = Number(req.query.hospital_id);
  const pageSize = Number(req.query.page_size);
  const page = Number(req.query.page);
  const isUrgent = Boolean(req.query.urgent);
  const regionId = Number(req.query.region_id);

  if (hospitalId) {
    let staffIds = await db.MedicalStaff.findAll({
      where: { hospital_id: hospitalId },
      attributes: ["id"],
    });

    staffIds = staffIds.map((element) => element.id);

    const requests = await db.Request.findAll({
      where: { medical_staff_id: { [Op.in]: staffIds } },
      include: { model: db.MedicalStaff, include: [db.Department] },
    });

    res.status(200).send(requests);
  } else if (pageSize && page) {
    const offset = (page - 1) * pageSize;
    let query = {
      limit: pageSize,
      offset: offset,
      include: {
        model: db.MedicalStaff,
        include: [
          { model: db.Hospital, include: [db.ProvinceDistrictSubdistrict] },
          db.Department,
        ],
      },
    };
    query["where"] = { request_amount: { [Op.gt]: 0 } };

    if (isUrgent) {
      query["where"].isUrgent = true;
    }

    if (regionId) {
      query["where"].region_id = regionId;
    }

    const { count, rows } = await db.Request.findAndCountAll(query);

    res.status(200).send({ totalRequests: count, requests: rows });
  } else {
    res.status(400).send();
  }
};

const getRequestById = async (req, res) => {
  const requestId = req.params.id;

  const targetRequest = await db.Request.findOne({
    where: { id: requestId },
    include: { model: db.MedicalStaff, include: [db.Department, db.Hospital] },
  });

  res.status(200).send(targetRequest);
};

const getRequestAndPhone = async (req, res) => {
  const region = req.query.region;
  const query = {
    include: [
      {
        model: db.MedicalStaff,
        attributes: ["hospital_id"],
        include: [{ model: db.Hospital, attributes: ["hospital"] }],
      },
    ],
  };
  if (region) {
    query["where"] = { region_id: region };
  }

  const result = await db.Request.findAll(query);

  res.status(200).send(result);
};

const updatePatchRequest = async (req, res) => {
  const query = {};
  const checkUrgent = Boolean(Number(req.query.urgent));
  const newRequestAmount = Number(req.query.request_amount);

  if (req.query.urgent) {
    query.isUrgent = checkUrgent;
  }

  if (req.query.request_amount) {
    query.request_amount = newRequestAmount;
  }

  await db.Request.update(query, { where: { id: req.query.id } });
  res.status(200).send({ message: "successfully" });
};

module.exports = {
  createNewRequest,
  getAllRequest,
  getRequestAndPhone,
  updatePatchRequest,
  getRequestById,
};
