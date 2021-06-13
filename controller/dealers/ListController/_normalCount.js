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

// 해당 계정 이용로그
const normalCountReadLogFn = async (id, accountId, res) => {
  try {
    console.log("----- 일반 열람권 사용 로그 INSERT -----");
    const normalCountReadLog = await models.CD_CountTransaction.create(
      {
        accountId: accountId,
        normalCount: "-1",
        specialCount: 0, //라라벨 encrypt
        type: 3,
        desc: "열람권 사용 조회",
        relationId: id,
      },
      { raw: true }
    );

    return true;
  } catch (err) {
    console.log(" ---- 열람권 카운트 소비 Read Log Error---- ");
    console.log(err);
    res.send({
      success: false,
      message: "열람권 처리에 문제가 발생하였습니다. 관리자에게 문의하세요.",
    });
    return false;
  }
};

// 해당 계정의 일반권 이용 횟수 차감
const normalCountReadMinusFn = async (tokenNormalCount, accountId, res) => {
  try {
    console.log("----- 일반 열람권 횟수 차감 UPDATE -----");
    const normalCountUpdate = await models.CD_Account.update(
      {
        normalCount: Number(tokenNormalCount) - 1,
      },
      {
        where: { id: accountId },
      }
    );
    return true;
  } catch (err) {
    console.log(" ---- 열람권 카운트 소비 Minus Error---- ");
    console.log(err);
    res.send({
      success: false,
      message: "열람권 처리에 문제가 발생하였습니다. 관리자에게 문의하세요.",
    });
    return false;
  }
};

module.exports = {
  normalCountReadLogFn,
  normalCountReadMinusFn,
};
