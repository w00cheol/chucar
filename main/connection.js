var mysql = require('mysql');
require('dotenv').config({path : '../.env' });
const connect = {
  init: function(){
    return mysql.createConnection({
          host     : process.env.host, //아이피
          user     : process.env.user, //계정이름
          password : process.env.password, //비밀번호
          port     : process.env.port, //포트
          database : process.env.database //DB 이름
    });
  },

  open: function(con){ //con에 init (위 객체)가 들어올 예정
    con.connect(err => {
      if(err){
        console.log("MySQL 연결 실패 : ", err);
      } else {
        console.log("MySQL 연결 성공!");
      }
    });    
  },

  close: function(con){
    con.end(err=>{
      if(err){
        console.log("MySQL 종료 실패 : ", err);
      } else {
        console.log("MySQL 종료 성공!");
      }
    })
  }
}
module.exports = connect;