'use strict';
module.exports = (sequelize, DataTypes) => {
  const CD_Cert = sequelize.define('CD_Cert', {
    id : {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	certCode :		DataTypes.INTEGER,
    contact :		DataTypes.STRING,
    deleted_at :	DataTypes.DATE,
	updated_at :	DataTypes.DATE,
	isCert :		DataTypes.INTEGER,
	created_at :	DataTypes.DATE,
	contact_hash :	DataTypes.STRING
  }, {
	underscored: false,
    freezeTableName: true,
	createdAt: "created_at",
	updatedAt: "updated_at",
	tableName: "CD_Cert"		
  });
  CD_Cert.associate = function(models) {
    // associations can be defined here
  };
  return CD_Cert;
};
