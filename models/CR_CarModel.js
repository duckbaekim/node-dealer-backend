'use strict';
module.exports = (sequelize, DataTypes) => {
	const CR_CarModel = sequelize.define('CR_CarModel', {
		id : {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		created_at :	DataTypes.DATE,	//생성일(timestamp)
		updated_at :	DataTypes.DATE, //수정일(timestamp)
		deleted_at :	DataTypes.DATE, //삭제일(timestamp)
		created :		DataTypes.STRING, //생성일
		updated :		DataTypes.STRING, //수정일
		sequence :		DataTypes.INTEGER, //(브랜드 내)순서
		brandId :		DataTypes.INTEGER, //브랜드 식별자
		priceMin :		DataTypes.INTEGER, //최소 금액 (등급중)
		priceMax :		DataTypes.INTEGER, //최고 금액 (등급중)
		isSell :		DataTypes.INTEGER, //판매여부
		isDefault :		DataTypes.INTEGER, //보임여부
		name :			DataTypes.STRING, //모델명
		img :			DataTypes.STRING, //이미지
		imageUrl :		DataTypes.STRING, //이미지 URL
		tag :			DataTypes.STRING //
		
	}, {
		underscored: false,
		freezeTableName: true,
		tableName: "CR_CarModel"		
	});
	CR_CarModel.associate = function(models) {
		// associations can be defined here
	};
	return CR_CarModel;
};
