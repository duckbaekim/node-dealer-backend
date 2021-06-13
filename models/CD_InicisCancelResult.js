'use strict';
module.exports = (sequelize, DataTypes) => {
	const CD_InicisCancelResult = sequelize.define('CD_InicisCancelResult', {
		id : {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		orderId :		DataTypes.INTEGER,
		cancelId :		DataTypes.INTEGER,
		type :			DataTypes.STRING,
		paymethod :		DataTypes.STRING,
		resultCode :	DataTypes.STRING,
		resultMsg :		DataTypes.STRING,
		prtcTid :		DataTypes.STRING,
		tid :			DataTypes.STRING,
		prtcPrice :		DataTypes.INTEGER,
		prtcRemains :	DataTypes.INTEGER,
		prtcCnt :		DataTypes.INTEGER,
		cancelDate :	DataTypes.STRING,
		cancelTime :	DataTypes.STRING,
		cancelYN :		DataTypes.STRING,
		created_at :	DataTypes.DATE,
		updated_at :	DataTypes.DATE,
		deleted_at :	DataTypes.DATE
	}, {
		underscored: false,
		freezeTableName: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at",
		tableName: "CD_InicisCancelResult"		
	});
	CD_InicisCancelResult.associate = function(models) {
		// associations can be defined here
	};
	return CD_InicisCancelResult;
};
