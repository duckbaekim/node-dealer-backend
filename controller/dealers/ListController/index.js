const path = require("path");
var models = require(path.join(__dirname, "../../../models"));
var common = require(path.join(__dirname, "../../Common"));
var sha256 = require("sha256");
var crypto = require("crypto");
const jwt = require("jsonwebtoken");
const dateTime = require("node-datetime");
var moment = require("moment");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const _freePass = require(path.join(__dirname, "./_freePass"));
const _normalCount = require(path.join(__dirname, "./_normalCount"));

let listNew = async (req, res) => {
  //console.log(req.app.get('tokenEmail'));
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  try {
    var limitCnt = 20;
    //뷰에서 send 데이터가 params 이다.
    var request = req.body;
    var offset = request.offset;
    var reqBrand = request.brand;
    var reqPaymentType = request.paymentType;
    var reqRegion = request.region;
    var reqMode = request.mode;
    var whereInClass = null;
    var whereInModel = null;
    var whereInBrand = null;
    var whereInPaymentType = null;
    var whereInRegion = null;
    var whereInOffset = null;

    //로그인을 체크하여 추가적으로 검색을 한다.
    //회원 로그인을 체크하여 로직 추가
    if (req.app.get("tokenEmail")) {
      whereInBrand = req.app.get("tokenBrand");
    }

    //if(reqClass > 0){
    //	whereInClass = reqClass;
    //}
    //if(reqModel > 0){
    //	whereInModel = reqModel;
    //}
    if (reqBrand > 0) {
      whereInBrand = reqBrand;
    }
    if (reqPaymentType > 0) {
      whereInPaymentType = reqPaymentType;
    }
    if (reqRegion > 0) {
      whereInRegion = reqRegion;
    }

    var now = moment().format("YYYY-MM-DD");
    var searchMonth = moment(now).add(-1, "months").format("YYYY-MM-DD");

    //var query = "select * from CR_DirectEstimateRequest order by id desc limit 20";

    var query = "";
    query += "SELECT ";
    query += "	`CR_DirectEstimateRequest`.`id`, ";
    query += "	`CR_DirectEstimateRequest`.`paymentMethod`, ";
    query += "	`CR_DirectEstimateRequest`.`isRead`, ";
    query += "	`CR_DirectEstimateRequest`.`isFinish`, ";
    query += "	`CR_DirectEstimateRequest`.`modelId`, ";
    query += "	`b`.`name` as `modelName`, ";
    query += "	`CR_DirectEstimateRequest`.`classId`, ";
    query += "	`c`.`name` as `className`, ";
    query += "	`CR_DirectEstimateRequest`.`brandId`, ";
    query += "	`e`.`name` as `brandName`, ";
    query += "	`CR_DirectEstimateRequest`.`limit`, ";
    query +=
      "	date_format(`CR_DirectEstimateRequest`.`created_at`, '%Y-%m-%d %H:%i:%s') as created_at, ";
    query +=
      "	(select parent_name from CR_region where parent_id != 0 and region_name = `CR_DirectEstimateRequest`.`residence`) as residence, ";
    query += "	`CR_DirectEstimateRequest`.`residence` as residenceDetail, ";
    query += "	`CR_DirectEstimateRequest`.`remain`, ";
    query += "	`d`.`imageUrl` ";
    query += "FROM ";
    query += "	`CR_DirectEstimateRequest` ";
    query +=
      "	inner join `CR_CarModel` as `b` on `CR_DirectEstimateRequest`.`modelId` = `b`.`id` ";
    query +=
      "	inner join `CR_CarClass` as `c` on `CR_DirectEstimateRequest`.`classId` = `c`.`id` ";
    query +=
      "	inner join `CR_CarClassColor` as `d` on `CR_DirectEstimateRequest`.`colorId` = `d`.`id` ";
    query +=
      "	inner join `CR_CarBrand` as `e` on `CR_DirectEstimateRequest`.`brandId` = `e`.`id` ";
    query += "WHERE ";
    //date_format(CD_Order.created_at, '%Y-%m-%d %H:%i:%s') as created_at
    query += "	`CR_DirectEstimateRequest`.`created_at` >= :searchMonth ";
    query += "	and `CR_DirectEstimateRequest`.`deleted_at` is null ";
    if (reqMode == "mine") {
      query +=
        " and CR_DirectEstimateRequest.id IN (SELECT CD_CountTransaction.relationId FROM CD_CountTransaction WHERE CD_CountTransaction.accountId = '" +
        req.app.get("tokenId") +
        "' AND CD_CountTransaction.`type` IN (3, 6)) ";
    }

    //삭제 조회 조건
    if (req.app.get("tokenDeleteList")) {
      query +=
        " and `CR_DirectEstimateRequest`.`id` not in (" + decodeJson + ")";
    }

    //if(whereInClass){
    //	query += "	and `CR_DirectEstimateRequest`.classId in (" + whereInClass + ")";
    //}
    //if(whereInModel){
    //	query += "	and `CR_DirectEstimateRequest`.modelId in (" + whereInModel + ")";
    //}
    if (whereInBrand) {
      query +=
        "	and `CR_DirectEstimateRequest`.brandId in (" + whereInBrand + ")";
    }
    if (whereInPaymentType) {
      query +=
        "	and `CR_DirectEstimateRequest`.paymentMethod = '" +
        whereInPaymentType +
        "'";
    }
    if (whereInRegion) {
      var searchKey = searchRegion("set", whereInRegion);
      searchKey = searchKey.toString();
      //console.log(searchKey);
      query +=
        "	and `CR_DirectEstimateRequest`.residence in (" + searchKey + ")";
    }

    if (offset) {
      query += " and CR_DirectEstimateRequest.id < '" + offset + "'";
    }
    query += "order BY ";
    query += "	`CR_DirectEstimateRequest`.`id` desc ";
    query += "limit 20";

    var listNew = await models.sequelize.query(query, {
      //model: models.CR_DirectEstimateRequest 12703
      replacements: { searchMonth: searchMonth },
    });

    /*
		if(listNew[0].length != 0){
			//지역 설정
			for(var i = 0; i < listNew[0].length; i++){
				var placeNm = searchRegion("get", listNew[0][i].residence);
				listNew[0][i].residence = placeNm;
			}
			
			//오프셋 설정
			offset = listNew[0][19].id
		}
		*/
    console.log("--------------------");
    console.log(req.app.get("tokenEmail"));
    console.log("offset : " + offset);
    console.log("--------------------");
    //console.log(listNew[0]);
    res.send({
      success: true,
      list: listNew[0],
      listCnt: listNew[0].length,
      limit: limitCnt,
      offset: offset,

      /*
				'pushEnable': defaultData.pushEnable,
				'freePass': defaultData.freePass,
				'freeEnable': defaultData.freeEnable,
				'issueFreePass': defaultData.issueFreePass,
				'promotion': defaultData.promotion
				*/
    });
    //res.send({ 'list': listNew[0], 'limit': limitCnt });
  } catch (err) {
    console.log(err);
  }
};

