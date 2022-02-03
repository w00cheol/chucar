//express 모듈 불러오기
const httpPort = 3000;
const express = require('express');
const app = express();
//const { resolve } = require('path/posix');
//express 사용

const mod = require('./connection');
const con = mod.init(); //con => 연결객체
const crud = require('./crud');
mod.open(con);

//Express 4.16.0버전 부터 body-parser의 일부 기능이 익스프레스에 내장 body-parser 연결 
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get("/", crud.home); // / : home 화면

app.get("/users", crud.show); // /users : 전체 출력

app.get("/users/:id", crud.find); // /users/숫자 : id로 검색

app.delete("/users/:id", crud.delete); // /usrs/숫자 : id로 삭제

app.post('/users', crud.create); // /users 로 전송하고 data로 id, name 값 전송해줘야함, 생성

app.put('/users/:id', crud.update); // /users/숫자 로 전송하고 data로 name 값 전송해줘야함 , 해당 id 의 name 변경

app.listen(httpPort, () => console.log('server has been running...'));