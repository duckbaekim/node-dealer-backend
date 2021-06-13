'use strict';
module.exports = (sequelize, DataTypes) => {
	const CR_CarClassColor = sequelize.define('CR_CarClassColor', {
		id : {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		classId :	DataTypes.INTEGER,	//등급 식별자
		sequence :	DataTypes.INTEGER, //순서
		status :	DataTypes.INTEGER, //보임여부
		isBorder :	DataTypes.INTEGER, //테두리 여부
		rgb :		DataTypes.STRING, //RGB코드
		name :		DataTypes.STRING, //색상명
		img :		DataTypes.STRING, //s3용 첨부파일명
		imageUrl :	DataTypes.STRING, //이미지URL
		price :		DataTypes.INTEGER //유료색상
		
	}, {
		underscored: false,
		freezeTableName: true,
		tableName: "CR_CarClassColor"		
	});
	CR_CarClassColor.associate = function(models) {
		// associations can be defined here
	};
	return CR_CarClassColor;
};
