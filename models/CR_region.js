'use strict';
module.exports = (sequelize, DataTypes) => {
	const CR_region = sequelize.define('CR_region', {
		id : {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		created_at :	DataTypes.DATE,	//생성일(timestamp)
		updated_at :	DataTypes.DATE, //수정일(timestamp)
		region_name :	DataTypes.STRING, //지역 이름
		parent_id :		DataTypes.STRING, //부모 아이디
		parent_name :	DataTypes.INTEGER //부모 이름
		
	}, {
		underscored: false,
		freezeTableName: true,
		tableName: "CR_region"		
	});
	CR_region.associate = function(models) {
		// associations can be defined here
	};
	return CR_region;
};
