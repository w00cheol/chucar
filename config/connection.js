require("dotenv").config({ path: __dirname + `/../.env` }); 
var mysql = require('mysql');

module.exports = {
  init: () => {
    return mysql.createPool({
      host            : process.env.host, //아이피
      user            : process.env.user, //계정이름
      password        : process.env.password, //비밀번호
      port            : process.env.port, //포트
      database        : process.env.database, //DB 이름
      connectionLimit : process.env.connectionLimit //DB 이름
    });
  },


  check: (pool) => {
    pool.getConnection((err, con) => {
      con.release();
      if(err){
          throw err;
      } else {
        console.log('MySQL 연결 성공!');
      }
    });
  },
  

  selectQuery: async (sql, pool) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if(err){
          con.release();
          reject(err);
        }

        con.query(sql, (err, rows) => {
          con.release();
          if(err) {
            reject(err);
          }
          else {
            resolve(rows);
          }
        });
      })
    }).catch(err => err);
  },


  transactionQuery: async (sql, pool) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if(err){
          con.release();
          reject(err);
        }
        
        con.beginTransaction();
        con.query(sql, (err, rows) => {
          if(err) {
            con.rollback();
            con.release();
            reject(err);
          }
          else {
            con.commit();
            con.release();
            resolve(rows);
          }
        });
      });
    }).catch(err => err);
  }
}