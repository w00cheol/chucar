const req = require('express/lib/request');
const client = require('./frontend');
const axios = require('axios');
const qs = require('qs');
//client.show('users');
//client.signup('sd', '1234', 'asd', 'asd', 'sad', 0,0,0);
//client.kakaoLogin();


  // client.refreshToken('NG6AIpw4RTDpE6AXrCLvMGkoHrNKKUasRrAj3wo9dNoAAAF-8gzMdw');
// client.showInfo('NG6AIpw4RTDpE6AXrCLvMGkoHrNKKUasRrAj3wo9dNoAAAF-8gzMdw');
// client.checkToken('NG6AIpw4RTDpE6AXrCLvMGkoHrNKKUasRrAj3wo9dNoAAAF-8gzMdw');
// client.findfromproid('NG6AIpw4RTDpE6AXrCLvMGkoHrNKKUasRrAj3wo9dNoAAAF-8gzMdw');
// client.contractInfo('NG6AIpw4RTDpE6AXrCLvMGkoHrNKKUasRrAj3wo9dNoAAAF-8gzMdw');
// client.contractFinish('NG6AIpw4RTDpE6AXrCLvMGkoHrNKKUasRrAj3wo9dNoAAAF-8gzMdw');
// client.showReply('NG6AIpw4RTDpE6AXrCLvMGkoHrNKKUasRrAj3wo9dNoAAAF-8gzMdw');
// client.findfromusrid('NG6AIpw4RTDpE6AXrCLvMGkoHrNKKUasRrAj3wo9dNoAAAF-8gzMdw');
// client.show('NG6AIpw4RTDpE6AXrCLvMGkoHrNKKUasRrAj3wo9dNoAAAF-8gzMdw');
// client.get_pro('NG6AIpw4RTDpE6AXrCLvMGkoHrNKKUasRrAj3wo9dNoAAAF-8gzMdw');
// client.get_usr('NG6AIpw4RTDpE6AXrCLvMGkoHrNKKUasRrAj3wo9dNoAAAF-8gzMdw');
// client.pro_signup('NG6AIpw4RTDpE6AXrCLvMGkoHrNKKUasRrAj3wo9dNoAAAF-8gzMdw');
// client.usr_signup('NG6AIpw4RTDpE6AXrCLvMGkoHrNKKUasRrAj3wo9dNoAAAF-8gzMdw');
        // axios({
        //   url: "https://kapi.kakao.com/v1/user/logout",
        //   method: "post", // POST method
        //   headers: {
        //       Authorization: `Bearer fDh6SXbHH-x3e_rn5Pzvm2vdx2nxSOxI419EFQo9dBEAAAF_A7sMFg`,
        //       "Content-Type": "application/x-www-form-urlencoded"
        //     }
        // })

      //   axios({
      //     url: `https://api.iamport.kr/subscribe/payments/unschedule`,
      //     method: "post",
      //     headers: { "Authorization": 'd088638a820f43c7ea4ef26cf9381d549e4941e0' }, // 인증 토큰 Authorization header에 추가
      //     data: {
      //     customer_uid: "1_1" // 카드(빌링키)와 1:1로 대응하는 값
      //     }
      // });
      const body = { '{"catg":1,"gubn":1,"kind":2,"model":"2","title":"2","content":"2","price":"2","distance":"2","option":"2","img1":"","img2":"","img3":"","img4":"","code":"","usrid":2111801212}': '' };
      console.log(body['{"catg":1,"gubn":1,"kind":2,"model":"2","title":"2","content":"2","price":"2","distance":"2","option":"2","img1":"","img2":"","img3":"","img4":"","code":"","usrid":2111801212}'])