function searchRegion(mode, region) {
  //var searchKey = new Array('수도권', '충청남도', '충청북도', '전라남도', '전라북도', '경상남도', '경상북도', '강원도', '제주도');
  //var searchKeyArr = new Array();
  //	searchKeyArr[0] = new Array('서울특별시', '경기도', '인천광역시');
  //	searchKeyArr[1] = new Array('충청남도', '대전광역시');
  //	searchKeyArr[2] = new Array('충청북도', '세종특별자치시');
  //	searchKeyArr[3] = new Array('전라남도', '광주광역시');
  //	searchKeyArr[4] = new Array('전라북도');
  //	searchKeyArr[5] = new Array('경상남도', '부산광역시', '울산광역시');utf8mb4_general_ci
  //	searchKeyArr[6] = new Array('경상북도', '대구광역시');
  //	searchKeyArr[7] = new Array('강원도');
  //	searchKeyArr[8] = new Array('제주특별자치도');

  if (mode == "set") {
    var ret = new Array();

    var query = "";
    query += " SELECT ";
    query += "	region_name ";
    query += " FROM ";
    query += "	CR_region ";
    query += " WHERE ";
    query += " parent_id != 0 ";

    query += " order by id asc ";

    var region = models.sequelize.query(query, {});

    for (var i = 0; i < region[0].length; i++) {
      if (region[0].region_name == region) {
        ret.push(region[0].parent_name);
      }
    }

    //for(var i = 0; i < region.length; i++){
    //	if(searchKey[i]){
    //		for(var j = 0; j < searchKey[i].lenght; j++){
    //			ret.push(searchKey[i][j]);
    //		}
    //	}
    //}
    return ret;
  } else {
    var placeNm = "";
    //console.log(region);
    for (var i = 0; i < searchKey.length; i++) {
      //console.log(searchKey[i]);
      for (var j = 0; j < searchKey[i].length; j++) {
        if (searchKeyArr[i][j] == region) {
          return searchKey[i];
        }
      }
      //var index = searchKey[i].indexOf(region);
      //console.log(index);
      //if(index != -1){
      //	placeNm = searchKey[i][index];
      //}
    }
    //console.log(searchKey);
    return placeNm;
  }
}

