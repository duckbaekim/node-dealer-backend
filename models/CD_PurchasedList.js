'use strict';
module.exports = (sequelize, DataTypes) => {
	const CD_PurchasedList = sequelize.define('CD_PurchasedList', {
		id : {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		accountId:		DataTypes.INTEGER, //
		estimateId:		DataTypes.INTEGER, //
		transactionId:	DataTypes.INTEGER, //
		created_at :	DataTypes.DATE,	//생성일(timestamp)
		updated_at :	DataTypes.DATE, //수정일(timestamp)
		deleted_at :	DataTypes.DATE, //삭제일(timestamp)
		memo :			DataTypes.STRING, //삭제일(timestamp)		
		isContacted:	DataTypes.INTEGER //
		
	}, {
		underscored: false,
		freezeTableName: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		tableName: "CD_PurchasedList"		
	});
	CD_PurchasedList.associate = function(models) {
		// associations can be defined here
	};
	return CD_PurchasedList;
};
