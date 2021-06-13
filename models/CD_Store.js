'use strict';
module.exports = (sequelize, DataTypes) => {
  const CD_Store = sequelize.define('CD_Store', {
    id : {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
    name :			DataTypes.STRING,
    price :			DataTypes.INTEGER,
	desc :			DataTypes.STRING,
	type :			DataTypes.INTEGER,
	normalCount :	DataTypes.INTEGER,
	specialCount :	DataTypes.INTEGER,
	isEnabled :		DataTypes.INTEGER,
	sequence :		DataTypes.INTEGER,
	brandId :		DataTypes.INTEGER,
	useType :		DataTypes.STRING,
	deleted_at :	DataTypes.DATE,
	updated_at :	DataTypes.DATE,
	created_at :	DataTypes.DATE
  }, {
	underscored: false,
    freezeTableName: true,
	createdAt: "created_at",
	updatedAt: "updated_at",
	deletedAT: "deleted_at",
	tableName: "CD_Store"		
  });
  CD_Store.associate = function(models) {
    // associations can be defined here
  };
  return CD_Store;
};
