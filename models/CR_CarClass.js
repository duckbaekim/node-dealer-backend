'use strict';
module.exports = (sequelize, DataTypes) => {
	const CR_CarClass = sequelize.define('CR_CarClass', {
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
		brandId :				DataTypes.INTEGER, //브랜드 식별자
		modelId :				DataTypes.INTEGER, //(차량)모델 식별자
		isSell :				DataTypes.INTEGER, //판매여부
		isDefault :				DataTypes.INTEGER, //견적보임여부
		isStock :				DataTypes.INTEGER, //재고여부
		isOptionShowing :		DataTypes.INTEGER, //옵션 보임 여부
		isWriteEnded :			DataTypes.INTEGER, //[작성완료 여부]
		year :					DataTypes.INTEGER, //연식
		price :					DataTypes.INTEGER, //가격(KRW)
		name :					DataTypes.STRING, //등급명
		img :					DataTypes.STRING, //
		imageUrl :				DataTypes.STRING, //
		images :				DataTypes.JSON, //첨부이미지 JSON string
		colors :				DataTypes.JSON, //차량 색상 JSON string
		score :					DataTypes.JSON, //차량 점수 JSON string
		options :				DataTypes.JSON, //차량 옵션 JSON string
		stockStatus :			DataTypes.INTEGER, //
		isRecommend :			DataTypes.INTEGER, //
		dynamicLink :			DataTypes.STRING, //
		tag :					DataTypes.STRING, //
		search :				DataTypes.STRING, //
		carCategory :			DataTypes.INTEGER, //
		carSize :				DataTypes.INTEGER, //
		priceInvisible :		DataTypes.INTEGER, //
		feeId :					DataTypes.INTEGER, //
		HB :					DataTypes.INTEGER, //
		leaseRemainValueGroup :	DataTypes.STRING, //
		rentRemainValueGroup :	DataTypes.STRING, //
		status :				DataTypes.INTEGER, //
		discount :				DataTypes.INTEGER, //
		discountLocal :			DataTypes.INTEGER, //
		
	}, {
		underscored: false,
		freezeTableName: true,
		tableName: "CR_CarClass"		
	});
	CR_CarClass.associate = function(models) {
		// associations can be defined here
	};
	return CR_CarClass;
};
