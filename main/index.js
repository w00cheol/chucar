//express 모듈 불러오기
const httpPort = 3000;
const { default: axios } = require('axios');
const express = require('express');
const app = express();
//const { resolve } = require('path/posix');
//express 사용

const mod = require('./connection');
const con = mod.init(); //con => 연결객체
const controller = require('./controller');
mod.open(con);

//Express 4.16.0버전 부터 body-parser의 일부 기능이 익스프레스에 내장 body-parser 연결 
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//jsonwebtoken 모듈
//const jwt = require('jsonwebtoken');


app.get("/", controller.home); // / : home 화면

app.get("/contracts", controller.show); // / => 전체 출력

app.get("/contracts/:usrid", controller.find_from_usrid); // /string -> id로 검색

app.get("/contracts/pro/:proid", controller.find_from_proid) // 딜러가 [내가 보낸 견적서 보기] 체크하면 여기로 접속 -> 반환되는 견적요청서 리스트 표시

app.get("/contracts/info/:ct_key", controller.contractInfo) // 게시글 들어갈때 견적요청서 정보 다 보내줌

app.put("/contracts/finish/:ct_key", controller.contractFinish) // 마감 버튼 누르면 여기로 접속됨

app.get("/reply/:ct_key", controller.showReply) // 게시글 들어갈때 이 글에 대한 견적서 (댓글) 정보 다 보내줌

app.delete("/users/:id", controller.delete); // /usrs/숫자 : id로 삭제

// app.post('/users', controller.create); // /users 로 전송하고 data로 id, name 값 전송해줘야함, 생성

app.post('/reply', controller.sendReply); // 견적서 작성하고 백엔드 저장요청 들어오는 곳

// app.put('/users/:id', controller.update); // /users/숫자 로 전송하고 data로 name 값 전송해줘야함 , 해당 id 의 name 변경


//app.post('/login', controller.login); //data로 사용자가입력했던 id, pw 보내서 로그인되면 token값 발급 되는데 이거 저장해서 항상 들고다녀야함. (글올리기, 계정변경 등등)

app.post('/signup', controller.signup);
//app.get('/auth/kakao', controller.loginPage) //카카오로그인 페이지 연결

app.get('/token', controller.showInfo);

app.get('/checkToken', controller.checkToken);

app.get('/refresh', controller.refreshToken);

app.post('/contract/send', controller.contractSend);

app.get('/logout', controller.logout);

app.listen(httpPort,'10.178.0.3', () => console.log('server has been running...'));