//mysql 연결객체 불러오기
// const { errorMonitor } = require('events');
require('dotenv').config({path : '../.env' });
// const jwt = require('jsonwebtoken');
//const { resolve } = require('path/posix');
const mod = require('./connection');
const qs = require('qs');
const con = mod.init(); //con => 연결객체
const axios = require('axios');
const { DATE } = require('mysql/lib/protocol/constants/types');
// const express = require('express');

const kakao = { //나중에 import로 유출방지
    clientID: '9e7627ff0adc857af4fd5e69de0222e6',
    clientSecret: '9F00S9wCb8X6cggmdqesUVTYoQeD41P4',
    redirectUri: 'http://34.64.207.117:3000/oauth'
}

exports.home = (req, res) =>{
    console.log('home');
    res.send('Welcome to CHUCAR!');
}
exports.show = (req, res) =>{
    console.log('show');
    con.query('SELECT * from contract_send order by ct_stat desc, ct_dt desc, ct_no desc', (error, rows) => {
        if(error) return res.status(404).json({err: 'Undefined error!'});
        res.json(rows);
    })
}
exports.isDealer = (req, res) => { // 딜러인지 알려주는 함수 딜러 1, 고객 0
    console.log('is Dealer');
    var date = new Date();
    findId = req.params.usr_id;
    console.log(findId);
    con.query(`SELECT pro_id from promst where pro_id = '${findId}' and pro_end >= ${date.getTime()/1000} limit 1`, (error, rows) => {
        if(error) return res.status(404).json({err: 'Undefined error!'});
        if(rows[0]) res.json(1);
        else res.json(0);
    })
}
exports.find_from_usrid = (req, res) =>{ // 내가 단 견적요청 보기 시에 불러올것 params => 회원번호
    console.log('find_contract_from_usrid');
    findId = req.params.usrid;
    con.query(`SELECT * from contract_send where ct_usrid = ${findId}  order by ct_stat desc, ct_dt desc, ct_no desc`, (error, rows, fields) => {
        if(error) return res.status(404).json({err: 'Undefined error!'});
        // if(!rows[0]) return res.status(404).json({err: 'Unknown usrid'});
        res.json(rows);
    })
}
exports.showReply = (req, res) =>{ //댓글 (견적서)들 모두 불러오기 params => 해당 견적신청서 번호
    console.log('showReply');
    cr_num = req.params.cr_num;
    con.query(`select * from contract_reply where cr_num = ${cr_num}`, (error, rows, fields) => {
        if(error) return res.status(404).json({err: 'Undefined error!'});
        res.json(rows);
    })
}
exports.contractFinish = async (req, res) =>{ //견적요청 마감치기
    try{
        console.log('contractFinish');
        const getStatus = await this.checkToken(req.headers.authorization);
        if(getStatus!=200){
            console.log('token fail');
            return res.status(401).json({err: 'token fail'});
        }
    }catch(err){
        return res.status(401).json({err: 'token fail'});
    }
    console.log('인증완료');
    ct_num = req.params.ct_num;
    console.log(ct_num)
    con.query(`update contract_send set ct_stat = 0 where ct_num = '${ct_num}'`, (error, rows, fields) => {
        if(error) return res.status(404).json({err: 'Undefined error!'});
        // if(!rows[0]) return res.status(404).json({err: 'Unknown usrid'});
        res.status(204).json({success:true});
    })
}
exports.contractInfo = (req, res) =>{ // 견적요청 상세보기
    console.log('contractInfo');
    ct_num = req.params.ct_num;
    con.query(`select * from contract_send where ct_num = ${ct_num}`, (error, rows, fields) => {
        if(error) return res.status(404).json({err: 'Undefined error!'});
        // if(!rows[0]) return res.status(404).json({err: 'Unknown usrid'});
        res.json(rows);
    })
}
exports.find_from_proid = async (req, res) =>{ // 내가 보낸 견적서가 달린 요청글들 띄우기
    console.log('find_contract_from_proid');
    findId = req.params.proid;
    con.query(`select * from contract_send where ct_num  in (
        SELECT cr_num as num from contract_reply where cr_proid = '${findId}')  order by ct_stat desc, ct_dt desc, ct_no desc`, (error, rows, fields) => {
        if(error) return res.status(404).json({err: 'Undefined error!'});
        // if(!rows[0]) return res.status(404).json({err: 'Unknown usrid'});
        return res.json(rows);
    })
}
exports.sendReply = async (req, res) =>{
    try{
        console.log('sendReply');
        const getStatus = await this.checkToken(req.headers.authorization);
        if(getStatus!=200){
            console.log('token fail');
            return res.status(401).json({err: 'token fail'});
        }
    }catch(err){
        return res.status(401).json({err: 'token fail'});
    }
    console.log('인증완료'); //클라랑 서버에서 딜러인지 한번씩 더 확인해야 할듯
    const member = {
        cr_title: req.body.cr_title,
        cr_num: req.body.cr_num, // 견적신청서고유번호
        cr_model: req.body.cr_model,
        cr_price: req.body.cr_price,
        cr_distance: req.body.cr_distance,
        cr_option: req.body.cr_option,
        cr_comment: req.body.cr_comment,  //답변
        img1: req.body.img1,
        img2: req.body.img2,
        img3: req.body.img3,
        img4: req.body.img4,
        img5: req.body.img5,
        img6: req.body.img6,
        img7: req.body.img7,
        img8: req.body.img8,
        proid: req.body.proid,
        cr_nickname: req.body.cr_nickname
    }
    con.query(`CALL RPY_CONTRACT('${member.cr_title}', '${member.cr_num}', '${member.cr_model}', '${member.cr_price}', '${member.cr_distance}', '${member.cr_option}', '${member.cr_comment}', '${member.img1}', '${member.img2}', '${member.img3}',
                                 '${member.img4}', '${member.img5}', '${member.img6}', '${member.img7}', '${member.img8}', '${member.proid}', '${member.cr_nickname}')`, (error, rows, fields) => {
        if(error) res.status(404).json(error);
        else res.status(201).json({success:true});
    })
}
exports.refreshToken = async(req,res) => { //토큰 갱신
        try{
            const refresh_token = req.headers.refresh_token;
            console.log('refreshing...');
            newToken = await axios({
                method: 'POST',
                url: 'https://kauth.kakao.com/oauth/token',
                headers:{
                    'content-type':'application/x-www-form-urlencoded;charset=utf-8'
                },
                data:qs.stringify({
                    grant_type: 'refresh_token',//특정 스트링
                    client_id:'9e7627ff0adc857af4fd5e69de0222e6',
                    refresh_token:refresh_token,
                    client_secret:'9F00S9wCb8X6cggmdqesUVTYoQeD41P4'
                })//객체를 string 으로 변환
            })
            res.json(newToken.data);
        }catch(err){
            console.log(err);
            res.json(0);
        }
}

