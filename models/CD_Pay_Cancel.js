"use strict";
module.exports = (sequelize, DataTypes) => {
  const CD_Pay_RequestCancel = sequelize.define(
    "CD_Pay_RequestCancel",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      accountId: DataTypes.INTEGER, //
      payId: DataTypes.INTEGER, //
      cancelId: DataTypes.INTEGER,
      created_at: DataTypes.DATE, //생성일(timestamp)
      updated_at: DataTypes.DATE, //수정일(timestamp)
      deleted_at: DataTypes.DATE, //삭제일(timestamp)
    },
    {
      underscored: false,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "CD_Pay_RequestCancel",
    }
  );
  CD_Pay_RequestCancel.associate = function (models) {
    // associations can be defined here
  };
  return CD_Pay_RequestCancel;
};
