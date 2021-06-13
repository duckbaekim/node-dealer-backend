'use strict';
module.exports = (sequelize, DataTypes) => {
	const CD_InicisRegularOrder = sequelize.define('CD_InicisRegularOrder', {
		id : {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		accountId :	DataTypes.INTEGER,
		storeId :	DataTypes.INTEGER,
		buyername :	DataTypes.STRING,
		goodname :	DataTypes.STRING,
		price :		DataTypes.INTEGER,
		orderid :	DataTypes.STRING,
		period :	DataTypes.STRING,
		subscriber :	DataTypes.STRING,	
		created_at :	DataTypes.DATE,
		updated_at :	DataTypes.DATE,
		deleted_at :	DataTypes.DATE
	}, {
		underscored: false,
		freezeTableName: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at",
		tableName: "CD_InicisRegularOrder"		
	});
	CD_InicisRegularOrder.associate = function(models) {
		// associations can be defined here
	};
	return CD_InicisRegularOrder;
};