let listNewMine = async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
  }
};

let baseInfo = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  try {
    var whereInBrandValue = null;
    //로그인을 체크하여 추가적으로 검색을 한다.
    //회원 로그인을 체크하여 로직 추가
    if (req.app.get("tokenEmail")) {
      whereInBrandValue = req.app.get("tokenBrand");
    }

    var query = "";
    query += " SELECT ";
    query += "	id, name, madeIn, sameSizeImageUrl ";
    query += " FROM ";
    query += "	CR_CarBrand ";
    query += " WHERE ";
    query += " isDefault = true ";
    if (whereInBrandValue) {
      query += " and id in (" + whereInBrandValue + ") ";
    }
    query += " order by madeIn asc, sequence asc ";

    var brandList = await models.sequelize.query(query, {});
    /*
		var query  = "";
			query += " SELECT ";
			query += "	id, brandId, name ";
			query += " FROM ";
			query += "	CR_CarModel ";
			query += " WHERE ";
			query += " isDefault = true ";
			if(whereInBrandValue){
				query += " and brandId in ("+whereInBrandValue+") ";
			}
			query += " order by brandId asc, sequence asc ";
		//console.log(query);
		var modelList = await models.sequelize.query(query, {});

		var query  = "";
			query += " SELECT ";
			query += "	id, modelId, name ";
			query += " FROM ";
			query += "	CR_CarClass ";
			query += " WHERE ";
			query += " isDefault = true ";
			if(whereInBrandValue){
				query += " and brandId in ("+whereInBrandValue+") ";
			}

			query += " order by modelId asc, sequence asc ";

		var classList = await models.sequelize.query(query, {});
		
		var region = [
			'수도권', '충청남도', '충청북도', '전라남도', '전라북도', '경상남도', '경상북도', '강원도', '제주도'
		];
		*/

    var query = "";
    query += " SELECT ";
    query += "	region_name ";
    query += " FROM ";
    query += "	CR_region ";
    query += " WHERE ";
    query += " parent_id = 0 ";

    query += " order by id asc ";

    var region = await models.sequelize.query(query, {});

    res.send({
      success: true,
      brandInfo: brandList[0],
      //'modelInfo': modelList[0],
      //'classInfo': classList[0],
      region: region[0],
    });
  } catch (err) {
    console.log(err);
  }
};

