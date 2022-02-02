//express 모듈 불러오기
const httpPort = 3000;
const app = express();
const express = require('express');
//const { resolve } = require('path/posix');
//express 사용

const mod = require('./connection');
const con = mod.init(); //con => 연결객체
const crud = require('./crud');
mod.open(con);

//Express 4.16.0버전 부터 body-parser의 일부 기능이 익스프레스에 내장 body-parser 연결 
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get("/", crud.home);

app.get("/users", crud.show);

app.get("/users/:id", crud.find);

app.delete("/users/:id", crud.delete);

app.post('/users', crud.create);

app.put('/users/:id', crud.update);

app.listen(httpPort, () => console.log('server has been running...'));