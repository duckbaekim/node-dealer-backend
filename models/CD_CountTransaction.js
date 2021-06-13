'use strict';
module.exports = (sequelize, DataTypes) => {
	const CD_CountTransaction = sequelize.define('CD_CountTransaction', {
		id : {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		accountId :		DataTypes.INTEGER,
		normalCount :	DataTypes.INTEGER,
		specialCount :	DataTypes.INTEGER,
		created_at :	DataTypes.DATE,
		updated_at :	DataTypes.DATE,
		deleted_at :	DataTypes.DATE,
		type :			DataTypes.INTEGER,
		desc :			DataTypes.STRING,
		relationId :	DataTypes.INTEGER,
		isEnabled :		DataTypes.INTEGER
	}, {
		underscored: false,
		freezeTableName: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		tableName: "CD_CountTransaction"		
	});
	CD_CountTransaction.associate = function(models) {
		// associations can be defined here
	};
	return CD_CountTransaction;
};
