var express = require("express");
var router = express.Router();
const IndexController = require("../controller");
const CdStoreController = require("../controller/CdStoreController");
const AuthController = require("../controller/dealers/AuthController");
const ListController = require("../controller/dealers/ListController");

//토큰 확인 하기 위한 미들 웨어
const { verifyToken } = require("./middlewares/authorization");

//
const s3 = require("./s3");
//

//console.log(controller);

/* GET home page. */
router.get("/", IndexController.index);

//CD_Store List
router.get("/cdStoreList", CdStoreController.cdStoreList);

//CR_Account List (딜러리스트)
router.get("/cdAccountList", AuthController.cdAccountList);

//CR_Account One(딜러 로그인)
//router.post("/cdAccountOne", verifyToken, AuthController.cdAccountOne);
router.post("/dealers/signIn", AuthController.cdAccountOne);

//CR_Account regist (딜러 회원가입) 가입시 인증 번호 전달
router.post("/dealers/sendCert", AuthController.cdAccountSendCert);

//회원 가입 (form data response 문제로 임시 중단)
router.post("/dealers/signUp", AuthController.cdAccountRegist);

//CR_Account cert (딜러 인증번호 확인)
router.post("/dealers/cert", AuthController.cdAccountCert);

//딜러앱 메인화면 조회이력
//router.get("/dealers/list/mine", ListController.listNewMine);

//딜러앱 메인화면 list new
router.post("/dealers/list", verifyToken, ListController.listNew);

//조회 목록
//router.get("/dealers/list/confirmList", verifyToken, ListController.confirmList);

//열람권

//이미지 업로드
router.post("/dealers/uploadImg", AuthController.uploadImg);

//딜러앱 메인화면 list 리스트 단일
router.post("/dealers/list/read", verifyToken, ListController.read);

//딜러앱 메인화면 list 한달안에 중복된 리스트 체크
router.post("/dealers/list/set", verifyToken, ListController.set);

//딜러앱 메인화면 baseInfo
router.get("/dealers/baseInfo", ListController.baseInfo);

//중복 회원 체크
router.post("/dealers/accountCheck", AuthController.cdAccountCheck);

//회원 비밀번호 변경
router.post(
  "/dealers/accountMfPwd",
  verifyToken,
  AuthController.cdAccountModifyPassword
);

//회원 비밀번호 변경 not login
router.post(
  "/dealers/defaultMfPwd",
  AuthController.cdAccountModifyPasswordNotLogin
);

//회원 일반 정보 변경
router.post(
  "/dealers/accountMfInfo",
  verifyToken,
  AuthController.cdAccountModifyInfo
);

//회원 일반 정보 변경
router.post("/dealers/logOut", verifyToken, AuthController.logOut);

//만료된 토큰 재발급
router.post("/dealers/reToken", AuthController.reToken);

//푸시 상태값 변경
router.post("/dealers/pushEnabled", verifyToken, AuthController.pushEnabled);

//조회 리스트 삭제
router.post("/dealers/deleteList", verifyToken, AuthController.deleteList);

//주문
router.post("/dealers/order", verifyToken, AuthController.order);

//주문 이력 조회 리스트
router.get("/dealers/orderList", verifyToken, ListController.orderList);

//주문 이력 상세 조회
router.post("/dealers/orderDetail", verifyToken, ListController.orderDetail);

// 열람권 조회
router.get("/dealers/orderTicket", verifyToken, ListController.orderTicket);

// 토큰이 리프레시 되었을때의 유저정보
router.get("/dealers/userInfo", verifyToken, AuthController.userInfo);

//결제 취소 요청
router.post(
  "/dealers/requestCancelOrder",
  verifyToken,
  ListController.requestCancelOrder
);

//정기결제 인지 아닌지 체크
router.get(
  "/dealers/checkRegularCard",
  verifyToken,
  AuthController.checkRegularCard
);

//정기구독 취소처리
router.get(
  "/dealers/cancelRegularOrder",
  verifyToken,
  ListController.cancelRegularOrder
);

module.exports = router;
