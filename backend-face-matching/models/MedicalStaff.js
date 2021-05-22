module.exports = (sequelize, DataTypes) => {
  const MedicalStaff = sequelize.define(
    "MedicalStaff",
    {
      name: {
        type: DataTypes.STRING,
      },
      line_id: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "medical_staffs",
    }
  );

  MedicalStaff.associate = (models) => {
    MedicalStaff.belongsTo(models.Hospital, { foreignKey: "hospital_id" });
    MedicalStaff.belongsTo(models.Department, { foreignKey: "department_id" });
    MedicalStaff.hasOne(models.Request, { foreignKey: "medical_staff_id" });
  };

  return MedicalStaff;
};
