'use strict';
module.exports = (sequelize, DataTypes) => {
	const CD_InicisRegularResult = sequelize.define('CD_InicisRegularResult', {
		id : {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		accountId :		DataTypes.INTEGER,
		storeId :		DataTypes.INTEGER,
		orderid :		DataTypes.STRING,
		resultcode :	DataTypes.STRING,
		resultmsg :		DataTypes.STRING,
		payAuthCode :	DataTypes.STRING,
		payDate :		DataTypes.STRING,
		payTime :		DataTypes.STRING,
		tid :			DataTypes.STRING,
		prtcCode :		DataTypes.STRING,
		price :			DataTypes.INTEGER,
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
		tableName: "CD_InicisRegularResult"		
	});
	CD_InicisRegularResult.associate = function(models) {
		// associations can be defined here
	};
	return CD_InicisRegularResult;
};