//단일 검색 모달 팝업
const read = async (req, res) => {
  /*
		어플 -> 견적 클릭시 견적 상세 페이지 
    1. 해당 견적이 과거 조회 이력이 있는지 확인 (이유: 조회 이력이 없으면 CD_CountTransaction 조회 로그 추가 및 해당 견적 조회 가능 횟수 -1 , 조회 이력 있으면 그냥 통과 2,3,4,5번 무시하고 바로 해당 견적 데이터 노출 )
    2. 조회 이력이 없다면 정기권 사용 여부 체크
    3. 정기권 사용시 CD_CountTransaction에 해당 활동 로그 남김 
    4. 일반 열람권(초기 가입 무료 1건) 사용시 CD_CountTransaction에 해당 활동 로그 남기고, CD_Account 에 normalCount - 1
    5. 해당 견적의 이용 횟수 차감(remain - 1) 및 이용 횟수 없다면 마감 처리(isFinish = true)
    6. 해당 견적 정보 노출
	*/

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  try {
    const whereEmail = req.app.get("tokenEmail");
    const whereTokenId = req.app.get("tokenId");
    const request = req.body;
    //console.log(request);
    const id = request.id;

    let countinue = false;

    //  1. 해당 견적이 과거 조회 이력이 있는지 확인 (이유: 조회 이력이 없으면 CD_CountTransaction 조회 로그 추가 및 해당 견적 조회 가능 횟수 -1 , 조회 이력 있으면 그냥 통과 2,3,4,5번 무시하고 바로 해당 견적 데이터 노출 )
    let checkQuery = "";
    checkQuery +=
      " select * from CD_CountTransaction where relationId ='" +
      id +
      "' and accountId = '" +
      whereTokenId +
      "' and type in (3, 6) ";

    const checkData = await models.sequelize.query(checkQuery, {});

    if (!checkData[0][0]) {
      //  2. 조회 이력이 없다면 정기권 사용 여부 체크
      //데이터가 없을시 회원이 소지하구 있는 정기권을 확인한다.
      //딜러 계정 데이터 조회 , id , freePass(정기권 기한 확인)
      const getAccount = await models.CD_Account.findAll({
        attributes: ["id", "freePass", "normalCount", "isAdminYN"],
        where: {
          id: whereTokenId,
        },
        raw: true,
      });

      // 정기권 남은 기한 체크해서 현재 정기권 사용 가능 여부 체크
      const freePassCheck =
        getAccount[0].freePass === null
          ? false
          : _leftDayCount(getAccount[0].freePass) + 1 > 0;

      if (freePassCheck) {
        // 3. 정기권 사용시 CD_CountTransaction에 해당 활동 로그 남김
        //정기권 사용가능 할 시
        //정기권 읽기 로그 Insert
        console.log("----- 정기권 사용 로그 INSERT -----");
        // 어드민 체크 여부

        const freePassRead = _freePass.freePassReadLogFn(id, whereTokenId, res);
        if (freePassRead) {
          countinue = true;
        }

        //
      } else {
        //4. 일반 열람권(초기 가입 무료 1건) 사용시 CD_CountTransaction에 해당 활동 로그 남기고, CD_Account 에 normalCount - 1
        //정기권 소지 하지 않았을시 열람권을 확인한다.
        //열람권 남은 갯수 체크
        if (Number(getAccount[0].normalCount) > 0) {
          const normalCountReadLog = _normalCount.normalCountReadLogFn(
            id,
            whereTokenId,
            res
          );

          const normalCountReadMinus = _normalCount.normalCountReadMinusFn(
            req.app.get("tokenNormalCount"),
            whereTokenId,
            res
          );

          if (normalCountReadLog && normalCountReadMinus) {
            countinue = true;
          }
        } else {
          // 열람권도 남은게 없다면 데이터 보내 주지 않음
          res.send({
            success: false,
            message: "정기권 및 열람권이 없어 열람 할 수 없습니다.",
          });
          return false;
        }
      }

      //5. 해당 견적의 이용 횟수 차감(remain - 1) 및 이용 횟수 없다면 마감 처리(isFinish = true)
      //해당 견적의 견적 조회 가능 횟수(remain) 차감, remain 0 일시 isFinish true
      //CR_DirectEstimateRequest 의 is_finish 와 remain을 수정 한다.
      const requestDataList = await models.CR_DirectEstimateRequest.findOne({
        attributes: ["id", "isFinish", "remain"],
        where: {
          id: id,
        },
      });
      //console.log(requestDataList);
      if (requestDataList) {
        if (getAccount[0].isAdminYN === "n") {
          var is_finish = requestDataList.isFinish;
          var is_remain = requestDataList.remain - 1;

          if (is_finish != 0) {
            if (is_remain == 0) {
              is_finish = 0;
            } else {
              is_finish = 1;
            }
          } else {
            is_finish = is_finish;
          }
          models.CR_DirectEstimateRequest.update(
            {
              isFinish: is_finish,
              remain: is_remain,
            },
            {
              where: { id: id },
            }
          )
            .then((updateResult) => {
              countinue = true;
            })
            .catch((err) => {
              console.log(err);
              res.send({
                success: false,
                message: "isFinish, remain 변경 실패",
              });
            });
        }
      } else {
        res.send({
          success: false,
          message: "is_finish, remain 수정 실패",
        });
      }
    } else {
      console.log("----- 조회 이력 있는 견적 조회 -----");
      countinue = true;
    }
    // } else {
    //   countinue = true;
    // }

    // 6. 해당 견적 정보 노출
    if (countinue) {
      var query = "";
      query += " SELECT ";
      query += " `CR_DirectEstimateRequest`.*,  ";
      query += " `b`.`name` as `modelName`,  ";
      query += " `c`.`name` as `className`,  ";
      query += " `e`.`name` as `brandName`,  ";
      query += " `d`.`imageUrl`,  ";
      query += " `d`.`rgb`,  ";
      query += " `d`.`name` as `colorName`,  ";
      query += " `f`.`name` as `userName`,  ";
      query += " `f`.`contact` as `contact`,  ";
      query +=
        " (select memo from CD_PurchasedList where estimateId = '" +
        id +
        "' and accountId = '" +
        whereEmail +
        "') as memo  ";
      query += " from `CR_DirectEstimateRequest`  ";
      query +=
        " inner join `CR_CarModel` as `b` on `CR_DirectEstimateRequest`.`modelId` = `b`.`id`  ";
      query +=
        " inner join `CR_CarClass` as `c` on `CR_DirectEstimateRequest`.`classId` = `c`.`id`  ";
      query +=
        " inner join `CR_CarClassColor` as `d` on `CR_DirectEstimateRequest`.`colorId` = `d`.`id`  ";
      query +=
        " inner join `CR_CarBrand` as `e` on `CR_DirectEstimateRequest`.`brandId` = `e`.`id`  ";
      query +=
        " inner join `CR_Account` as `f` on `CR_DirectEstimateRequest`.`accountId` = `f`.`id`  ";
      query += " WHERE ";
      query += " `CR_DirectEstimateRequest`.`id` = '" + id + "' ";
      query += " and `CR_DirectEstimateRequest`.`deleted_at` is null  ";
      query += " limit 1 ";

      var data = await models.sequelize.query(query, {});

      if (data[0][0]) {
        data[0][0].userName = common.decrypt(data[0][0].userName, req);
        data[0][0].contact = common.decrypt(data[0][0].contact, req);

        res.send({
          success: true,
          data: data[0][0],
        });
      } else {
        res.send({
          success: false,
          message: "data is empty",
        });
      }
    }
  } catch (err) {
    console.log("---- 견적 상세 페이지 에러 ----");
    console.log(err);
  }
};

