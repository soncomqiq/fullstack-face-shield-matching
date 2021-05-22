module.exports = (sequelize, DataTypes) => {
  const Province = sequelize.define(
    "Province",
    {
      province: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "provinces",
      timestamps: false,
    }
  );

  Province.associate = (models) => {
    Province.belongsTo(models.Region, {
      foreignKey: "region_id",
    });
    Province.hasMany(models.ProvinceDistrictSubdistrict, {
      foreignKey: "province_id",
    });
  };

  return Province;
};