//앱 사용자만 접근 가능하게함 +외부 공격 일부 차단
exports.checkToken = async(token) => {
    try{
        console.log('check this token...');
        getStatus = await axios({
            method: 'get',
            url: 'https://kapi.kakao.com/v2/user/me',
            headers:{
                Authorization: `Bearer ${token}`,
                'content-type':'application/x-www-form-urlencoded;utf-8'
            }
        })
        console.log(getStatus.status);
        return getStatus.status;
    }catch(err){
        return 0;
    }
}
// 프론트에서 토큰값을 헤더에 껴서 보내면 카카오 api 를 이용하여 정보 확인 받은 후 프론트에게 전달
exports.showInfo = async(req, res) => {
    try{
        const token = req.headers.authorization; 
        console.log(token);
        tokenInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers:{
                Authorization: `Bearer ${token}`,
                'content-type':'application/x-www-form-urlencoded;utf-8'
            }
        })
        const properties = {
            id: tokenInfo.data.id,
            nickname: tokenInfo.data.properties.nickname
        }
        console.log(tokenInfo.data.id);
        console.log(properties.nickname);
        res.json(properties);
    }catch(err){
        console.log(err);
        res.json('server say : false');
    }
}
// 고객 정보 반환 해주는 함수(params : 회원번호)
exports.get_pro = async(req, res) => {
    try{
        console.log('get_pro');
        const getStatus = await this.checkToken(req.headers.authorization);
        if(getStatus!=200){
            console.log('token fail');
            return res.status(401).json({err: 'token fail'});
        }
    }catch(err){
        return res.status(401).json({err: 'token fail'});
    }
    console.log('인증완료');
    pro_id = req.params.pro_id; //작성자아이디
    con.query(`select * from promst where pro_id = '${pro_id}'`, (error, rows, fields) => {
        if(error) res.status(404).json(error);
        res.json(rows);
    })
}
// 딜러 정보 반환 해주는 함수(params : 회원번호)
exports.get_usr = async(req, res) => {
    try{
        console.log('get_usr');
        const getStatus = await this.checkToken(req.headers.authorization);
        if(getStatus!=200){
            console.log('token fail');
            return res.status(401).json({err: 'token fail'});
        }
    }catch(err){
        return res.status(401).json({err: 'token fail'});
    }
    console.log('인증완료');
    usr_id = req.params.usr_id; //작성자아이디
    con.query(`select * from usrmst where usrid = '${usr_id}'`, (error, rows, fields) => {
        if(error) res.status(404).json(error);
        res.json(rows);
    })
}
// 딜러 회원가입 함수(params : 회원번호)
exports.pro_signup = async(req, res) => {
    try{
        console.log('pro_signup');
        const getStatus = await this.checkToken(req.headers.authorization);
        if(getStatus!=200){
            console.log('token fail');
            return res.status(401).json({err: 'token fail'});
        }
    }catch(err){
        return res.status(401).json({err: 'token fail'});
    }
    console.log('인증완료');
    const newPro = { //글자수 제한 ㅍ론트에서 요청할것
        id: req.body.id, // id varchar(20)
        password: req.body.password, // 비밀번호
        name: req.body.name, // 이름
        phone: req.body.phone, // 전화번호 varchar(11)
        email: req.body.email, // 이메일
        card: req.body.card, // 사원증
        face: req.body.face, // 프사
        addr: req.body.addr, // 회사주소
        code: req.body.code, // varchar(6) 추천코드
        prv1: req.body.prv1, //int
        prv2: req.body.prv2, //int
        prv3: req.body.prv3 //int
    }
    con.query(`CALL REG_PRO('${newPro.id}', '${newPro.password}', '${newPro.name}', '${newPro.phone}', '${newPro.email}',
                                 '${newPro.card}', '${newPro.face}', '${newPro.addr}', '${newPro.code}',
                                 '${newPro.prv1}', '${newPro.prv2}', '${newPro.prv3}')`, (error, rows, fields) => {
        if(error) res.status(404).json(error);
        res.status(201).json({success:true});
    })
}

