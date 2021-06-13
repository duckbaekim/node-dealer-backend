'use strict';
module.exports = (sequelize, DataTypes) => {
	const CD_InicisOrder = sequelize.define('CD_InicisOrder', {
		id : {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		accountId :		DataTypes.INTEGER,
		storeId :		DataTypes.INTEGER,
		P_INI_PAYMENT :		DataTypes.STRING,
		P_GOODS :			DataTypes.STRING,
		P_OID :		DataTypes.STRING,
		P_AMT :		DataTypes.INTEGER,
		P_UNAME :		DataTypes.STRING,
		P_EMAIL :		DataTypes.STRING,
		P_NEXT_URL :		DataTypes.STRING,
		P_NOTI :		DataTypes.STRING,
		P_NOTI_URL :		DataTypes.STRING,
		cancel_yn :		DataTypes.STRING,
		created_at :	DataTypes.DATE,
		updated_at :	DataTypes.DATE,
		deleted_at :	DataTypes.DATE
	}, {
		underscored: false,
		freezeTableName: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at",
		tableName: "CD_InicisOrder"		
	});
	CD_InicisOrder.associate = function(models) {
		// associations can be defined here
	};
	return CD_InicisOrder;
};
