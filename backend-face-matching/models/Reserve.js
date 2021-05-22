module.exports = (sequelize, DataTypes) => {
  const Reserve = sequelize.define(
    "Reserve",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM("RESERVE", "DELIVERED", "CANCELED"),
      },
    },
    {
      tableName: "reserves",
    }
  );

  return Reserve;
};
