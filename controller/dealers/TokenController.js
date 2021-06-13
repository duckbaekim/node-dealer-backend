//이거 안씀.

var models = require("../../models");
const jwt = require('jsonwebtoken');

let tokenData = async (req, res) => {
	try {
		if(req.headers.authorization){
			const secret = req.app.get('jwt-secret');

			const clientToken = (req.headers.authorization).replace('Bearer ', '');
			const decoded = jwt.verify(clientToken, secret);

			const tokenUserData = await models.CD_Account.findOne({
				attributes: [
					"id",
					"email",
					"password",
					"enabled",
					"contact",
					"brand",
					"subscription",
					"created_at",
					"updated_at",
					"deleted_at",
					"businessCard",
					"contact_hash",
					"companyName",
					"position",
					"fcmKey",
					"name",
					"normalCount",
					"specialCount",
					"os",
					"freeEnable",
					"freeRegDate",
					"pushEnable",
					"freePass"
				],
				where: { 'email': decoded.email }
			});
			return tokenUserData.dataValues;
			//console.log(tokenUserData.dataValues);
		}else{
			return false;
		}

		
	} catch (err) {
		console.log(err );
	}
}

module.exports = {
	tokenData: tokenData
};


/*
		const dataList = await models.CR_DirectEstimateRequest.findAll({
			
			attributes: [
				//"CR_DirectEstimateRequest.id",
				//"CR_DirectEstimateRequest.paymentMethod",
				//"CR_DirectEstimateRequest.isRead",
				//"CR_DirectEstimateRequest.isFinish",
				//"CR_CarModel.name as modelName",
				//"CR_CarClass.name as className",
				//"CR_CarBrand.name as brandName",
				//"CR_DirectEstimateRequest.limit",
				//"CR_DirectEstimateRequest.created_at",
				//"CR_DirectEstimateRequest.residence",
				//"CR_DirectEstimateRequest.remain",
				//"CR_CarClassColor.imageUrl"
				"CR_DirectEstimateRequest.residence"
			],
			/*
			include:[
				{
					model: models.CR_CarModel,// as: 'b',
					where:{
						'CR_DirectEstimateRequest.modelId': models.CR_CarModel.id
					},
					required: true
				},
				{
					model: models.CR_CarClass,// as: 'c',
					where:{
						'CR_DirectEstimateRequest.classId': models.CR_CarClass.id
					},
					required: true
				},
				{
					model: models.CR_CarClassColor,// as: 'd',
					where:{
						'CR_DirectEstimateRequest.colorId': models.CR_CarClassColor.id
					},
					required: true
				},
				{
					model: models.CR_CarBrand,// as: 'e',
					where:{
						'CR_DirectEstimateRequest.brandId': models.CR_CarBrand.id
					},
					required: true
				}
			],
			
			where: {
				//[Op.gte]: [{'CR_DirectEstimateRequest.created_at': searchMonth}],
				//[{'CR_DirectEstimateRequest.classId': whereInClass}]
				//whereInModel ? [{'CR_DirectEstimateRequest.classId': whereInModel}] : null,
				//whereInBrand ? [{'CR_DirectEstimateRequest.classId': whereInBrand}] : null,
				//whereInPaymentType ? [{'CR_DirectEstimateRequest.classId': whereInPaymentType}] : null,
				//whereInRegion ? [{'CR_DirectEstimateRequest.classId': whereInRegion}] : null
				
			},
			order: [
				//['CR_DirectEstimateRequest.id', 'desc']
				['id', 'desc']
			],
			limit: limitCnt
			
		});
		
		res.json(dataList);
		*/
		
//		res.json(params);