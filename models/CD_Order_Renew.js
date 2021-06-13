"use strict";
module.exports = (sequelize, DataTypes) => {
  const CD_Order_Renew = sequelize.define(
    "CD_Order_Renew",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      accountId: DataTypes.INTEGER, //
      storeId: DataTypes.INTEGER, //
      storeType: DataTypes.INTEGER, //
      typeId: DataTypes.INTEGER, //
      billType: DataTypes.STRING, //
      payMethod: DataTypes.STRING, //
      productName: DataTypes.STRING, //
      payAmount: DataTypes.INTEGER, //
      p_oid: DataTypes.STRING, //
      p_tid: DataTypes.STRING, //
      vbank_date: DataTypes.STRING, //
      validate: DataTypes.JSON,
      validateReturnData: DataTypes.STRING,
      validateReturnMsg: DataTypes.STRING,
      validate_at: DataTypes.DATE,
      resultReturnData: DataTypes.JSON,
      resultReturnCode: DataTypes.STRING,
      resultReturnMsg: DataTypes.STRING,
      result_at: DataTypes.DATE,
      created_at: DataTypes.DATE, //생성일(timestamp)
      updated_at: DataTypes.DATE, //수성일(timestamp)
      deleted_at: DataTypes.DATE, //삭제일(timestamp)
    },
    {
      underscored: false,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      tableName: "CD_Order_Renew",
    }
  );
  CD_Order_Renew.associate = function (models) {
    // associations can be defined here
  };
  return CD_Order_Renew;
};
