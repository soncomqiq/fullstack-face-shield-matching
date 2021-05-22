module.exports = (sequelize, DataTypes) => {
  const ProvinceDistrictSubdistrict = sequelize.define(
    "ProvinceDistrictSubdistrict",
    {
      district_id: {
        type: DataTypes.INTEGER,
      },
      sub_district_id: {
        type: DataTypes.INTEGER,
      },
      province: {
        type: DataTypes.STRING,
      },
      district: {
        type: DataTypes.STRING,
      },
      sub_district: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "PDS",
      timestamps: false,
    }
  );

  ProvinceDistrictSubdistrict.associate = (models) => {
    ProvinceDistrictSubdistrict.belongsTo(models.Province, {
      foreignKey: "province_id",
    });
    ProvinceDistrictSubdistrict.hasMany(models.Maker, {
      foreignKey: "pds_id",
    });
    ProvinceDistrictSubdistrict.hasMany(models.Hospital, {
      foreignKey: "pds_id",
    });
  };

  return ProvinceDistrictSubdistrict;
};
