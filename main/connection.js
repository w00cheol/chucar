var mysql = require('mysql');
require('dotenv').config({path : '../.env' });
const connect = {
  init: function(){
    return mysql.createConnection({
          host     : 'dev.rgb.kr', //아이피
          user     : 'root', //계정이름
          password : '+jZ2g8UgjW2bCw@6', //비밀번호
          port     : 3306, //포트
          database : 'want_car' //DB 이름
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