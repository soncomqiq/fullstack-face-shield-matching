module.exports = (sequelize, DataTypes) => {
  const Hospital = sequelize.define(
    "Hospital",
    {
      hospital: {
        type: DataTypes.STRING,
      },
      isAccept: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "hospitals",
      timestamps: false,
    }
  );

  Hospital.associate = (models) => {
    Hospital.hasMany(models.MedicalStaff, { foreignKey: "hospital_id" });
    Hospital.belongsTo(models.ProvinceDistrictSubdistrict, {
      foreignKey: "pds_id",
    });
  };

  return Hospital;
};
