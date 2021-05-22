module.exports = (sequelize, DataTypes) => {
  const GraduateLevel = sequelize.define(
    "GraduateLevel",
    {
      graduate: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      tableName: "graduate_level",
      timestamps: false,
    }
  );

  GraduateLevel.associate = (models) => {
    GraduateLevel.hasMany(models.Maker, { foreignKey: "graduate_level_id" });
  };

  return GraduateLevel;
};
