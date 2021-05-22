module.exports = (sequelize, DataTypes) => {
  const Region = sequelize.define(
    "Region",
    {
      region: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      tableName: "regions",
      timestamps: false,
    }
  );

  Region.associate = (models) => {
    Region.hasMany(models.Maker, { foreignKey: "region_id" });
    Region.hasMany(models.Request, { foreignKey: "region_id" });
  };

  return Region;
};
