const User = require("../model/user");
const Contract = require("../model/contract");
const Reply = require("../model/reply");
const Car = require("../model/car");
const axios = require('axios');
const qs = require('qs');

module.exports = {
  home: (req, res) => {
    console.log('home');
    return res.status(200).send('Welcome to CHUCAR!');
  },

  searchContract: async (req, res) => {
    try {
      //  + model 로 변환 로직 구현
      rows = await Contract.search(req.query); //query params 전달
      return res.status(200).json(rows);
    }
    //status 보내기
    catch(err){ res.json(err); }
  },

  setPro: async (req, res) => {
    try {
      rows = await Contract.searchAllContract();
      //  + model 로 변환 로직 구현
      return res.json(rows);
    }
    catch(err){ return err; }
  },

  // setPro: async (req, res) => { // 딜러 정보 생성, 갱신
  //   console.log('setPro');
  //   date = new Date();
  //   const pro = {
  //     id: req.body.id,
  //     name: req.body.name||'',
  //     phone: req.body.phone||'',
  //     email: req.body.email||'',
  //     idcard: req.body.idcard||'',
  //     company: req.body.company||'',
  //     prv1: req.body.prv1||'0',
  //     prv2: req.body.prv2||'0',
  //     prv3: req.body.prv3||'0'
  //   }
  
  //   pool.getConnection(function(err, con) {
  //     if(err){
  //       throw err;
  //     } else {
  //         con.query(`call REG_PRO('${pro.id}', '${pro.name}', '${pro.phone}', '${pro.email}', '${pro.idcard}',
  //                   '${pro.company}', '${pro.prv1}', '${pro.prv2}', '${pro.prv3}', '${date.getTime()/1000}')`, (error, rows) => {
  //             if(error) return res.status(404).json({err: 'Undefined error!'});
  //             else return res.json(1);
  //         })
  //       }
  //     con.release();
  //   });
  // },

  // setProfile: async (req, res) => {
  //   try {
  //     rows = await Contract.searchAllContract();
  //     //  + model 로 변환 로직 구현
  //     return res.json(rows);
  //   }
  //   catch(err){ return err; }
  // },

  // setProfile: async (req, res) => { // 프로필 사진 변경
  //   console.log('set profile')
  //   const pro_id = req.params.pro_id;
  //   const {profile} = req.body;
  
  //   pool.getConnection(function(err, con) {
  //     if(err){
  //       throw err;
  //     } else {
  //         con.query(`UPDATE promst set pro_profile = '${profile}' where pro_id = '${pro_id}'`, (error, rows) => {
  //           if(error) return res.status(404).json({err: 'Undefined error!'});
  //           else return res.json(1);
  //         })
  //       }
  //     con.release();
  //   });
  // },

  // isDealer: (req, res) => {
  //   try {
  //     rows = await Contract.searchAllContract();
  //     //  + model 로 변환 로직 구현
  //     return res.json(rows);
  //   }
  //   catch(err){ return err; }
  // },
  
  // isDealer: (req, res) => { // 딜러인지 알려주는 함수 딜러 1, 고객 0, 구독중인 딜러는 2
  //   console.log('is Dealer');
  //   findId = req.params.usr_id;
  //   console.log(findId);
  //   if(findId=='undefined') return res.json(findId);
  //   else {
  //     pool.getConnection(function(err, con) {
  //       if(err){
  //         throw err;
  //       } else {
  //           con.query(`SELECT pro_end from promst where pro_id = '${findId}'`, (error, rows) => {
  //             if(error) return res.status(404).json({err: 'Undefined error!'});
  //             if(rows[0]){
  //               var date = new Date();
  //               if(rows[0].pro_end >= date.getTime()/1000) return res.json(2);
  //               else return res.json(1);
  //             }
  //             else return res.json(0);
  //           })
  //         }
  //       con.release();
  //     });
  //   }
  // },
  
  // showReply: (req, res) => {
  //   try {
  //     rows = await Contract.searchAllContract();
  //     //  + model 로 변환 로직 구현
  //     return res.json(rows);
  //   }
  //   catch(err){ return err; }
  // },

  // showReply: (req, res) =>{ //댓글 (견적서)들 모두 불러오기 params => 해당 견적신청서 번호
  //   console.log('showReply');
  //   cr_num = req.params.cr_num;
  
  //   pool.getConnection(function(err, con) {
  //     if(err){
  //       throw err;
  //     } else {
  //         con.query(`SELECT * from contract_reply, promst
  //                   where cr_num = ${cr_num} and cr_proid = promst.pro_id
  //                   order by cr_dttm desc`, (error, rows, fields) => {
  //           if(error) return res.status(404).json({err: 'Undefined error!'});
  //           else res.json(rows);
  //         })
  //       }
  //     con.release();
  //   });
  // },

  // contractFinish: async (req, res) => {
  //   try {
  //     rows = await Contract.searchAllContract();
  //     //  + model 로 변환 로직 구현
  //     return res.json(rows);
  //   }
  //   catch(err){ return err; }
  // },

  // contractFinish: async (req, res) =>{ //견적요청 마감치기
  //   try{
  //     console.log('contractFinish');
  //     const getStatus = await this.checkToken(req.headers.authorization);
  //     if(getStatus!=200){
  //       return res.status(401).json({err: 'token fail'});
  //     }
  //   }catch(err){return res.status(401).json({err: 'token fail'});}
  //   console.log('인증완료');
  //   ct_num = req.params.ct_num;
  
  
  //   pool.getConnection(function(err, con) {
  //     if(err){
  //       throw err;
  //     } else {
  //         con.query(`update contract_send set ct_stat = 0 where ct_num = '${ct_num}'`, (error, rows, fields) => {
  //           if(error) return res.status(404).json({err: 'Undefined error!'});
  //           // if(!rows[0]) return res.status(404).json({err: 'Unknown usrid'});
  //           else return res.status(204).json({success:true});
  //         })
  //       }
  //     con.release();
  //   });
  // },

  // contractInfo: (req, res) => {
  //   try {
  //     rows = await Contract.searchAllContract();
  //     //  + model 로 변환 로직 구현
  //     return res.json(rows);
  //   }
  //   catch(err){ return err; }
  // },

  // contractInfo: (req, res) =>{ // 견적요청 상세보기
  //   console.log('contractInfo');
  //   ct_num = req.params.ct_num;
  
  //   pool.getConnection(function(err, con) {
  //     if(err){
  //       throw err;
  //     } else {
  //         con.query(`select * from contract_send where ct_num = ${ct_num}`, (error, rows, fields) => {
  //           if(error) return res.status(404).json({err: 'Undefined error!'});
  //           else return res.json(rows);
  //         })
  //       }
  //     con.release();
  //   });
  // },

  // showReply: async (req, res) => {
  //   try {
  //     rows = await Contract.searchAllContract();
  //     //  + model 로 변환 로직 구현
  //     return res.json(rows);
  //   }
  //   catch(err){ return err; }
  // },

  // showReply: async (req, res) =>{
  //   try{
  //     console.log('sendReply');
  //     const getStatus = await this.checkToken(req.headers.authorization);
  //     if(getStatus!=200){
  //       console.log('token fail');
  //       return res.status(401).json({err: 'token fail'});
  //     }
  //   }catch(err){return res.status(401).json({err: 'token fail'});}
  //   console.log('인증완료'); //클라랑 서버에서 딜러인지 한번씩 더 확인해야 할듯
  
  //   const member = {
  //     cr_title: req.body.cr_title,
  //     cr_num: req.body.cr_num, // 견적신청서고유번호
  //     cr_year: req.body.cr_year,
  //     cr_price: req.body.cr_price,
  //     cr_distance: req.body.cr_distance,
  //     cr_option: req.body.cr_option,
  //     cr_comment: req.body.cr_comment,  //답변
  //     img0: req.body.img0,
  //     img1: req.body.img1,
  //     img2: req.body.img2,
  //     img3: req.body.img3,
  //     img4: req.body.img4,
  //     img5: req.body.img5,
  //     img6: req.body.img6,
  //     img7: req.body.img7,
  //     proid: req.body.proid
  //   }
  
  //   pool.getConnection(function(err, con) {
  //     if(err){
  //       throw err;
  //     } else {
  //         con.query(`CALL RPY_CONTRACT('${member.cr_title}', '${member.cr_num}', '${member.cr_year}',
  //                   '${member.cr_price}', '${member.cr_distance}','${member.cr_option}', '${member.cr_comment}',
  //                   '${member.img0}', '${member.img1}', '${member.img2}', '${member.img3}', '${member.img4}',
  //                   '${member.img5}', '${member.img6}', '${member.img7}', '${member.proid}')`, (error, rows, fields) => {
  //           if(error) return res.status(404).json(error);
  //           else return res.status(201).json({success:true});
  //         })
  //       }
  //     con.release();
  //   });
  // },

  // refreshToken: async (req, res) => {
  //   try {
  //     rows = await Contract.searchAllContract();
  //     //  + model 로 변환 로직 구현
  //     return res.json(rows);
  //   }
  //   catch(err){ return err; }
  // },


  // refreshToken: async (req,res) => { //토큰 갱신
  //   try{
  //     const refresh_token = req.headers.refresh_token;
  //     console.log('refreshing...');
  //     newToken = await axios({
  //       method: 'POST',
  //       url: 'https://kauth.kakao.com/oauth/token',
  //       headers:{'content-type':'application/x-www-form-urlencoded;charset=utf-8'},
  //       data:qs.stringify({
  //         grant_type: 'refresh_token',//특정 스트링
  //         client_id: process.env.client_id,
  //         refresh_token: refresh_token,
  //         client_secret: process.env.client_secret
  //       })//객체를 string 으로 변환
  //     })
  //     return res.json(newToken.data);
  //   }catch(err){ return res.json(0); }
  // },

  // checkToken: async (token) => {
  //   try {
  //     rows = await Contract.searchAllContract();
  //     //  + model 로 변환 로직 구현
  //     return res.json(rows);
  //   }
  //   catch(err){ return err; }
  // },

  // //앱 사용자만 접근 가능하게함 +외부 공격 일부 차단
  // checkToken: async(token) => {
  //   try{
  //     console.log('check this token...');
  //     getStatus = await axios({
  //       method: 'get',
  //       url: 'https://kapi.kakao.com/v2/user/me',
  //       headers:{
  //         Authorization: `Bearer ${token}`,
  //         'content-type':'application/x-www-form-urlencoded;utf-8'
  //       }
  //     })
  //     console.log(getStatus.status);
  //     return getStatus.status;
  //   }catch(err){ return 0; }
  // },

  // showInfo: async (req, res) => {
  //   try {
  //     rows = await Contract.searchAllContract();
  //     //  + model 로 변환 로직 구현
  //     return res.json(rows);
  //   }
  //   catch(err){ return err; }
  // },

  // // 프론트에서 토큰값을 헤더에 껴서 보내면 카카오 api 를 이용하여 정보 확인 받은 후 프론트에게 전달
  // showInfo: async(req, res) => {
  //   try{
  //     const token = req.headers.authorization; 
  //     console.log(token);
  //     tokenInfo = await axios({
  //       method: 'get',
  //       url: 'https://kapi.kakao.com/v2/user/me',
  //       headers:{
  //         Authorization: `Bearer ${token}`,
  //         'content-type':'application/x-www-form-urlencoded;utf-8'
  //       }
  //     })
  //     const properties = {
  //       id: tokenInfo.data.id,
  //       nickname: tokenInfo.data.properties.nickname
  //     }
  //     // console.log(tokenInfo.data.id);
  //     console.log(properties.id);
  //     console.log(properties.nickname);
  //     return res.json(properties);
  //   }catch(err){ return res.json('false'); }
  // },

  // get_pro: async (req, res) => {
  //   try {
  //     rows = await Contract.searchAllContract();
  //     //  + model 로 변환 로직 구현
  //     return res.json(rows);
  //   }
  //   catch(err){ return err; }
  // },

  // // 딜러 정보 반환 해주는 함수(params : 회원번호)
  // get_pro: async(req, res) => {
  //   try{
  //     console.log('get_pro');
  //     const getStatus = await this.checkToken(req.headers.authorization);
  //     if(getStatus!=200){
  //       console.log('token fail');
  //       return res.status(401).json({err: 'token fail'});
  //     }
  //   }catch(err){return res.status(401).json({err: 'token fail'});}
  //   console.log('인증완료');
  
  //   pro_id = req.params.pro_id; //작성자아이디
  
  //   pool.getConnection(function(err, con) {
  //     if(err){
  //       throw err;
  //     } else {
  //         con.query(`select * from promst where pro_id = '${pro_id}'`, (error, rows, fields) => {
  //           if(error) return res.status(404).json(error);
  //           else return res.json(rows);
  //         })
  //       }
  //     con.release();
  //   });
  // },

  // pro_signup: async (req, res) => {
  //   try {
  //     rows = await Contract.searchAllContract();
  //     //  + model 로 변환 로직 구현
  //     return res.json(rows);
  //   }
  //   catch(err){ return err; }
  // },

  // pro_signup: async(req, res) => {
  //   try{
  //     console.log('pro_signup');
  //     const getStatus = await this.checkToken(req.headers.authorization);
  //     if(getStatus!=200){
  //       console.log('token fail');
  //       return res.status(401).json({err: 'token fail'});
  //     }
  //   }catch(err){return res.status(401).json({err: 'token fail'});}
  //   console.log('인증완료');
  //   const newPro = { //글자수 제한 ㅍ론트에서 요청할것
  //     id: req.body.id, // id varchar(20)
  //     password: req.body.password, // 비밀번호
  //     name: req.body.name, // 이름
  //     phone: req.body.phone, // 전화번호 varchar(11)
  //     email: req.body.email, // 이메일
  //     card: req.body.card, // 사원증
  //     face: req.body.face, // 프사
  //     addr: req.body.addr, // 회사주소
  //     code: req.body.code, // varchar(6) 추천코드
  //     prv1: req.body.prv1, //int
  //     prv2: req.body.prv2, //int
  //     prv3: req.body.prv3 //int
  //   }
  
  //   pool.getConnection(function(err, con) {
  //     if(err){
  //       throw err;
  //     } else {
  //         con.query(`CALL REG_PRO('${newPro.id}', '${newPro.password}', '${newPro.name}', '${newPro.phone}', '${newPro.email}',
  //                   '${newPro.card}', '${newPro.face}', '${newPro.addr}', '${newPro.code}',
  //                   '${newPro.prv1}', '${newPro.prv2}', '${newPro.prv3}')`, (error, rows, fields) => {
  //           if(error) return res.status(404).json(error);
  //           else return res.status(201).json({success:true});
  //         })
  //       }
  //     con.release();
  //   });
  // },

  // usr_signup: async (req, res) => {
  //   try {
  //     rows = await Contract.searchAllContract();
  //     //  + model 로 변환 로직 구현
  //     return res.json(rows);
  //   }
  //   catch(err){ return err; }
  // },

  // usr_signup: async(req, res) => {
  //   try{
  //     console.log('usr_signup');
  //     const getStatus = await this.checkToken(req.headers.authorization);
  //     if(getStatus!=200){
  //       console.log('token fail');
  //       return res.status(401).json({err: 'token fail'});
  //     }
  //   }catch(err){return res.status(401).json({err: 'token fail'});}
  //   console.log('인증완료');
  //   const newUsr = { // 프론트에서 요청할것
  //     id: req.body.id, // id varchar(20)
  //     password: req.body.password, // 비밀번호
  //     nickname: req.body.nickname, // 이름
  //     email: req.body.email, // 이메일
  //     phone: req.body.phone, // 전화번호 varchar(11)
  //     prv1: req.body.prv1, //int
  //     prv2: req.body.prv2, //int
  //     prv3: req.body.prv3 //int
  //   }
  
  //   pool.getConnection(function(err, con) {
  //     if(err){
  //       throw err;
  //     } else {
  //         con.query(`CALL REG_USER('${newUsr.id}', '${newUsr.password}', '${newUsr.name}', '${newUsr.email}', '${newUsr.phone}',
  //                   '${newUsr.prv1}', '${newUsr.prv2}', '${newUsr.prv3}', @iserr)`, (error, rows, fields) => {
  //           if(error) return res.status(404).json(error);
  //           else return res.status(201).json({success:true});
  //         })
  //       }
  //     con.release();
  //   });
  // },

  // logout: async (req, res) => {
  //   try {
  //     rows = await Contract.searchAllContract();
  //     //  + model 로 변환 로직 구현
  //     return res.json(rows);
  //   }
  //   catch(err){ return err; }
  // },

  // logout: async (req,res) => { //로그아웃
  //   try{
  //     console.log("logout");
  //     const getStatus =  await axios({
  //       url: "https://kapi.kakao.com/v1/user/logout",
  //       method: "post", // POST method
  //       headers: {
  //         Authorization: `Bearer ${req.headers.authorization}`,
  //         "Content-Type": "application/x-www-form-urlencoded"
  //       }
  //     });
  //     return res.json(getStatus.status);
  //   }catch(err){ return res.status(400).json(err.data); }
  // },

  // getCarInfo: async (req, res) => {
  //   try {
  //     rows = await Contract.searchAllContract();
  //     //  + model 로 변환 로직 구현
  //     return res.json(rows);
  //   }
  //   catch(err){ return err; }
  // },

  // getCarInfo: async (req, res) => { // 자동차 브랜드 전송
  //   console.log('getCarInfo');
  
  //   if(req.query.brand){
  //     const cf_brand = decodeURIComponent(req.query.brand);
  
  //     pool.getConnection(function(err, con) {
  //       if(err){
  //         throw err;
  //       } else {
  //           con.query(`select distinct CF_MODEL from car_info_upload where CF_BRAND = '${cf_brand}'`, (error, rows, fields) => {
  //             if(error) return res.json(error);
  //             else return res.json(rows);
  //           })
  //         }
  //       con.release();
  //     });
  //   }
  //   else {
  //     pool.getConnection(function(err, con) {
  //       if(err){
  //         throw err;
  //       } else {
  //           con.query('select distinct CF_BRAND from car_info_upload', (error, rows, fields) => {
  //             if(error) return res.json(error);
  //             else return res.json(rows);
  //           })
  //         }
  //       con.release();
  //     });
  //   }
  // },

  // contractSend: async (req, res) => {
  //   try {
  //     rows = await Contract.searchAllContract();
  //     //  + model 로 변환 로직 구현
  //     return res.json(rows);
  //   }
  //   catch(err){ return err; }
  // },

  // contractSend: async (req,res) => { //견적요청 전송
  //   try{
  //     console.log('contractsend')
  //     const getStatus = await this.checkToken(req.headers.authorization);
  //     if(getStatus!=200){
  //       console.log('token fail');
  //       return res.status(401).json({err: 'token fail'});
  //     }
  //     }catch(err){return res.status(401).json({err: 'token fail'});}
  //     console.log('인증완료');
  
  //   const contract = { //글자수 제한 ㅍ론트에서 요청할것
  //     ct_kind: parseInt(req.body.ct_kind), //신차,중고차,렌트,리스 구분번호
  //     ct_brand: req.body.ct_brand, //브랜드
  //     ct_model: req.body.ct_model, //모델
  //     ct_title: req.body.ct_title, //세부모델
  //     ct_content: req.body.ct_content, //내용
  //     ct_price: req.body.ct_price, //가격
  //     ct_distance: req.body.ct_distance, //주행거리
  //     ct_option: req.body.ct_option,
  //     ct_usrid: req.body.ct_usrid //작성자아이디
  //   }
  
  //   pool.getConnection(function(err, con) {
  //     if(err){
  //       throw err;
  //     } else {
  //         con.query(`CALL SND_CONTRACT('${contract.ct_kind}', '${contract.ct_brand}', '${contract.ct_model}',
  //                   '${contract.ct_title}', '${contract.ct_content}', '${contract.ct_price}', '${contract.ct_distance}',
  //                   '${contract.ct_option}', '${contract.ct_usrid}')`, (error, rows, fields) => {
  //           if(error) return res.status(404).json(error);
  //           else return res.status(201).json({success:true});
  //         })
  //       }
  //     con.release();
  //   });
  // },

  // contractDelete: async (req, res) => {
  //   try {
  //     rows = await Contract.searchAllContract();
  //     //  + model 로 변환 로직 구현
  //     return res.json(rows);
  //   }
  //   catch(err){ return err; }
  // },

  // contractDelete: async (req, res) => {
  //   try{
  //     console.log('contract delete...')
  //     const getStatus = await this.checkToken(req.headers.authorization);
  //     if(getStatus!=200){
  //       console.log('token fail');
  //       return res.status(401).json({err: 'token fail'});
  //     }
  //   }catch(err){return res.status(401).json({err: 'token fail'});}
  //   console.log('인증완료');
    
  //   const ct_num = req.params.ct_num;
  
  //   pool.getConnection(function(err, con) {
  //     if(err){
  //       throw err;
  //     } else {
  //         con.query(`delete from contract_send where ct_num = '${ct_num}'`, (error ,rows, fields) => {
  //           if(error) return res.status(404).json(error.data);
  //           else return res.status(200).json({success:true});
  //         })
  //       }
  //     con.release();
  //   });
  // }
}