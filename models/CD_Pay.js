"use strict";
module.exports = (sequelize, DataTypes) => {
  const CD_Pay = sequelize.define(
    "CD_Pay",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      accountId: DataTypes.INTEGER, //
      storeId: DataTypes.INTEGER, //
      billType: DataTypes.STRING,
      payMethod: DataTypes.STRING, //
      productName: DataTypes.STRING, //
      payAmount: DataTypes.STRING, //
      p_oid: DataTypes.STRING, //
      p_tid: DataTypes.STRING, //
      payStatus: DataTypes.STRING, //
      created_at: DataTypes.DATE, //생성일(timestamp)
      updated_at: DataTypes.DATE, //수정일(timestamp)
      deleted_at: DataTypes.DATE, //삭제일(timestamp)
    },
    {
      underscored: false,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "CD_Pay",
    }
  );
  CD_Pay.associate = function (models) {
    // associations can be defined here
  };
  return CD_Pay;
};
