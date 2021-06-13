var models = require("../../models");
const jwt = require("jsonwebtoken");
var moment = require("moment");
//const YOUR_SECRET_KEY = process.env.SECRET_KEY;
//require('dotenv').config({path: '../../.env'});
const _leftDayCount = (dueto) => {
  const t1 = moment(dueto, "YYYY-MM-DD");
  const t2 = moment();
  // console.log(t1);
  // console.log(t2);
  //const leftDay = moment.duration(t1.diff(t2)).days();
  const leftDay = t1.diff(t2, "days");
  // console.log(leftDay);
  return leftDay;
};
const verifyToken = async (req, res, next) => {
  try {
    const secret = req.app.get("jwt-secret");
    const clientToken = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(clientToken, secret, {
      ignoreExpiration: false, //handled by OAuth2 server implementation
      ignoreNotBefore: true,
    });
    if (decoded) {
      /*
			res.locals.email		= decoded.email;
			res.locals.companyName	= decoded.companyName;
			res.locals.name			= decoded.name;
			res.locals.brand		= decoded.brand;
			res.locals.normalCount	= decoded.normalCount;
			res.locals.specialCount = decoded.specialCount;
			*/

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
          "deleteList",
          "freeEnable",
          "freeRegDate",
          "pushEnable",
          "freePass",
        ],
        where: { email: decoded.email },
      });

      //console.log(tokenUserData.dataValues.email);
      res.app.set("tokenId", tokenUserData.dataValues.id);
      res.app.set("tokenEmail", decoded.email);
      res.app.set("tokenContact", tokenUserData.dataValues.contact);
      res.app.set("tokenCompanyName", tokenUserData.dataValues.companyName);
      res.app.set("tokenName", tokenUserData.dataValues.name);
      res.app.set("tokenBrand", tokenUserData.dataValues.brand);
      res.app.set("tokenNormalCount", tokenUserData.dataValues.normalCount);
      res.app.set("tokenSpecialCount", tokenUserData.dataValues.specialCount);
      res.app.set("tokenDeleteList", tokenUserData.dataValues.deleteList);

      //exp time
      var expTime = new Date(decoded.exp * 1000);

      //프리패스(정기권) 체크
      //현재시간
      var currentTime = new Date();
      //정기권 시간
      //정기권 freepass 가 null 일시 false
      if (tokenUserData.dataValues.freePass == null) {
        res.app.set("tokenFreePassCard", false);
        console.log("tokenFreePassCard is false");
      } else {
        const leftDay = _leftDayCount(tokenUserData.dataValues.freePass);
        console.log(`leftDay : ${leftDay + 1}`);

        if (leftDay + 1 <= 0) {
          res.app.set("tokenFreePassCard", false);
          console.log("tokenFreePassCard is false");
        } else {
          res.app.set("tokenFreePassCard", true);
          res.app.set("tokenFreePass", tokenUserData.dataValues.freePass);
          console.log("tokenFreePassCard is true");
        }
      }

      //만료시간 체크
      /*
			console.log(expTime);
			console.log(currentTime);
			if(expTime < currentTime){
				res.status(401).json({ 
					message : 'token error',
					error: {
						"name": "TokenExpiredError",
						"message": "jwt expired",
						"expiredAt": expTime
					}
				});
			}else{
				next();
			}
			*/

      next();

      //var defaultUserData = {
      //	'pushEnable': tokenUserData.dataValues.pushEnable,
      //	'freePass': tokenUserData.dataValues.freePass,
      //	'freeEnable': false,
      //	'issueFreePass': false,
      //	'promotion': 0
      //};

      //console.log(defaultUserData);
      //res.app.set('defaultUserData', defaultUserData);
    } else {
      res.status(401).json({ error: "unauthorized" });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "token error",
      error: err,
    });
  }
};
exports.verifyToken = verifyToken;
