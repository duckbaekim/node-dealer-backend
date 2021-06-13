'use strict';
module.exports = (sequelize, DataTypes) => {
	const CD_InicisCancel = sequelize.define('CD_InicisCancel', {
		id : {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		orderId :			DataTypes.INTEGER,
		type :				DataTypes.STRING,
		paymethod :			DataTypes.STRING,
		timestamp :			DataTypes.DATE,
		clientIp :			DataTypes.STRING,
		mid :				DataTypes.STRING,
		tid :				DataTypes.STRING,
		msg :				DataTypes.STRING,
		price :				DataTypes.STRING,
		confirmPrice :		DataTypes.STRING,
		currency :			DataTypes.STRING,
		refundAcctNum :		DataTypes.STRING,
		refundAcctName :	DataTypes.STRING,
		created_at :		DataTypes.DATE,
		updated_at :		DataTypes.DATE,
		deleted_at :		DataTypes.DATE
	}, {
		underscored: false,
		freezeTableName: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at",
		tableName: "CD_InicisCancel"		
	});
	CD_InicisCancel.associate = function(models) {
		// associations can be defined here
	};
	return CD_InicisCancel;
};