exports.usr_signup = async(req, res) => {
    try{
        console.log('usr_signup');
        const getStatus = await this.checkToken(req.headers.authorization);
        if(getStatus!=200){
            console.log('token fail');
            return res.status(401).json({err: 'token fail'});
        }
    }catch(err){
        return res.status(401).json({err: 'token fail'});
    }
    console.log('인증완료');
    const newUsr = { // 프론트에서 요청할것
        id: req.body.id, // id varchar(20)
        password: req.body.password, // 비밀번호
        nickname: req.body.nickname, // 이름
        email: req.body.email, // 이메일
        phone: req.body.phone, // 전화번호 varchar(11)
        prv1: req.body.prv1, //int
        prv2: req.body.prv2, //int
        prv3: req.body.prv3 //int
    }
    con.query(`CALL REG_USER('${newUsr.id}', '${newUsr.password}', '${newUsr.name}', '${newUsr.email}', '${newUsr.phone}',
                                 '${newUsr.prv1}', '${newUsr.prv2}', '${newUsr.prv3}', @iserr)`, (error, rows, fields) => {
        if(error) res.status(404).json(error);
        res.status(201).json({success:true});
    })
}

exports.logout = async (req,res) => { //로그아웃
    try{
        console.log("logout");
        const getStatus =  await axios({
          url: "https://kapi.kakao.com/v1/user/logout",
          method: "post", // POST method
          headers: {
              Authorization: `Bearer ${req.headers.authorization}`,
              "Content-Type": "application/x-www-form-urlencoded"
          }
        });
        return res.json(getStatus.status);
    }catch(err){
        return res.status(400).json(err.data);
    }
}

exports.imageUpload = async (req, res) => { // 이미지 파일 db에 저장

}

