const db = require("../models");
const { QueryTypes } = require("sequelize");

const createNewReserve = async (req, res) => {
  const requestId = Number(req.query.request_id);
  const reserveAmount = Number(req.body.reserve_amount);

  const targetRequest = await db.Request.findOne({ where: { id: requestId } });

  console.log(reserveAmount);

  if (targetRequest && targetRequest.request_amount >= reserveAmount) {
    targetRequest.update({
      request_amount: targetRequest.request_amount - reserveAmount,
      reserve_amount: targetRequest.reserve_amount + reserveAmount,
    });
    console.log(`user id${req.user.id}`);

    await db.Reserve.create({
      amount: reserveAmount,
      status: "RESERVE",
      maker_id: req.user.id,
      request_id: targetRequest.id,
    });

    res.status(201).send({ message: "Success" });
  } else if (!targetRequest) {
    res.status(404).send({ message: "Reqeust Not Found" });
  } else {
    res.status(400).send({ message: "Something went wrong" });
  }
};

const getAllReservesByMakerIds = async (req, res) => {
  const makerId = Number(req.user.id);
  const requestId = Number(req.query.request_id);
  const query = { where: { maker_id: makerId } };

  if (requestId) {
    query["where"].request_id = requestId;
  }

  const reserves = await db.Reserve.findAll(query);

  res.status(200).send(reserves);
};

const completedReserve = async (req, res) => {
  const reserveId = Number(req.params.id);

  const targetReserve = await db.Reserve.findOne({
    where: { id: reserveId, status: "RESERVE" },
  });

  if (!targetReserve) {
    res.status(404).send({ message: "Reserve not found" });
  } else {
    const targetRequest = await db.Request.findOne({
      where: { id: Number(targetReserve.request_id) },
    });

    const t = await db.sequelize.transaction();

    try {
      await targetReserve.update({ status: "DELIVERED" }, { transaction: t });
      await targetRequest.update(
        {
          delivered_amount:
            targetRequest.delivered_amount + targetReserve.amount,
          reserve_amount: targetRequest.reserve_amount - targetReserve.amount,
        },
        { transaction: t }
      );

      await t.commit();
      res.status(200).send({ message: "DELIVERED" });
    } catch (err) {
      console.log(err);
      await t.rollback();
      res.status(400).send(err);
    }
  }
};

const deleteReserve = async (req, res) => {
  const reserveId = Number(req.params.id);

  const targetReserve = await db.Reserve.findOne({
    where: { id: reserveId, status: "RESERVE" },
  });

  if (!targetReserve) {
    res.status(404).send({ message: "Reserve not found" });
  } else {
    const targetRequest = await db.Request.findOne({
      where: { id: Number(targetReserve.request_id) },
    });

    const t = await db.sequelize.transaction();

    try {
      await targetReserve.update({ status: "CANCELED" }, { transaction: t });
      await targetRequest.update(
        {
          request_amount: targetRequest.request_amount + targetReserve.amount,
          reserve_amount: targetRequest.reserve_amount - targetReserve.amount,
        },
        { transaction: t }
      );

      await t.commit();
      res.status(200).send({ message: "DELETED" });
    } catch (err) {
      console.log(err);
      await t.rollback();
      res.status(400).send(err);
    }
  }
};

const getReserveAndMakerName = async (req, res) => {
  const reserveAndMakerName = await db.sequelize.query(
    `SELECT  RS.id,RS.amount,RS.createdAt,firstname,phone_no,MS.name,MS.line_id FROM requests RQ INNER JOIN reserves RS ON RQ.id = RS.request_id AND RS.status = "RESERVE" INNER JOIN makers M ON RS.maker_id = M.id INNER JOIN medical_staffs MS ON RQ.medical_staff_id = MS.id
   `,
    { type: QueryTypes.SELECT }
  );

  res.status(200).send(reserveAndMakerName);
};

const deleteReserveForAdmin = async (req, res) => {
  const reserveId = Number(req.params.id);

  const targetReserve = await db.Reserve.findOne({
    where: { id: reserveId, status: "RESERVE" },
  });

  if (!targetReserve) {
    res.status(404).send({ message: "Reserve not found" });
  } else {
    const targetRequest = await db.Request.findOne({
      where: { id: Number(targetReserve.request_id) },
    });

    const t = await db.sequelize.transaction();

    try {
      await targetReserve.update({ status: "CANCELED" }, { transaction: t });
      await targetRequest.update(
        {
          request_amount: targetRequest.request_amount + targetReserve.amount,
          reserve_amount: targetRequest.reserve_amount - targetReserve.amount,
        },
        { transaction: t }
      );

      await t.commit();
      res.status(200).send({ message: "DELETED" });
    } catch (err) {
      console.log(err);
      await t.rollback();
      res.status(400).send(err);
    }
  }
};

module.exports = {
  createNewReserve,
  getAllReservesByMakerIds,
  completedReserve,
  deleteReserve,
  getReserveAndMakerName,
  deleteReserveForAdmin,
};