//한달안에 중복된 리스트 체크
let set = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  try {
    var whereEmail = req.app.get("tokenEmail");
    var request = req.body;
    //console.log(request);
    var isContacted = request.isContacted;
    var memo = request.memo;
    var estimateId = request.estimateId;

    const updateResult = await models.CD_PurchasedList.update(
      {
        isContacted: isContacted,
        memo: memo,
      },
      {
        where: { accountId: whereEmail, estimateId: estimateId },
      }
    );

    //console.log(updateResult);
    if (updateResult == 0) {
      res.send({
        success: false,
      });
    } else {
      res.send({
        success: true,
      });
    }

    /*
		var query  = " update ";
			query += " CD_PurchasedList set ";
			query += " isContacted = '" + isContacted + "', ";
			query += " memo = '" + memo + "' ";
			query += " where " ;
			query += " accountId = '" + whereEmail + "' ";
			query += " and estimateId = '" + estimateId + "' ";

		var data = await models.sequelize.query(query, {});
		
		if(data[0].changedRows == 0){
			res.send({
				'success': false
			});
		}else{
			res.send({
				'success': true
			});
		}
		*/
  } catch (err) {
    console.log(err);
  }
};

//주문 리스트
let orderList = async (req, res) => {
  try {
    var accountId = req.app.get("tokenId");

    var query =
      " SELECT * FROM CD_Pay a WHERE a.accountId = '" +
      accountId +
      "' ORDER BY a.created_at DESC ";

    var orderList = await models.sequelize.query(query, {});

    if (orderList[0][0]) {
      var data = orderList[0];

      res.send({
        success: true,
        listCnt: data.length,
        list: data,
      });
    } else {
      res.send({
        success: true,
        listCnt: 0,
        list: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

//주문 리스트 상세
let orderDetail = async (req, res) => {
  try {
    var orderId = req.body.orderId;
    //var orderArr = orderId.split("_");
    //var accountId = req.body.accountId;
    //var query  = "";
    //	query += " SELECT ";
    //	query += "	* ";
    //	query += " FROM ";
    //	query += "	CD_Order ";
    //	query += " WHERE ";
    //	query += " accountId = "+req.app.get('tokenId');
    //	query += " and id = '"+orderId+"' ";
    //	//query += " accountId = "+accountId;
    //	query += " order by id desc ";
    var accountId = req.app.get("tokenId");

    var query = " SELECT * FROM CD_Pay a WHERE a.id = '" + orderId + "'";

    var orderList = await models.sequelize.query(query, {});

    if (orderList[0][0]) {
      var data = orderList[0][0];

      if (data.vbank_date) {
        data.caroom_account = "신한은행 140-012-764000";
        data.caroom_account_name = "(주)카룸 이호진";
      }
      var checkCancelyn =
        "SELECT * FROM CD_CountTransaction a WHERE a.accountId ='" +
        accountId +
        "' AND a.type = '6' AND a.created_at >= '" +
        moment(data.created_at).format("YYYY-MM-DD HH:mm:SS") +
        "'";
      var checkCancelynResult = await models.sequelize.query(checkCancelyn, {});

      // console.log(checkCancelynResult[0].length);
      // console.log(data.updated_at);
      const t1 = moment(moment(data.updated_at).add("7", "days"), "YYYY-MM-DD");
      const t2 = moment(moment(), "YYYY-MM-DD");
      // console.log(t1.format("YYYY-MM-DD"));
      // console.log(t2.format("YYYY-MM-DD"));
      //const leftDay = moment.duration(t1.diff(t2)).days();
      const diffDay = t1.diff(t2, "days");
      console.log(diffDay);
      data.cancel_yn =
        checkCancelynResult[0].length > 0 || diffDay < 0 ? "n" : "y";

      var resultData = {
        success: true,
        data: data,
      };
      res.json(resultData);
    } else {
      res.send({
        success: false,
        list: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

//결제 취소 요청
let requestCancelOrder = async (req, res) => {
  try {
    var orderId = req.body.orderId;
    var accountName = req.body.accountName;
    var message = accountName + "님이 취소요청을 하였습니다.";
    let phoneNumber = "01035973517";

    const accountId = req.app.get("tokenId");

    var query = " SELECT * FROM CD_Pay a WHERE a.id = '" + orderId + "'";

    var orderList = await models.sequelize.query(query, {});

    if (orderList[0][0]) {
      var data = orderList[0][0];

      if (data.vbank_date) {
        data.caroom_account = "신한은행 140-012-764000";
        data.caroom_account_name = "(주)카룸 이호진";
      }
      var checkCancelyn =
        "SELECT * FROM CD_CountTransaction a WHERE a.accountId ='" +
        accountId +
        "' AND a.type = '6' AND a.created_at >= '" +
        moment(data.created_at).format("YYYY-MM-DD HH:mm:SS") +
        "'";
      var checkCancelynResult = await models.sequelize.query(checkCancelyn, {});

      // console.log(checkCancelynResult[0].length);
      // console.log(data.updated_at);
      const t1 = moment(moment(data.updated_at).add("7", "days"), "YYYY-MM-DD");
      const t2 = moment(moment(), "YYYY-MM-DD");
      // console.log(t1.format("YYYY-MM-DD"));
      // console.log(t2.format("YYYY-MM-DD"));
      //const leftDay = moment.duration(t1.diff(t2)).days();
      const diffDay = t1.diff(t2, "days");
      // console.log(diffDay);
      const cancel_yn =
        checkCancelynResult[0].length > 0 || diffDay < 0 ? "n" : "y";

      if (cancel_yn === "n") {
        console.log(`----${accountName} 취소 불가 결제 ----`);
        res.send({
          success: false,
          message: "취소 불가한 결제입니다.",
        });

        return false;
      }
    }

    const requestCancel = await models.CD_Pay_RequestCancel.findOne({
      attributes: ["id"],
      where: { payId: orderId },
      raw: true,
    });
    console.log(`----${accountName} 결제 취소 요청 ----`);
    console.log(requestCancel);

    if (requestCancel) {
      console.log(`----${accountName} 결제 취소 이미 있음 ----`);
      res.send({
        success: false,
        message: "이미 취소 요청된 결제입니다.",
      });

      return false;
    }

    models.CD_Pay_RequestCancel.create({
      accountId: accountId,
      payId: orderId,
    })
      .then((updateResult) => {
        common.sendSMS(message, phoneNumber);
        console.log(`----${accountName} 결제 취소 완료 ----`);
        res.send({
          success: true,
          message: "취소요청을 하였습니다.",
        });
        return true;
      })
      .catch((err) => {
        console.log(`----${accountName} 결제 취소 Error ----`);
        console.log(err);
        res.send({
          success: false,
          message: "취소요청에 실패 하였습니다.",
        });
        return false;
      });
  } catch (err) {
    console.log(err);
  }
};

//열람권 조회
let orderTicket = async (req, res) => {
  try {
    var brandId = req.app.get("tokenBrand");
    var cashArray = new Array(); // 가격 저장 하기 위한 변수
    var id;

    await models.CD_Store.findAll({
      attributes: [
        "id",
        "name",
        "price",
        "desc",
        "type",
        "normalCount",
        "specialCount",
        "isEnabled",
        "sequence",
        "brandId",
      ],
      where: {
        brandId: {
          [Op.in]: brandId,
        },
        isEnabled: "1",
        useType: "dealer",
      },
    })
      .then((dataList) => {
        //console.log(dataList);
        for (var i = 0; i < dataList.length; i++) {
          cashArray.push(dataList[i].price);
        }
        // 가격 내림 차순 정렬
        cashArray.sort(function (a, b) {
          return b - a;
        });

        for (var i = 0; i < dataList.length; i++) {
          if (dataList[i].price == cashArray[0]) {
            id = dataList[i].id;
          }
        }

        if (dataList[0]) {
          res.send({
            success: true,
            storeId: id,
            price: cashArray[0],
            name: dataList[0].name,
          });
        } else {
          res.send({
            success: false,
            message: "열람권이 없습니다.",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.send({
          err: err,
        });
      });
  } catch (err) {
    console.log(err);
  }
};

//정기구독 취소하기
let cancelRegularOrder = async (req, res) => {
  try {
    var accountId = req.app.get("tokenId");

    var query =
      "SELECT * FROM CD_Pay_Billing a WHERE a.accountId = '" +
      accountId +
      "' AND status = 'active' AND deleted_at IS NULL ORDER BY created_at LIMIT 1";

    const billingData = await models.sequelize.query(query, {});

    console.log(billingData);

    if (billingData.length > 0) {
      await models.CD_Pay_Billing.update(
        {
          status: "terminate",
        },
        {
          where: { id: billingData[0][0].id },
        }
      )
        .then((updateResult) => {
          res.send({ success: true, message: "처리 성공." });
        })
        .catch((err) => {
          console.log(err);
          res.send({
            success: false,
            message: "처리중 문제가 발생하였습니다. 관리자에게 문의하세요.",
          });
        });
    } else {
      res.send({
        success: false,
        message: "정기 결제에 가입되어 있지 않습니다.",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

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
module.exports = {
  listNew: listNew,
  baseInfo: baseInfo,
  read: read,
  set: set,
  orderList: orderList,
  orderDetail: orderDetail,
  orderTicket: orderTicket,
  requestCancelOrder: requestCancelOrder,
  cancelRegularOrder: cancelRegularOrder,
};
