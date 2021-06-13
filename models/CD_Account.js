'use strict';
module.exports = (sequelize, DataTypes) => {
	const CD_Account = sequelize.define('CD_Account', {
		id : {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		email :			DataTypes.STRING,
		password :		DataTypes.STRING,
		enabled :		DataTypes.INTEGER,
		contact :		DataTypes.STRING,
		brand :			DataTypes.JSON,
		subscription :	DataTypes.JSON,
		created_at :	DataTypes.DATE,
		updated_at :	DataTypes.DATE,
		deleted_at :	DataTypes.DATE,
		businessCard :	DataTypes.STRING,
		contact_hash :	DataTypes.STRING,
		companyName :	DataTypes.STRING,
		position :		DataTypes.STRING,
		fcmKey :		DataTypes.STRING,
		name :			DataTypes.STRING,
		normalCount :	DataTypes.INTEGER,
		specialCount :	DataTypes.INTEGER,
		os :			DataTypes.STRING,
		deleteList :	DataTypes.STRING,
		freeEnable :	DataTypes.INTEGER,
		freeRegDate :	DataTypes.DATE,
		loginEnable :	DataTypes.INTEGER,
		pushEnable :	DataTypes.INTEGER,
		blackEnable :	DataTypes.INTEGER,
		freePass :		DataTypes.DATE,
		device_id :	DataTypes.STRING,
		isAdminYN :	DataTypes.STRING
	}, {
		underscored: false,
		freezeTableName: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		tableName: "CD_Account"		
	});
	CD_Account.associate = function(models) {
		// associations can be defined here
	};
	return CD_Account;
};