exports.contractSend = async (req,res) => { //견적요청 전송
    try{
        console.log('contractsend')
        const getStatus = await this.checkToken(req.headers.authorization);
        if(getStatus!=200){
            console.log('token fail');
            return res.status(401).json({err: 'token fail'});
        }
    }catch(err){
        return res.status(401).json({err: 'token fail'});
    }
    console.log('인증완료');
    const contract = { //글자수 제한 ㅍ론트에서 요청할것
        ct_kind: parseInt(req.body.ct_kind), //결제종류
        ct_model: req.body.ct_model, //모델
        ct_title: req.body.ct_title, //세부모델
        ct_content: req.body.ct_content,
        ct_price: req.body.ct_price, //가격
        ct_distance: req.body.ct_distance, //주행거리
        ct_option: req.body.ct_option,
        ct_usrid: req.body.ct_usrid //작성자아이디
    }
    con.query(`CALL SND_CONTRACT('${contract.ct_kind}', '${contract.ct_model}', '${contract.ct_title}',
                                 '${contract.ct_content}', '${contract.ct_price}', '${contract.ct_distance}',
                                 '${contract.ct_option}', '${contract.ct_usrid}')`, (error, rows, fields) => {
        if(error) {
            res.status(404).json(error);
            console.log(error.data);
        }
        else {
            res.status(201).json({success:true});
            console.log('success');
        }
    })
}

exports.billings = async (req, res) => { // 빌링키 요청
    try {
        console("req billings...");
      const { customer_uid } = req.body; // req body에서 customer_uid 추출
      console.log(customer_uid);
      const getToken = await axios({
        url: "https://api.iamport.kr/users/getToken",
        method: "post", // POST method
        headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
        data: {
          imp_key: "0522871454882836", // REST API 키
          imp_secret: "e9c0f18efc363ffa7c0721f42b6bde807bea6975f896919e29c367c2ea32f1d7a7d3e3c807f13a4b" // REST API Secret
        }
      });
      var date = new Date();
      const {access_token} = getToken.data.response;
      console.log(access_token);
      await axios({
        url: `https://api.iamport.kr/subscribe/payments/schedule`,
        method: "post",
        headers: { "Authorization": access_token }, // 인증 토큰 Authorization header에 추가
        data: {
          customer_uid: customer_uid, // 카드(빌링키)와 1:1로 대응하는 값
          schedules: [
            {
              merchant_uid: (date.getTime()/1000)+60, // 주문 번호
              schedule_at: (date.getTime()/1000)+60, // 결제 시도 시각 in Unix Time Stamp. 예: 다음 달 1일
              amount: 200,
              name: "월간 이용권 정기결제",
            //   buyer_name: "홍길동",
            //   buyer_tel: "01012345678",
            //   buyer_email: "gildong@gmail.com"
            }
          ]
        }
      });
    } catch (err) {
      res.status(400).send(err);
    }
}

exports.schedule = async (req, res) => {
  try {
    console.log("schedule");
    const { imp_uid, merchant_uid } = req.body;
    // 액세스 토큰(access token) 발급 받기
    const getToken = await axios({
    url: "https://api.iamport.kr/users/getToken",
    method: "post", // POST method
    headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
    data: {
      imp_key: "0522871454882836", // REST API 키
      imp_secret: "e9c0f18efc363ffa7c0721f42b6bde807bea6975f896919e29c367c2ea32f1d7a7d3e3c807f13a4b" // REST API Secret
    }
    });
    const { access_token } = getToken.data.response; // 인증 토큰
    // imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
      method: "get", // GET method
      headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
    });
    const paymentData = getPaymentData.data.response; // 조회한 결제 정보
    const { status } = paymentData;
    if (status === "paid") { // 결제 성공적으로 완료
    // DB에 결제 정보 저장
    console.log('결제성공!!')
    const getMerchant = await axios({ //결제결과 저장 및 다음 주문번호 발급
        url: "http://34.64.207.117:3000/payments/save",
        method: "POST",
        data: {
            paymentData:paymentData
        }
    }).catch(function(err){console.log(err)})
    console.log('db저장성공!!')
    next_merchant_uid = getMerchant.data[0].uid
    console.log("다음 주문 예약 : "+next_merchant_uid)
    var date = new Date();
    await axios({
      url: `https://api.iamport.kr/subscribe/payments/schedule`,
      method: "post",
      headers: { "Authorization": access_token }, // 인증 토큰 Authorization header에 추가
      data: {
        customer_uid: next_merchant_uid.substr(1,10), // 카드(빌링키)와 1:1로 대응하는 값
        schedules: [
          {
            merchant_uid: next_merchant_uid, // 주문 번호
            schedule_at: (date.getTime()/1000)+60, // 결제 시도 시각 in Unix Time Stamp. 예: 다음 달 1일
            amount: 100,
            name: "월간 이용권 정기결제",
          //   buyer_name: "홍길동",
          //   buyer_tel: "01012345678",
          //   buyer_email: "gildong@gmail.com"
          }
        ]
      }
    });
    console.log("3일 후 결제 예약");
    res.status(200).send();
    } else {
        console.log("결제실패... 3일 후 결제 예약");
        await axios({
          url: `https://api.iamport.kr/subscribe/payments/schedule`,
          method: "post",
          headers: { "Authorization": access_token }, // 인증 토큰 Authorization header에 추가
          data: {
            customer_uid: next_merchant_uid.substr(1,10), // 카드(빌링키)와 1:1로 대응하는 값
            schedules: [
              {
                merchant_uid: next_merchant_uid, // 주문 번호
                schedule_at: (date.getTime()/1000)+60, // 결제 시도 시각 in Unix Time Stamp. 예: 다음 달 1일
                amount: 100,
                name: "월간 이용권 정기결제",
              //   buyer_name: "홍길동",
              //   buyer_tel: "01012345678",
              //   buyer_email: "gildong@gmail.com"
              }
            ]
          }
        });
        res.status(401).send();
    }
} catch (err) {
    res.status(400).send(err);
}
}

