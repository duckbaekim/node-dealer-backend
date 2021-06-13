'use strict';
module.exports = (sequelize, DataTypes) => {
	const CD_Order = sequelize.define('CD_Order', {
		id : {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		accountId:				DataTypes.INTEGER, //
		status:					DataTypes.INTEGER, //
		price:					DataTypes.INTEGER, //
		pg :					DataTypes.STRING,	//
		pgId :					DataTypes.STRING, //
		point :					DataTypes.INTEGER, //
		created_at :			DataTypes.DATE, //생성일(timestamp)
		updated_at :			DataTypes.DATE, //수성일(timestamp)
		deleted_at :			DataTypes.DATE, //삭제일(timestamp)
		name:					DataTypes.STRING, //
		postCode:				DataTypes.STRING, //
		address:				DataTypes.STRING, //
		addressDetail:			DataTypes.STRING, //
		phone:					DataTypes.STRING, //
		payMethod:				DataTypes.STRING, //
		vbank_date:				DataTypes.STRING, //
		orderName:				DataTypes.STRING, //
		orderResult:			DataTypes.STRING, //
		paid_at:				DataTypes.INTEGER, //
		orderValidate:			DataTypes.STRING, //
		impId:					DataTypes.STRING, //
		orderCancelResponse:	DataTypes.STRING, //
		vbank_name:				DataTypes.STRING, //
		vbank_num:				DataTypes.STRING, //
		vbank_code:				DataTypes.STRING, //
		storeId:				DataTypes.INTEGER, //
		cancel_yn :				DataTypes.STRING
	}, {
		underscored: false,
		freezeTableName: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at",
		tableName: "CD_Order"		
	});
	CD_Order.associate = function(models) {
		// associations can be defined here
	};
	return CD_Order;
};
