const controller = require('./controller');
const cors = require('cors');
const express = require('express');
const app = express();

// middleware use
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors()); // CORS 미들웨어 추가

app.get("/", controller.home); // / : home 화면

// /pros 로 변경할것
// app.put("/setpro", controller.setPro); // 딜러정보 생성, 수정

// // /pros/:pro_id 로 변경할것
// app.put("/profile/:pro_id", controller.setProfile); // 딜러 프로필 사진 수정

// // /pros/:pro_id 로 변경할것
// app.get("/pro/:pro_id", controller.get_pro); // pro_id -> 회원번호, 딜러의 정보 전송

// // /contracts/list/:amount 로 변경할것
app.get("/contracts", controller.searchContract); // / => DB 견적요청서 출력

// // /contracts 로 변경할것
// app.post('/contracts/send', controller.contractSend); // 견적 요청 여기로 보내면 됨 //send 삭제

// // /contracts/:ct_key 로 변경할것
// app.get("/contracts/info/:ct_key", controller.contractInfo) // 게시글 들어갈때 견적요청서 정보 다 보내줌  //info -> detail 변경

// // /contracts/:ct_key 로 변경할것
// app.patch("/contracts/finish/:ct_num", controller.contractFinish) // 마감 버튼 누르면 여기로 접속됨 /// finish 삭제

// app.delete('/contracts/:ct_num', controller.contractDelete); // 견적신청서 삭제

// // /replies/:cr_num 로 변경할것
// app.get("/reply/:cr_num", controller.showReply) // 댓글 들어갈때 이 글에 대한 견적서 (댓글) 정보 다 보내줌

// // /replies 로 변경할것
// app.post('/reply', controller.sendReply); // 견적서 작성하고 백엔드 저장요청 들어오는 곳

// app.get('/refresh', controller.refreshToken); // 사용자가 접속할때마다 토큰 보내서 갱신하셈 받아서 async storage에 저장 post로 변경

// // /cars 로 변경할것
// app.get('/car', controller.getCarInfo); // 자동차 조회

// app.get("/isdealer/:usr_id", controller.isDealer); // 딜러 고객 구분

// // /me 로 변경할것
// app.get('/showInfo', controller.showInfo); // async storage 에서 꺼낸 토큰 받으면 닉네임(실명)이랑 회원번호 줌 redux에 저장 후 사용할때마다 꺼내쓰기 ///show 삭제

// app.get('/logout', controller.logout); // 로그아웃

app.listen(process.env.serverport, '0.0.0.0', () => console.log('server has been running...'));