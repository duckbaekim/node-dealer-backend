'use strict';
module.exports = (sequelize, DataTypes) => {
	const CD_InicisCert = sequelize.define('CD_InicisCert', {
		id : {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		orderId :		DataTypes.INTEGER,
		P_STATUS :		DataTypes.STRING,
		P_RMESG1 :		DataTypes.STRING,
		P_TID :			DataTypes.STRING,
		P_REQ_URL :		DataTypes.STRING,
		P_NOTI :		DataTypes.STRING,
		created_at :	DataTypes.DATE,
		updated_at :	DataTypes.DATE,
		deleted_at :	DataTypes.DATE
	}, {
		underscored: false,
		freezeTableName: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at",
		tableName: "CD_InicisCert"		
	});
	CD_InicisCert.associate = function(models) {
		// associations can be defined here
	};
	return CD_InicisCert;
};
