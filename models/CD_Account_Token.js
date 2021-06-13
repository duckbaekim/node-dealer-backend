'use strict';
module.exports = (sequelize, DataTypes) => {
  const CD_Account_Token = sequelize.define('CD_Account_Token', {
    id : {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	email :				DataTypes.STRING,
    token :				DataTypes.STRING,
    refresh_token :		DataTypes.STRING,
	created_at :		DataTypes.DATE,
	updated_at :		DataTypes.DATE
  }, {
	underscored: false,
    freezeTableName: true,
	createdAt: "created_at",
	updatedAt: "updated_at",
	tableName: "CD_Account_Token"		
  });
  CD_Account_Token.associate = function(models) {
    // associations can be defined here
  };
  return CD_Account_Token;
};
