'use strict';
module.exports = (sequelize, DataTypes) => {
	const CD_InicisResult = sequelize.define('CD_InicisResult', {
		id : {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		orderId :				DataTypes.INTEGER,
		P_STATUS :				DataTypes.STRING,
		P_RMESG1 :				DataTypes.STRING,
		P_TID :					DataTypes.STRING,
		P_TYPE :				DataTypes.STRING,
		P_AUTH_DT :				DataTypes.DATE,
		P_MID :					DataTypes.STRING,
		P_OID :					DataTypes.STRING,
		P_AMT :					DataTypes.STRING,
		P_UNAME :				DataTypes.STRING,
		P_MNAME :				DataTypes.STRING,
		P_NOTI :				DataTypes.STRING,
		P_NOTEURL :				DataTypes.STRING,
		P_NEXT_URL :			DataTypes.STRING,
		P_CARD_ISSUER_CODE :	DataTypes.STRING,
		P_CARD_MEMBER_NUM :		DataTypes.STRING,
		P_CARD_PURCHASE_CODE :	DataTypes.STRING,
		P_CARD_PRTC_CODE :		DataTypes.STRING,
		P_CARD_INTEREST :		DataTypes.STRING,
		P_CARD_CHECKFLAG :		DataTypes.STRING,
		P_RMESG2 :				DataTypes.STRING,
		P_AUTH_NO :				DataTypes.STRING,
		P_ISP_CARDCODE :		DataTypes.STRING,
		P_SRC_CODE :			DataTypes.STRING,
		P_FN_CD1 :				DataTypes.STRING,
		P_FN_NM :				DataTypes.STRING,
		P_HPP_CORP :			DataTypes.STRING,
		P_HPP_NUM :				DataTypes.STRING,
		P_VACT_NUM :			DataTypes.STRING,
		P_VACT_DATE :			DataTypes.STRING,
		P_VACT_TIME :			DataTypes.STRING,
		P_VACT_NAME :			DataTypes.STRING,
		P_VACT_BANK_CODE :		DataTypes.STRING,
		created_at :			DataTypes.DATE,
		updated_at :			DataTypes.DATE,
		deleted_at :			DataTypes.DATE
	}, {
		underscored: false,
		freezeTableName: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at",
		tableName: "CD_InicisResult"		
	});
	CD_InicisResult.associate = function(models) {
		// associations can be defined here
	};
	return CD_InicisResult;
};
