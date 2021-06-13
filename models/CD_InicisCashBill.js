'use strict';
module.exports = (sequelize, DataTypes) => {
	const CD_InicisCashBill = sequelize.define('CD_InicisCashBill', {
		id : {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		inicisResultId :	DataTypes.INTEGER,
		P_CSHR_CODE :		DataTypes.STRING,
		P_CSHR_MSG :		DataTypes.STRING,
		P_CSHR_AMT :		DataTypes.STRING,
		P_CSHR_SUP_AMT :	DataTypes.STRING,
		P_CSHR_TAX :		DataTypes.STRING,
		P_CSHR_SRVC_AMT :	DataTypes.STRING,
		P_CSHR_TYPE :		DataTypes.STRING,
		P_CSHR_DT :			DataTypes.STRING,
		P_CSHR_AUTH_NO :	DataTypes.STRING,
		created_at :		DataTypes.DATE,
		updated_at :		DataTypes.DATE,
		deleted_at :		DataTypes.DATE
	}, {
		underscored: false,
		freezeTableName: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at",
		tableName: "CD_InicisCashBill"		
	});
	CD_InicisCashBill.associate = function(models) {
		// associations can be defined here
	};
	return CD_InicisCashBill;
};
