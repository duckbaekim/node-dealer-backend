'use strict';
module.exports = (sequelize, DataTypes) => {
	const CD_InicisPayment = sequelize.define('CD_InicisPayment', {
		id : {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name :			DataTypes.STRING,
		code :			DataTypes.STRING,
		created_at :	DataTypes.DATE,
		updated_at :	DataTypes.DATE,
		deleted_at :	DataTypes.DATE
	}, {
		underscored: false,
		freezeTableName: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at",
		tableName: "CD_InicisPayment"		
	});
	CD_InicisPayment.associate = function(models) {
		// associations can be defined here
	};
	return CD_InicisPayment;
};