exports.unschedule = async (req, res) => {
    try{
        console.log("unschedule...");
        const { customer_uid } = req.body;
        const getToken = await axios({
          url: "https://api.iamport.kr/users/getToken",
          method: "post", // POST method
          headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
          data: {
            imp_key: "0522871454882836", // REST API 키
            imp_secret: "e9c0f18efc363ffa7c0721f42b6bde807bea6975f896919e29c367c2ea32f1d7a7d3e3c807f13a4b" // REST API Secret
          }
        });
        const {access_token} = getToken.data.response;

        await axios({
          url: `https://api.iamport.kr/subscribe/payments/unschedule`,
          method: "post",
          headers: { "Authorization": access_token }, // 인증 토큰 Authorization header에 추가
          data: {
          customer_uid: customer_uid // 카드(빌링키)와 1:1로 대응하는 값
          }
      });
    }catch(err){
        res.status(400).send(err);
    }
}
exports.getMerchantUid = async (req, res) => {
    try{
        console.log('getMerchantUid');
        const getStatus = await this.checkToken(req.headers.authorization);
        if(getStatus!=200){
            console.log('token fail');
            return res.status(401).json({err: 'token fail'});
        }
    }catch(err){
        return res.status(401).json({err: 'token fail'});
    }
    console.log('인증완료');
    const {code, customer_uid} = req.body;
    console.log(code)
    console.log(customer_uid)
    con.query(`select CONCAT('${code}','${customer_uid}',
               GET_ODNO('${code}','${customer_uid}')) uid from dual`, (error, rows, fields) => {
        if(error) res.status(404).json(error);
        else {
            res.json(rows[0].uid);
        }
    })
}
exports.savePayment = async (req, res) => {
    console.log('savePayment');
    const {paymentData} = req.body;
    const goodId = paymentData.merchant_uid.substr(0,1);
    const memberNo = paymentData.merchant_uid.substr(1,10);
    const odno = paymentData.merchant_uid.substr(11,4);

    con.query(`insert into pro_payments value(
               '${goodId}', '${memberNo}', '${odno}', '${memberNo}', '${paymentData.pay_method}', '${paymentData.amount}',
               ${paymentData.cancel_amount}, '${paymentData.paid_at}', '${paymentData.card_name}', '${paymentData.imp_uid}',
               default, default)`, (error, rows, fields) => {
        if(error) res.status(404).json(error);
    })
    if(odno == '0001'){
        var date = new Date();
        con.query(`insert into promst (pro_id, pro_start, pro_end) value(
                  '${memberNo}', '${(date.getTime()/1000)}','${(date.getTime()/1000)+60}')`, (error, rows, fields) => {
            if(error) res.status(404).json(error);
        })
    }else {
        var date = new Date();
        con.query(`update promst set pro_end = '${(date.getTime()/1000)+60}' where pro_id = '${memberNo}'`, (error, rows, fields) => {
            if(error) res.status(404).json(error);
        })
    }
    con.query(`select CONCAT('${goodId}','${memberNo}',
               GET_ODNO('${goodId}','${memberNo}')) uid from dual`, (error, rows, fields) => {
        if(error) res.status(404).json(error);
        else {
            res.json(rows);
        }
    })
}