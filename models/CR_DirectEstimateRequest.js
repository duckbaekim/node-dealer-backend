'use strict';
module.exports = (sequelize, DataTypes) => {
	const CR_DirectEstimateRequest = sequelize.define('CR_DirectEstimateRequest', {
		id : {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		created_at :		DataTypes.DATE,
		updated_at :		DataTypes.DATE,
		deleted_at :		DataTypes.DATE,
		created :			DataTypes.STRING,
		//updated :			DataTypes.STRING,
		isRead :			DataTypes.INTEGER, //읽음여부
		accountId :			DataTypes.INTEGER, //(FK)신청회원
		brandId :			DataTypes.INTEGER, //브랜드id
		modelId :			DataTypes.INTEGER, //모델id
		classId :			DataTypes.INTEGER, //등급id
		colorId :			DataTypes.INTEGER, //색상id
		paymentMethod :		DataTypes.STRING, //결제방식
		discount :			DataTypes.STRING, //추가할인
		paymentType :		DataTypes.STRING, //선납보증/선납/보증
		takeOver :			DataTypes.STRING, //인수반납 여부
		buyerType :			DataTypes.STRING, //구매자 타입
		months :			DataTypes.INTEGER, //할부 개월
		optionPrice :		DataTypes.INTEGER, //옵션가액
		carPrice :			DataTypes.INTEGER, //차량가격
		deposit :			DataTypes.INTEGER, //보증금
		depositPercent :	DataTypes.FLOAT, //보긍금%
		prepayment :		DataTypes.INTEGER, //선납금
		prepaymentPercent :	DataTypes.FLOAT, //선납금%
		residualValue :		DataTypes.INTEGER, //잔존가치
		residualValuePercent : DataTypes.FLOAT, //잔존가치%
		residence :			DataTypes.STRING, //지역
		age :				DataTypes.INTEGER, //(렌트) 보험 연령 (21/26 only)
		maintenance :		DataTypes.STRING, //(렌트) 정비상품 포함여부
		selectedOptions :	DataTypes.JSON, //선택한 옵션 목록
		isFinish :			DataTypes.INTEGER, //
		limit :				DataTypes.INTEGER, //
		remain :			DataTypes.INTEGER //
	}, {
		underscored: false,
		freezeTableName: true,
		updatedAt: "updated_at",
		tableName: "CR_DirectEstimateRequest"		
	});
	CR_DirectEstimateRequest.associate = function(models) {
		// associations can be defined here
	};
	return CR_DirectEstimateRequest;
};
