module.exports = (sequelize, DataTypes) => {
  const CareerType = sequelize.define(
    "CareerType",
    {
      career_type: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      tableName: "career_types",
      timestamps: false,
    }
  );

  CareerType.associate = (models) => {
    CareerType.hasMany(models.Maker, { foreignKey: "career_type_id" });
  };

  return CareerType;
};
