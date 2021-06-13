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

/*
  정기권 관련 처리 로직 정리
*/

// 정기권 읽기
const freePassReadLogFn = async (id, accountId, res) => {
  try {
    const freePassReadLog = await models.CD_CountTransaction.create(
      {
        accountId: accountId,
        normalCount: "-1",
        specialCount: 0, //라라벨 encrypt
        type: 6,
        desc: "정기권 사용 조회",
        relationId: id,
      },
      { raw: true }
    );

    return true;
  } catch (err) {
    console.log("------ 정기권 사용처리에러 ----- ");
    console.log(err);
    res.send({
      success: false,
      message: "정기권 처리에 문제가 발생하였습니다. 관리자에게 문의하세요.",
    });
    return false;
  }
};

module.exports = {
  freePassReadLogFn,
};
