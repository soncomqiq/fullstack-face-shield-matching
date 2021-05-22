const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const checkToken = async (req, res) => {
  res.status(200).send();
};

const registerMaker = async (req, res) => {
  const {
    email,
    first_name,
    last_name,
    line_id,
    nick_name,
    password,
    phone_no,
    pds_id,
    region_id,
  } = req.body;

  const user = await db.Maker.findOne({ where: { username: email } });

  if (user) {
    res.status(400).send({ message: "Username already taken." });
  } else {
    const salt = bcrypt.genSaltSync(Number(process.env.ROUND_SALT));
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
      await db.Maker.create({
        username: email,
        password: hashedPassword,
        firstname: first_name,
        lastname: last_name,
        nick_name: nick_name,
        line_id: line_id,
        phone_no: phone_no,
        pds_id,
        region_id,
      });

      res.status(201).send({ message: "User created." });
    } catch (ex) {
      console.log(ex);
      res.status(500).send();
    }
  }
};

const getPassword = (user) => {
  if (!user) {
    return "wrong_password";
  } else {
    return user.password;
  }
};

const loginMaker = async (req, res) => {
  const { username, password } = req.body;
  const user = await db.Maker.findOne({ where: { username } });
  const userPassword = getPassword(user);
  const isSuccess = bcrypt.compareSync(password, userPassword);

  if (isSuccess && user) {
    const payload = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      region_id: user.region_id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });

    res.status(200).send({ message: "User found & Logged In", token });
  } else {
    res.status(401).send({ message: "Username or password is wrong." });
  }
};

module.exports = { registerMaker, loginMaker, checkToken };
