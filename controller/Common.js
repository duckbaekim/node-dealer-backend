var crypto = require("crypto");
var aes256 = require("aes256");
var base64 = require("base-64");
const utf8 = require("utf8");
var moment = require("moment");
var request = require("request");

const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const { Encryptor } = require("strong-cryptor");

exports.decrypt = (data, req) => {
  const app_key = req.app.get("app_key");

  var json = base64.decode(data, "utf8");

  const dataParse = JSON.parse(json);

  //console.log(dataParse.iv);

  //var iv = dataParse.iv;
  var iv = new Buffer(dataParse.iv, "base64");
  //console.log(iv);
  //var value = dataParse.value;
  var value = new Buffer(dataParse.value, "base64");
  //console.log(value);
  //var mac = dataParse.mac;
  var mac = new Buffer(dataParse.mac, "base64");
  //console.log(mac);
  //var key = new Buffer("+laKQpvEb0IAAfPFcEzBp0NCgvCJVIJlZbM4VM0W6t8=", 'base64');
  var key = new Buffer(app_key, "base64");

  var dec = crypto.createDecipheriv("aes-256-cbc", key, iv);
  var dec_data = dec.update(value, "base64", "utf8") + dec.final("utf8");
  //console.log("------ aes-256-cbc start ------");
  //console.log(dec_data);
  //console.log("------ aes-256-cbc finish ------");
  var arr = dec_data.split(":");
  var returnText = arr[2].replace(/"/gim, "");
  returnText = returnText.replace(/;/gim, "");

  return returnText;
};

exports.encrypt = (data, req) => {
  const app_key = req.app.get("app_key");
  //console.log(app_key);
  /*
	var cipher = crypto.createCipher('aes-256-cbc', app_key);
	var crypted = cipher.update(data, 'utf8', 'base64');
	crypted += cipher.final('base64');
	*/
  //iv 램던 바이트 32 생성
  let IV_LENGTH = 32;
  let iv = crypto.randomBytes(IV_LENGTH);
  var ivstring = iv.toString("base64").slice(0, 16); //iv 값 string

  let ENCRYPTION_KEY = crypto
    .createHash("sha256")
    .update(String(app_key))
    .digest("base64")
    .substr(0, 32);
  let text = data;

  let key = new Buffer.from(ENCRYPTION_KEY);
  let plain = new Buffer.from(text);
  let cipher = crypto.createCipheriv("aes-256-cbc", key, ivstring);
  let encrypted = cipher.update(plain);
  //encrypted = Buffer.concat([encrypted, cipher.final()]);
  encrypted =
    cipher.update(String(plain), "utf8", "base64") + cipher.final("base64");
  return encrypted;
  //return iv.toString('base64') + ':' + encrypted.toString('base64');
};

//토큰 생성
exports.createToken = (checkAccount, req, mode) => {
  //설정한 시크릿값 가져오기
  const secret = req.app.get("jwt-secret");
  //현재시간(timestamp)
  const now = new Date().getTime();
  var nowTimeStamp = Math.round(now / 1000);
  console.log(req.body.email + "|login|토큰 생성 시작.");
  console.log(req.body.email + "|login|refresh 토큰 생성시작.");
  var user;

  if (mode == "access") {
    user = {
      email: checkAccount.email,
      companyName: checkAccount.companyName,
      name: checkAccount.name,
      sub: checkAccount.id,
      iss: "http://api.caroom.co.kr/",
      iat: nowTimeStamp,
      nbf: nowTimeStamp,
      jti: "",
      exp: Math.round(new Date(moment().add("1", "hours")).getTime() / 1000),
    };
  } else {
    user = {
      email: checkAccount.email,
      iss: "http://api.caroom.co.kr/",
      iat: nowTimeStamp,
      nbf: nowTimeStamp,
      jti: "",
      exp: Math.round(new Date(moment().add("30", "days")).getTime() / 1000),
    };
  }

  const token = jwt.sign(user, secret);

  return token;
};

//문자 전송
exports.sendSMS = (message, phoneNumber) => {
  let key = "JaCiSqENJiU1ot3";
  let sender = "18110804";
  let username = "carom";

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
      if (err) {
        console.log(err);
      }

      var resultBody = JSON.parse(body);
      if (resultBody.status == "0") {
        //전송 성공
      }
    }
  );
};

function getHash(string) {
  var hmac = crypto.createHmac("sha256", key);
  hmac.update(string);
  return hmac.digest("binary");
}
