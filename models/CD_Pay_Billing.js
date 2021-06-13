"use strict";
module.exports = (sequelize, DataTypes) => {
  const CD_Pay_Billing = sequelize.define(
    "CD_Pay_Billing",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      accountId: DataTypes.INTEGER, //
      storeId: DataTypes.INTEGER, //
      status: DataTypes.STRING,
      continueBilling: DataTypes.INTEGER, //
      retry: DataTypes.INTEGER, //
      nextpay_at: DataTypes.DATE, //
      billkey: DataTypes.STRING,
      authkey: DataTypes.STRING,
      payAmount: DataTypes.INTEGER, //
      created_at: DataTypes.DATE, //생성일(timestamp)
      updated_at: DataTypes.DATE, //수정일(timestamp)
      deleted_at: DataTypes.DATE, //삭제일(timestamp)
    },
    {
      underscored: false,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "CD_Pay_Billing",
    }
  );
  CD_Pay_Billing.associate = function (models) {
    // associations can be defined here
  };
  return CD_Pay_Billing;
};
