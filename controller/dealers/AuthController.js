var models = require("../../models");
var common = require("../Common");
var sha256 = require("sha256");
var crypto = require("crypto");
const dateTime = require("node-datetime");
var moment = require("moment");
const bcrypt = require("bcrypt");
var urlencode = require("urlencode");
var request = require("request");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const s3 = require("../../routes/s3");
var bodyParser = require("body-parser");

const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

//const curl = new (require( 'curl-request' ))();

function setLog(req, string) {
  var os = req.headers.os;
  var device = req.headers.device;

  var now = moment().format("YYYY-MM-DD");
  //getBrand | getDeviceType | getDeviceName | getModel | getVersion | getBuildNumber
  console.log(now + " - " + string);
}

let cdAccountList = async (req, res) => {
  try {
    const dataList = await models.CD_Account.findAll({
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
        "freePass",
      ],
    });
    res.json(dataList);
  } catch (err) {
    console.log(err);
  }
};

//정기권 체크
let checkRegularCard = async (req, res) => {
  try {
    var accountId = req.app.get("tokenId");

    // var query = "";
    // query += " SELECT ";
    // query +=
    //   "	a.id, a.accountId, a.created_at, a.resultcode, b.resultCode, c.freePass ";
    // query += " FROM ";
    // query += "	CD_InicisRegularResult a ";
    // query += "  LEFT JOIN CD_InicisCancelResult b ON a.tid = b.resultTid ";
    // query += "  LEFT JOIN CD_Account c ON a.accountId = c.id ";
    // query += " WHERE ";
    // query += " a.accountId = '" + accountId + "' ";
    // query += " AND (b.resultCode IS NULL OR b.resultCode != '00') ";
    // query += " AND c.freePass > NOW() ";
    // query += " order by a.id desc limit 1 ";
    var query =
      "SELECT * FROM CD_Pay_Billing a WHERE a.accountId = '" +
      accountId +
      "' AND status = 'active' AND deleted_at IS NULL ORDER BY created_at LIMIT 1";

    await models.sequelize
      .query(query, {})
      .then((dataList) => {
        if (dataList[0].length != 0) {
          var resultData = { success: true, data: true };
          res.json(resultData);
        } else {
          var resultData = { success: true, data: false };
          res.json(resultData);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    //return returnData;
  } catch (err) {
    console.log(err);
    return false;
  }
};

//email로 회원 검색
let searchAccountToEmail = async (email) => {
  try {
    var returnData;

    await models.CD_Account.findOne({
      attributes: [
        "id",
        "email",
        "companyName",
        "name",
        "password",
        "enabled",
        "loginEnable",
        "freePass",
        "businessCard",
        "contact",
        "contact_hash",
        "brand",
        "pushEnable",
        "blackEnable",
        "normalCount",
        "device_id",
        "isAdminYN",
      ],
      where: {
        email: email,
      },
    })
      .then((dataList) => {
        returnData = dataList;
      })
      .catch((err) => {
        console.log(err);
      });

    return returnData;
  } catch (err) {
    console.log(err);
    return false;
  }
};

//정기권 체크
let checkFreePass = async (checkAccount) => {
  try {
    var returnData;

    //현재시간
    var currentTime = new Date(moment().format("YYYY/MM/DD"));
    //정기권 시간
    var passTime = new Date(moment(checkAccount.freePass));
    //var passCard = true;

    if (currentTime > passTime) {
      returnData = false;
    } else if (checkAccount.freePass == null) {
      returnData = false;
    } else {
      returnData = true;
    }

    return returnData;
  } catch (err) {
    console.log(err);
    return false;
  }
};

//로그인
let cdAccountOne = async (req, res) => {
  console.log("*****|login|로그인.");
  try {
    //os
    var os = req.headers.os;
    //fcmkey
    var fcmKey = req.headers.fcmkey;
    //deviceId
    var device_id = req.headers.deviceid;

    //password
    var password = req.body.password;

    var refreshTokenCheck = req.body.loginEnable;
    //var refreshTokenCheck = "1";
    var refreshTokenUse = null;
    //임시용 나중에 삭제 해야함
    //os = "aos";
    //fcmKey = "crDni1t4v40:APA91bE2x76QvkZvzdLlcv1nKgEPNI6OOc1qj-pxnCnxSaiT0Dxu2Th9GOzVqLXfOX1D429a9ViZ7-W8Ka_wCXhcVC71QHbgoxTCA1C05QqQ1Q-ikoxbLdwEJDbTU77onwb7CSiGLHkt";
    console.log(req.body.email + "|login|" + os + "|" + device_id);
    if (os != "ios" && os != "aos") {
      //setLog(req, "");
      console.log(req.body.email + "|login|os is null");
      var resultData = {
        success: false,
        message: "잘못된 접근입니다. 앱으로 접속해주세요.",
        result: "os not receive",
      };
      res.json(resultData);
    }

    if (!fcmKey) {
      console.log(req.body.email + "|login|fcm is null");
      var resultData = {
        success: false,
        message: "잘못된 접근입니다. 앱으로 접속해주세요.",
        result: "fcm key not receive",
      };
      res.json(resultData);
    }

    //나중에 주석 풀어야함.
    if (!device_id) {
      var resultData = {
        success: false,
        message: "잘못된 접근입니다. 앱으로 접속해주세요.",
        result: "device id not receive",
      };
      res.json(resultData);
    }

    console.log(req.body.email + "|login|find User");
    //암호를 확인 하기 위하여 이메일로 검색후 비밀번호를 비교한다.

    // email로 회원 검색
    const checkAccount = await searchAccountToEmail(req.body.email);

    if (!checkAccount) {
      console.log(req.body.email + "|login|계정정보가 존재하지 않습니다.");
      var resultData = {
        success: false,
        message: "계정 정보가 존재 하지 않습니다.",
      };
      res.json(resultData);
      return false;
    }

    //비밀번호 체크
    var pass_hash = checkAccount.password;
    pass_hash = pass_hash.replace(/^\$2y(.+)$/i, "$2a$1");
    var pwdResult = bcrypt.compareSync(password, pass_hash);

    if (!pwdResult) {
      console.log(req.body.email + "|login|비밀번호를 확인해주세요.");
      var resultData = { success: false, message: "비밀번호를 확인해주세요." };
      res.json(resultData);
      return false;
    }

    //회원 인증체크
    if (checkAccount.enabled == "0") {
      console.log(
        req.body.email +
          "|login|아직 카룸에서 인증되지 않았습니다. 조금만 기다려 주세요."
      );
      var resultData = {
        success: false,
        message: "아직 카룸에서 인증되지 않았습니다. 조금만 기다려 주세요.",
      };
      res.json(resultData);
    }

    //중복 로그인 체크
    // 관리자인 경우 중복 로그인에 대한 제한을 풀어준다.
    if (
      device_id != checkAccount.device_id &&
      checkAccount.device_id != null &&
      checkAccount.isAdminYN != "y"
    ) {
      //중복 로그인 방지를 위한 디바이스 아이디 체크
      //checkAccount.device_id 가 null 일 경우는 처음 로그인을 하거나 기기를 옮겨 초기화 된 경우이기때문에
      //해당 로직은 마지막에 처리한다.
      console.log(
        req.body.email +
          "|login|최초 로그인한 기기에서 사용가능합니다. 변경을 원하시면 관리자에게 문의 하세요."
      );
      var resultData = {
        success: false,
        message:
          "최초 로그인한 기기에서 사용가능합니다. 변경을 원하시면 관리자에게 문의 하세요.",
      };
      res.json(resultData);
      return false;
    }

    //프리패스(정기권) 체크
    var passCard = await checkFreePass(checkAccount);

    //정기구독권 확인
    //var regularCard = await checkRegularCard(checkAccount);

    //푸시 체크
    if (checkAccount.pushEnable == 1) {
      checkAccount.pushEnable = true;
    } else {
      checkAccount.pushEnable = false;
    }

    //return data default setting
    var resultData = {
      success: true,
      message: null,
      access_token: null,
      refresh_token: null,
      fcmKey: fcmKey,
      os: os,
      accountId: checkAccount.id,
      company_name: checkAccount.companyName,
      brand: checkAccount.brand,
      push_enable: checkAccount.pushEnable,
      black_enable: checkAccount.blackEnable,
      businessCard:
        "https://caroom-storage.s3.ap-northeast-2.amazonaws.com/" +
        checkAccount.businessCard,
      passCard: passCard,
      normalCount: checkAccount.normalCount,
      freePass: checkAccount.freePass,
      contact: common.decrypt(checkAccount.contact, req),
      email: checkAccount.email,
      name: checkAccount.name,
      //regularCard: regularCard
    };

    //토큰 생성
    const access_token = common.createToken(checkAccount, req, "access");
    if (!access_token) {
      console.log(req.body.email + "|login|토큰 생성실패.");
      return false;
    } else {
      //access token 리턴데이터에 set
      resultData.access_token = access_token;
    }

    //리프레시 토큰 생성

    //refresh token create
    const refresh_token = common.createToken(checkAccount, req, "refresh");
    if (!refresh_token) {
      console.log(req.body.email + "|login|refresh 토큰 생성실패.");
      return false;
    } else {
      //return refresh token set
      resultData.refresh_token = refresh_token;
    }

    //회원의 기기, fcmkeym, os 업데이트
    await models.CD_Account.update(
      {
        //loginEnable : loginEnableFlag,
        device_id: device_id,
        fcmKey: fcmKey,
        os: os,
      },
      {
        where: { email: checkAccount.email },
      }
    )
      .then((result) => {
        //console.log(result);
        if (result) {
          console.log(
            req.body.email + "|login|회원 디바이스id, fcm 업데이트 완료."
          );
          console.log(
            req.body.email +
              "|login|refresh_token 중복을 막기위한 기존 토큰 삭제 시작."
          );
          //토큰 데이터 지우기 destroy
          models.CD_Account_Token.destroy({
            where: { email: checkAccount.email },
          })
            .then((result2) => {
              console.log(
                req.body.email +
                  "|login|refresh_token 중복을 막기위한 기존 토큰 삭제 완료."
              );
              console.log(
                req.body.email + "|login|새 refresh_token 추가 시작."
              );
              //아니면 새로 refresh_token 추가
              models.CD_Account_Token.create({
                email: checkAccount.email,
                token: resultData.access_token,
                refresh_token: resultData.refresh_token,
              })
                .then((resulta) => {
                  console.log(
                    req.body.email + "|login|새 refresh_token 추가 완료."
                  );
                  //resultData.refresh_token = token;
                  res.json(resultData);
                })
                .catch((err) => {
                  console.log(
                    req.body.email +
                      "|login|CD_Account_Token refresh token 추가 실패."
                  );
                  console.log(err);
                  res.send({
                    success: false,
                    message: "CD_Account_Token refresh token 추가 실패",
                  });
                });
            })
            .catch((err) => {
              console.log(req.body.email + "|login|토큰 삭제 실패.");
              console.log(err);
              res.send({
                success: false,
                message: "토큰 삭제에 실패 하였습니다.",
              });
            });
        } else {
          console.log(
            req.body.email + "|login|회원 디바이스 정보 업데이트 실패."
          );
          res.send({
            success: false,
            message: "회원 디바이스 정보 업데이트 실패",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

//만료된 토큰 재발급
let reToken = async (req, res) => {
  try {
    console.log("*****|reToken|토큰 재발급.");
    const secret = req.app.get("jwt-secret");
    const clientToken = req.body.refresh_token.replace("Bearer ", "");

    if (clientToken) {
      const dataList = await models.CD_Account_Token.findOne({
        attributes: [
          "id",
          "email",
          "refresh_token",
          "created_at",
          "updated_at",
          "token",
        ],
        where: {
          refresh_token: clientToken,
        },
      });

      if (dataList) {
        const decoded = jwt.verify(clientToken, secret, {
          ignoreExpiration: false, //handled by OAuth2 server implementation
        });
        if (decoded) {
          console.log(decoded.email + "|reToken|검증된 refresh 토큰 decode.");
          //const email = req.body.email;
          const now = new Date().getTime();
          var nowTimeStamp = Math.round(now / 1000);
          console.log(
            decoded.email + "|reToken|decode 데이터로 정보 검색 시작."
          );
          const dataList = await models.CD_Account.findOne({
            attributes: [
              "id",
              "email",
              "companyName",
              "name",
              "password",
              "enabled",
              "loginEnable",
              "freePass",
              "businessCard",
              "contact",
              "contact_hash",
              "brand",
              "pushEnable",
              "normalCount",
            ],
            where: {
              email: decoded.email,
            },
          });
          console.log(
            decoded.email + "|reToken|decode 데이터로 정보 검색 완료."
          );
          console.log(decoded.email + "|reToken|토큰 새로 생성 시작.");
          var user = {
            email: dataList.email,
            companyName: dataList.companyName,
            name: dataList.name,
            sub: dataList.id,
            iss: "http://api.caroom.co.kr/",
            iat: nowTimeStamp,
            nbf: nowTimeStamp,
            jti: "",
            exp: Math.round(
              new Date(moment().add("1", "hours")).getTime() / 1000
            ),
          };
          const access_token = jwt.sign(user, secret);
          if (!access_token) {
            console.log(decoded.email + "|reToken|토큰 새로 생성 실패.");
          } else {
            console.log(decoded.email + "|reToken|토큰 새로 생성 완료.");
            var resultData = {
              success: true,
              access_token: access_token,
            };

            res.json(resultData);
          }
        }
      } else {
        console.log("*****|reToken|refresh token 검증 실패.");
        var resultData = {
          success: false,
          message: "refresh token is not currect",
        };
        res.json(resultData);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

//증복 회원 체크
let cdAccountCheck = async (req, res) => {
  console.log("*****|memberCheck|중복회원 검사.");
  try {
    var email = req.body.email;
    console.log(email + "|memberCheck|중복회원 검사 시작.");
    const userData = await models.CD_Account.findOne({
      attributes: ["id", "email"],
      where: { email: email },
    });
    console.log(email + "|memberCheck|중복회원 검사 완료.");

    if (userData) {
      console.log(email + "|memberCheck|이미 회원 가입된 이메일 입니다.");
      res.send({
        success: false,
        message: "이미 회원 가입된 이메일 입니다.",
      });
    } else {
      console.log(email + "|memberCheck|존재하지 않은 회원입니다.");
      res.send({
        success: true,
        message: "존재하지 않은 회원입니다.",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

//회원 가입
let cdAccountRegist = async (req, res) => {
  console.log("*****|memberRegish|회원가입");
  try {
    var upImg = s3.array("files");

    upImg(req, res, function (err) {
      // 업로드 실행
      console.log(err);
      if (err) {
        // 파일 업로드 중 오류 발생
        console.log(
          req.body.email + "|memberCheck|이미지 업로드중 문제가 발생하였습니다."
        );
        console.log(err);
        res.send({
          success: false,
          message:
            "이미지 업로드중 문제가 발생하였습니다. 관리자에게 문의하세요.",
          err: err,
        });
      } else {
        //파일 업로드 성공
        //console.log(req);
        console.log(req.body.email + "|memberCheck|이미지 업로드 확인.");

        if (!req.files) {
          console.log(
            req.body.email +
              "|memberCheck|파일 데이터가 없습니다. 확인해 주세요."
          );
          res.send({
            success: false,
            message:
              "이미지 업로드중 문제가 발생하였습니다. 관리자에게 문의하세요.",
          });
          return false;
        }

        var phoneNumber = req.body.phone_number;
        var email = req.body.email;
        var password = req.body.password;
        var saltRounds = 10;
        var pass_hash;
        var phoneHashHex; //table contact_hash
        var files_key = req.files[0].key;
        //var files_key = req[files[0]].key;
        var businessCard = "dealers/businessCard/" + files_key;

        //비밀번호 해시값 만들기
        bcrypt.hash(password, saltRounds, function (err, hash) {
          // Store hash in your password DB.
          //console.log(hash);
          pass_hash = hash;
          phoneHashHex = crypto
            .createHash("sha256")
            .update(phoneNumber)
            .digest("hex");

          request(
            {
              uri: "https://api.caroom.co.kr/encrypt",
              method: "POST",
              form: {
                value: phoneNumber,
              },
            },
            function (err, response, body) {
              //console.log("body");
              //console.log(body);

              var resultBody = JSON.parse(body);
              if (resultBody.encrypt != "") {
                console.log(
                  req.body.email + "|memberCheck|회원가입 저장 시작."
                );
                models.CD_Account.create({
                  email: email,
                  password: hash,
                  contact: resultBody.encrypt, //라라벨 encrypt
                  contact_hash: phoneHashHex,
                  businessCard: businessCard,
                  normalCount: "1",
                })
                  .then((result) => {
                    console.log(
                      req.body.email + "|memberCheck|회원가입 저장 완료."
                    );
                    console.log(
                      req.body.email +
                        "|memberCheck|회원가입시 무료 조회권 증정 시작."
                    );
                    models.CD_CountTransaction.create({
                      accountId: result.id,
                      normalCount: 1,
                      specialCount: 0, //라라벨 encrypt
                      type: 2,
                      desc: "가입 기념 무료 조회권 증정",
                      relationId: result.id,
                    })
                      .then((result2) => {
                        console.log(
                          req.body.email +
                            "|memberCheck|회원가입시 무료 조회권 증정 완료."
                        );
                        res.send({
                          success: true,
                          message:
                            "회원가입을 축하합니다. 승인이 완료 될때 까지 잠시만 기다려주세요.",
                          id: result.id,
                        });
                      })
                      .catch((err) => {
                        console.log(
                          req.body.email +
                            "|memberCheck|회원가입시 무료 조회권 실패."
                        );
                        console.log(err);
                      });
                  })
                  .catch((err) => {
                    console.log(req.body.email + "|memberCheck|회원가입 실패.");
                    console.log(err);
                    res.send({ success: false, message: "회원가입 실패." });
                  });
              } else {
                res.send({
                  success: false,
                  message:
                    "암호화중 문제가 발생하였습니다. 관리자에게 문의하세요.",
                });
              }
            }
          );
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

//회원 정보 비밀번호 수정
let cdAccountModifyPassword = async (req, res) => {
  try {
    var email = req.app.get("tokenEmail");
    var password = req.body.password;
    var saltRounds = 10;

    //비밀번호 해시값 만들기
    bcrypt.hash(password, saltRounds, function (err, hash) {
      const updateResult = models.CD_Account.update(
        {
          password: hash,
        },
        {
          where: { email: email },
        }
      );

      //console.log(updateResult);
      if (updateResult == 0) {
        res.send({
          success: false,
          message: "비밀번호 변경에 실패 하였습니다.",
        });
      } else {
        res.send({
          success: true,
          message: "비밀번호를 변경 하였습니다.",
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

//회원 정보 비밀번호 수정 not login
let cdAccountModifyPasswordNotLogin = async (req, res) => {
  try {
    //var email = req.app.get('tokenEmail');
    var email = req.body.email;
    var password = req.body.password;
    var saltRounds = 10;

    //비밀번호 해시값 만들기
    bcrypt.hash(password, saltRounds, function (err, hash) {
      const updateResult = models.CD_Account.update(
        {
          password: hash,
        },
        {
          where: { email: email },
        }
      );

      //console.log(updateResult);
      if (updateResult == 0) {
        res.send({
          success: false,
          message: "비밀번호 변경에 실패 하였습니다.",
        });
      } else {
        res.send({
          success: true,
          message: "비밀번호를 변경 하였습니다.",
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

//회원 정보 수정 일반 정보
let cdAccountModifyInfo = async (req, res) => {
  console.log(email + "|cdAccountModifyInfo|회원 정보 수정 일반 정보.");
  try {
    var email = req.app.get("tokenEmail");
    //이미지 파일(명함)이 있는지 체크
    if (!req.body.phone_number) {
      //이미지가 있을시
      var phoneNumber;
      var phoneHash;
      var phoneHashHex; //table contact_hash

      //이미지(명함 변경)
      var upImg = s3.array("files");

      upImg(req, res, function (err) {
        // 업로드 실행
        if (err) {
          // 파일 업로드 중 오류 발생
          console.log("member regist img upload fail");
          console.log(err);
          res.send({
            success: false,
            message:
              "이미지 업로드중 문제가 발생하였습니다. 관리자에게 문의하세요.",
          });
        } else {
          //파일 업로드 성공
          //console.log(req);
          console.log("member regist img upload success");

          phoneNumber = req.body.phone_number;
          console.log(email + "|cdAccountModifyInfo|전화번호 - " + phoneNumber);

          if (req.files[0] && phoneNumber != "null") {
            phoneHashHex = crypto
              .createHash("sha256")
              .update(phoneNumber)
              .digest("hex");

            request(
              {
                uri: "https://api.caroom.co.kr/encrypt",
                method: "POST",
                form: {
                  value: phoneNumber,
                },
              },
              function (err, response, body) {
                console.log("3 ------------------- body");
                console.log(body);
                var resultBody = JSON.parse(body);
                if (resultBody.encrypt != "") {
                  phoneHash = resultBody.encrypt;
                  var businessCard = "dealers/businessCard/" + req.files[0].key;

                  const updateResult = models.CD_Account.update(
                    {
                      contact: phoneHash,
                      contact_hash: phoneHashHex,
                      businessCard: businessCard,
                      enabled: "0", //
                    },
                    {
                      where: { email: email },
                    }
                  )
                    .then((updateResult) => {
                      request(
                        {
                          uri: "https://api.caroom.co.kr/sendSlack",
                          method: "POST",
                          form: {
                            value: email,
                          },
                        },
                        function (err, response, body) {
                          res.send({
                            success: true,
                            message:
                              "회원 정보 변경 하였습니다. 명함 변경으로 인한 승인 작업이 진행중입니다. 잠시만 기다려주세요.",
                          });
                        }
                      );
                    })
                    .catch((err) => {
                      console.log(err);
                      res.send({
                        success: false,
                        message: "회원 정보 변경에 실패 하였습니다.",
                      });
                    });
                }
              }
            );
          } else if (req.files[0] && phoneNumber == "null") {
            var businessCard = "dealers/businessCard/" + req.files[0].key;
            const updateResult = models.CD_Account.update(
              {
                businessCard: businessCard,
                enabled: "0",
              },
              {
                where: { email: email },
              }
            )
              .then((updateResult) => {
                request(
                  {
                    uri: "https://api.caroom.co.kr/sendSlack",
                    method: "POST",
                    form: {
                      value: email,
                    },
                  },
                  function (err, response, body) {
                    res.send({
                      success: true,
                      message:
                        "회원 정보 변경 하였습니다. 명함 변경으로 인한 승인 작업이 진행중입니다. 잠시만 기다려주세요.",
                    });
                  }
                );
              })
              .catch((err) => {
                console.log(err);
                res.send({
                  success: false,
                  message: "회원 정보 변경에 실패 하였습니다.",
                });
              });
          } else {
            phoneHashHex = crypto
              .createHash("sha256")
              .update(phoneNumber)
              .digest("hex");

            request(
              {
                uri: "https://api.caroom.co.kr/encrypt",
                method: "POST",
                form: {
                  value: phoneNumber,
                },
              },
              function (err, response, body) {
                console.log("1 ------------------- body");
                console.log(body);
                var resultBody = JSON.parse(body);
                if (resultBody.encrypt != "") {
                  phoneHash = resultBody.encrypt;

                  const updateResult = models.CD_Account.update(
                    {
                      contact: phoneHash,
                      contact_hash: phoneHashHex,
                      enabled: "0",
                    },
                    {
                      where: { email: email },
                    }
                  )
                    .then((updateResult) => {
                      res.send({
                        success: true,
                        message: "회원 정보 변경 하였습니다.",
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      res.send({
                        success: false,
                        message: "회원 정보 변경에 실패 하였습니다.",
                      });
                    });
                }
              }
            );
          }
        }
      });
    } else {
      phoneNumber = req.body.phone_number;
      email = req.body.email;
      if (phoneNumber) {
        phoneHashHex = crypto
          .createHash("sha256")
          .update(phoneNumber)
          .digest("hex");

        request(
          {
            uri: "https://api.caroom.co.kr/encrypt",
            method: "POST",
            form: {
              value: phoneNumber,
            },
          },
          function (err, response, body) {
            console.log("2 ------------------- body");
            console.log(body);
            var resultBody = JSON.parse(body);
            if (resultBody.encrypt != "") {
              phoneHash = resultBody.encrypt;

              const updateResult = models.CD_Account.update(
                {
                  contact: phoneHash,
                  contact_hash: phoneHashHex,
                  enabled: "0",
                },
                {
                  where: { email: email },
                }
              )
                .then((updateResult) => {
                  res.send({
                    success: true,
                    message: "회원 정보 변경 하였습니다.",
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.send({
                    success: false,
                    message: "회원 정보 변경에 실패 하였습니다.",
                  });
                });
            }
          }
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
};

//인증번호 전송
let cdAccountSendCert = async (req, res) => {
  try {
    var phoneNumber = req.body.phone_number;
    var key = "JaCiSqENJiU1ot3";
    var sender = "18110804";
    var username = "carom";
    var mode = req.body.mode;
    var modeCheck = false;

    //중복 번호 확인.
    const hashPhone = crypto
      .createHash("sha256")
      .update(phoneNumber)
      .digest("hex");

    //console.log(hashPhone);

    const userData = await models.CD_Account.findOne({
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
        "freePass",
      ],
      where: { contact_hash: hashPhone },
    });

    if (mode == "findId") {
      modeCheck = true;
    } else if (mode == "defaultPwd") {
      modeCheck = true;
    }

    if (userData && !modeCheck) {
      res.send({
        success: false,
        message: "이미 회원 가입된 전화번호 입니다.",
      });
    } else {
      var certCode = "";
      var certCode = Math.floor(Math.random() * 1000000) + 100000;
      if (certCode > 1000000) {
        certCode = certCode - 100000;
      }

      var message =
        " [카룸] 에서 발송한 인증번호[" +
        certCode +
        "] 입니다 3분안에 인증해 주세요.";
      //console.log(userData.dataValues.email);

      request(
        {
          uri: "https://directsend.co.kr/index.php/api/v1/sms",
          method: "POST",
          form: {
            message: message,
            sender: sender,
            username: username,
            recipients: phoneNumber,
            key: key,
          },
        },
        function (err, response, body) {
          //console.log(body);
          var now = moment().format("YYYY-MM-DD HH:mm:ss");
          var resultBody = JSON.parse(body);
          if (resultBody.status == "0") {
            //전송 성공
            request(
              {
                uri: "https://api.caroom.co.kr/encrypt",
                method: "POST",
                form: {
                  value: phoneNumber,
                },
              },
              function (err, response, body) {
                //console.log("body");
                //console.log(body);

                var resultBody = JSON.parse(body);
                if (resultBody.encrypt != "") {
                  models.CD_Cert.create({
                    certCode: certCode,
                    contact: resultBody.encrypt,
                    isCert: 0,
                    created_at: now,
                    updated_at: now,
                    contact_hash: hashPhone,
                  })
                    .then((result) => {
                      console.log(result.id);
                      if (result) {
                        res.send({
                          success: true,
                          message: message,
                          certId: result.id,
                        });
                      } else {
                        res.send({
                          success: false,
                          message: "CD_Cert insert fail",
                        });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              }
            );
          } else {
            res.send({ success: false, message: "sms send fail" });
          }
        }
      );
    }

    //res.json(test);
  } catch (err) {
    console.log(err);
  }
};

//인증번호 확인 및 아이디 찾기
let cdAccountCert = async (req, res) => {
  try {
    var phoneNumber = req.body.phone_number;
    var certId = req.body.cert_id;
    var certCode = req.body.cert_code;
    var mode = req.body.mode;

    //전화 번호 해시 변환
    const hashPhone = crypto
      .createHash("sha256")
      .update(phoneNumber)
      .digest("hex");

    var query = "";
    query += " SELECT ";
    query += "	id, certCode, isCert, created_at, contact_hash, contact, ";
    query +=
      " (select email from CD_Account where contact_hash = '" +
      hashPhone +
      "' order by id desc limit 1) as email ";
    query += " FROM ";
    query += "	CD_Cert ";
    query += " WHERE ";
    query += " contact_hash = :contact_hash and id = :id ";
    query += " order by id desc limit 1 ";

    var resultData = await models.sequelize.query(query, {
      replacements: {
        contact_hash: hashPhone,
        id: certId,
      },
    });

    resultData = resultData[0][0];

    if (resultData.isCert == "1") {
      res.send({ success: false, message: "이미 인증된 코드입니다." });
    } else {
      //현재시간
      var currentTime = new Date(moment().format("YYYY/MM/DD HH:mm:ss"));
      //인증번호 만료 시간
      var diffTime = new Date(
        moment(resultData.created_at).add("3", "minutes")
      );

      if (currentTime > diffTime) {
        res.send({
          success: false,
          message: "인증시간이 만료되었습니다. 다시 시도하세요.",
        });
      } else {
        if (certCode != resultData.certCode) {
          res.send({
            success: false,
            message: "인증코드가 틀렸습니다. 다시 확인해 주세요.",
          });
        } else {
          models.CD_Cert.update(
            {
              isCert: "1",
            },
            {
              where: { id: certId, contact_hash: hashPhone },
            }
          )
            .then((updateResult) => {
              //console.log(result);
              //성공
              if (mode == "findId") {
                res.send({
                  success: true,
                  message: "인증완료.",
                  email: resultData.email,
                });
              } else if (mode == "defaultPwd") {
                //비밀번호 초기화 기능 없음 안씀.
                /*
							var arr = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(",");
							var randomStr = "";
							for (var j = 0; j < 8; j++) {
								randomStr += arr[Math.floor(Math.random()*arr.length)];
							}

							var saltRounds = 10;
							//비밀번호 해시값 만들기
							bcrypt.hash(randomStr, saltRounds, function(err, hash) {
								
								const updateResult = models.CD_Account.update(
									{
										password : hash,
										loginEnable : '0'
									},
									{
										where : { email: resultData.email }
									}
								);

								//console.log(updateResult);
								if(updateResult == 0){
									res.send({
										'success': false,
										'message' : '비밀번호 초기화에 실패 하였습니다.'
									});
								}else{
									res.send({
										'success': true,
										'message' : '비밀번호를 초기화 하였습니다.',
										'password' : randomStr
									});
								}
											
							});
							*/
                res.send({ success: true, message: "인증완료." });
              } else {
                res.send({ success: true, message: "인증완료." });
              }
            })
            .catch((err) => {
              console.log(err);
              res.send({ success: false, message: "CD_Cert 변경 실패" });
            });
        }
      }
    }

    //res.json(test);
  } catch (err) {
    console.log(err);
  }
};

//로그아웃
let logOut = async (req, res) => {
  try {
    var email = req.app.get("tokenEmail");

    models.CD_Account.update(
      {
        loginEnable: "0",
      },
      {
        where: { email: email },
      }
    ).then((result) => {
      //console.log(result);
      if (result) {
        //토큰 데이터 지우기
        models.CD_Account_Token.destroy({
          where: { email: email },
        }).then((result2) => {
          //console.log(result);
          if (result2) {
            //토큰 데이터 지우기 destroy
            res.send({ success: true, message: "로그아웃 되었습니다." });
          } else {
            res.send({
              success: false,
              message: "토큰 삭제에 실패 하였습니다.",
            });
          }
        });
      } else {
        res.send({
          success: false,
          message: "자동 로그인 변경에 실패 하였습니다.",
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

//업로드 이미지
let uploadImg = async (req, res) => {
  //console.log(req.body);
  //res.json(req);
  /*
	var upImg = s3.array('files');

	upImg(req, res, function(err){      // 업로드 실행
		if(err){
			// 파일 업로드 중 오류 발생
			console.log(err);
		}else{
			//파일 업로드 성공
			console.log(req.files);
			console.log("location : " + "dealers/businessCard/" + req.files[0].key);
		}
	});
	/*
	const s3 = new AWS.S3({
		accessKeyId: req.app.get('AWS_ACCESS_KEY'),
		secretAccessKey: req.app.get('AWS_SECRET_ACCESS_KEY'),
		region : req.app.get('AWS_REGION')
	});

	let upload = multer({
		storage: multerS3({
			s3: s3,
			bucket: req.app.get('AWS_BUCKER'),
			key: function (request, file, cb) {
				console.log(file);
				let extension = path.extname(file.originalname);
				console.log('extension : ' + extension);
				cb(null, Date.now().toString() + extension);
			},
			acl: 'public-read-write',
		})
	});

	console.log(upload);
	*/
};

let pushEnabled = async (req, res) => {
  try {
    var enabled = req.body.enabled;
    var email = req.app.get("tokenEmail");

    models.CD_Account.update(
      {
        pushEnable: enabled,
      },
      {
        where: { email: email },
      }
    )
      .then((result) => {
        var resultData = { success: true, message: "푸시 변경 성공." };
        res.json(resultData);
      })
      .catch((err) => {
        console.log(err);
        res.send({ success: false, message: "푸시 변경 실패" });
      });
  } catch (err) {
    console.log(err);
  }
};

let deleteList = async (req, res) => {
  try {
    var id = Number(req.body.id);
    var email = req.app.get("tokenEmail");
    var deleteList = req.app.get("tokenDeleteList");

    if (!deleteList) {
      deleteList = new Array();
      deleteList.push(id);
    } else {
      deleteList.push(id);
    }

    models.CD_Account.update(
      {
        deleteList: JSON.stringify(deleteList),
      },
      {
        where: { email: email },
      }
    )
      .then((result) => {
        var resultData = { success: true, message: "삭제상품 등록 성공." };
        res.json(resultData);
      })
      .catch((err) => {
        console.log(err);
        res.send({ success: false, message: "삭제상품 등록 실패." });
      });
  } catch (err) {
    console.log(err);
  }
};

//주문
let order = async (req, res) => {
  try {
    var id = req.app.get("tokenId");
    var email = req.app.get("tokenEmail");
    var name = req.app.get("tokenName");
    var contact = req.app.get("tokenContact");

    var storeId = req.body.storeId;
    var payMethod = req.body.payMethod;
    var pg = "";
    var price = "";
    var orderName = "";
    var pgId = null; //pg 등록시 추가 작업 해야함.

    var query =
      " select * from CD_Order_Renew where resultReturnCode is null and accountId ='" +
      id +
      "'and vbank_date > " +
      moment().format("YYYYMMDDHHmm");
    var orderList = await models.sequelize.query(query, {});

    if (orderList[0][0]) {
      //res.send({success: "wait", message: "현재 진행중인 내역이 있습니다. 확인하여 주세요."});
      //var data = orderList[0];
      var resultData = {
        success: "wait",
        message: "현재 진행중인 내역이 있습니다. 확인하여 주세요.",
        //orderId: result.id,
        amount: orderList[0][0].payAmount,
        orderName: orderList[0][0].productName,
        vbank_date: orderList[0][0].vbank_date,
        payMethod: orderList[0][0].payMethod,
        caroom_account: "신한은행 140-012-764000",
        caroom_account_name: "(주)카룸 이호진",
      };
      res.json(resultData);
    } else {
      //store 에서 가격 및 구매권 검색
      const dataList = await models.CD_Store.findOne({
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
        ],
        where: {
          id: storeId,
        },
      });

      if (dataList) {
        request(
          {
            uri: "https://api.caroom.co.kr/encrypt",
            method: "POST",
            form: {
              value: name,
            },
          },
          function (err, response, body) {
            var resultBody = JSON.parse(body);
            if (resultBody.encrypt != "") {
              name = resultBody.encrypt;
            }

            price = dataList.price;
            orderName = dataList.name;
            vbank_date = moment().add("72", "hours").format("YYYYMMDDHHmm");
            //주문등록
            models.CD_Order_Renew.create({
              accountId: id,
              storeId: storeId,
              storeType: dataList.type,
              billType: "common",
              payMethod: "TRANSFER",
              payAmount: dataList.price,
              productName: dataList.name,
              vbank_date: moment().add("72", "hours").format("YYYYMMDDHHmm"), //라라벨 encrypt
            })
              .then((result) => {
                var resultData = {
                  success: true,
                  amount: result.payAmount,
                  orderName: result.productName,
                  vbank_date: result.vbank_date,
                  payMethod: result.payMethod,
                  caroom_account: "신한은행 140-012-764000",
                  caroom_account_name: "(주)카룸 이호진",
                };
                res.json(resultData);
              })
              .catch((err) => {
                console.log(err);
                res.send({ success: false, message: "order 추가 실패" });
              });
          }
        );
      } else {
        res.send({ success: false, message: "상품이 존재 하지 않습니다." });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

// 토큰이 리프레시 되었을때의 유저정보
let userInfo = async (req, res) => {
  try {
    var id = req.app.get("tokenId");
    //var email = req.app.get('tokenEmail');
    //var name = req.app.get('tokenName');
    //var company_name = req.app.get('tokenCompanyName');
    //var brand = req.app.get('tokenBrand');
    //var contact = req.app.get('tokenContact');
    var freePass = req.app.get("tokenFreePass");
    var passCard = req.app.get("tokenFreePassCard");

    //businessCard: "https://caroom-storage.s3.ap-northeast-2.amazonaws.com/"+dataList.businessCard

    const dataList = await models.CD_Account.findOne({
      attributes: [
        "id",
        "email",
        "fcmKey",
        "name",
        "contact",
        "os",
        "companyName",
        "brand",
        "blackEnable",
        "pushEnable",
        "businessCard",
        "normalCount",
        "freePass",
      ],
      where: {
        id: id,
      },
    });

    var resultData = {
      success: true,
      //message: null,
      //access_token: null,
      //refresh_token: null,
      //fcmKey: dataList.fcmKey,
      //os: dataList.os,
      accountId: dataList.id,
      company_name: dataList.companyName,
      brand: dataList.brand,
      push_enable: dataList.pushEnable,
      black_enable: dataList.blackEnable,
      businessCard:
        "https://caroom-storage.s3.ap-northeast-2.amazonaws.com/" +
        dataList.businessCard,
      passCard: passCard,
      normalCount: dataList.normalCount,
      freePass: dataList.freePass,
      contact: common.decrypt(dataList.contact, req),
      email: dataList.email,
      name: dataList.name,
    };

    res.json(resultData);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  cdAccountList: cdAccountList,
  cdAccountOne: cdAccountOne,
  cdAccountRegist: cdAccountRegist,
  cdAccountCert: cdAccountCert,
  cdAccountSendCert: cdAccountSendCert,
  uploadImg: uploadImg,
  cdAccountCheck: cdAccountCheck,
  cdAccountModifyPassword: cdAccountModifyPassword,
  cdAccountModifyInfo: cdAccountModifyInfo,
  logOut: logOut,
  reToken: reToken,
  pushEnabled: pushEnabled,
  deleteList: deleteList,
  order: order,
  cdAccountModifyPasswordNotLogin: cdAccountModifyPasswordNotLogin,
  userInfo: userInfo,
  checkRegularCard: checkRegularCard,
};
