module.exports = (sequelize, DataTypes) => {
  const School = sequelize.define(
    "School",
    {
      school: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      tableName: "schools",
      timestamps: false,
    }
  );

  School.associate = (models) => {
    School.hasMany(models.Maker, { foreignKey: "school_id" });
  };

  return School;
};
