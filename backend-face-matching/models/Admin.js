module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define("Admin", {
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  });

  return Admin;
};
