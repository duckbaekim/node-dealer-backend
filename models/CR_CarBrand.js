'use strict';
module.exports = (sequelize, DataTypes) => {
	const CR_CarBrand = sequelize.define('CR_CarBrand', {
		id : {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		created_at :			DataTypes.DATE,	//생성일(timestamp)
		updated_at :			DataTypes.DATE, //수정일(timestamp)
		deleted_at :			DataTypes.DATE, //삭제일(timestamp)
		created :				DataTypes.STRING, //생성일
		updated :				DataTypes.STRING, //수정일
		sequence :				DataTypes.INTEGER, //(브랜드 내)순서
		isSell :				DataTypes.INTEGER, //판매여부
		isDefault :				DataTypes.INTEGER, //보임여부
		madeIn :				DataTypes.INTEGER, //제조국가
		name :					DataTypes.STRING, //브랜드명
		sameImg :				DataTypes.STRING, //같은 사이즈 이미지
		diffImg :				DataTypes.STRING, //다른 사이즈 이미지
		sameSizeImageUrl :		DataTypes.STRING, //같은 사이즈 이미지 URL
		differentSizeImageUrl :	DataTypes.STRING, //다른 사이즈 이미지 URL
		tag:					DataTypes.STRING //
		
	}, {
		underscored: false,
		freezeTableName: true,
		tableName: "CR_CarBrand"		
	});
	CR_CarBrand.associate = function(models) {
		// associations can be defined here
	};
	return CR_CarBrand;
};
