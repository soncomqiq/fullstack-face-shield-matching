const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, password } = req.body;

  const admin = await db.Admin.findOne({ where: { username } });

  if (admin) {
    res.status(400).send({ message: "username is already use" });
  } else {
    let salt = bcrypt.genSaltSync(Number(process.env.ROUND_SALT));

    let hashedPassword = bcrypt.hashSync(password, salt);

    await db.Admin.create({ username, password: hashedPassword });

    res.status(201).send({ message: "user create successfully" });
  }
};
const getPassword = (username) => {
  if (!username) {
    return "fake_password";
  } else {
    return username.password;
  }
};
const login = async (req, res) => {
  const { username, password } = req.body;

  const admin = await db.Admin.findOne({ where: { username } });
  isSuccess = bcrypt.compareSync(password, getPassword(admin));

  if (admin && isSuccess) {
    const payload = {
      id: admin.id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_FOR_ADMIN, {
      expiresIn: "1h",
    });
    console.log("pass 201");

    res.status(201).send(token);
  } else {
    console.log("pass 400");
    res.status(400).send({ message: "username or password is wrong" });
  }
};

const checkToken = async (req, res) => {
  res.status(201).send();
};

module.exports = { register, login, checkToken };
