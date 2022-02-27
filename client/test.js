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
// client.findfromusrid('vfdLu78zaKH6yNjLHSZ1Fc61e3rl-719KRAlbwo9dZoAAAF_BHVAig');
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


      // axios({
      //   method: 'post',
      //   url: 'http://34.64.207.117:3000/contract/send',
      //   headers:{
      //     Authorization: 'vfdLu78zaKH6yNjLHSZ1Fc61e3rl-719KRAlbwo9dZoAAAF_BHVAig',
      //   },
      //   data:{
      //     catg:1, //1할부, 2렌트, 3리스, 4현금.
      //     gubn:1, //제조사
      //     kind:1, //모델
      //     model:'sd', //세부모덷
      //     title:'sdg', //가격
      //     content:'sdg', //월납입금액
      //     price:'sd', //최대주행거리 희망
      //     distance:'sd', //희망옵션 ex)선루프,,
      //     option:'23', //딜러에게할말
      //     img1:'', //추천인코드
      //     img2:'', //고객의 아이디 -> 추후에 로그인 개발하면 해당 사용자 id 추출 후 넣을 것
      //     img3:'',
      //     img4:'',
      //     code:'',
      //     usrid:''
      //   }
      // })
// const a  = [ { uid: '173008012120003' } ];
// console.log(a[0].uid);


async function a(){
  try{
    const word = encodeURIComponent('rrr')
    const temp = await axios({
      url: `http://34.64.207.117:3000/contracts?&proid=2111801212&kind=&`,
      method: "get"
    })
    console.log(temp.data)
  }catch(err){
    console.log(err);
  }
}
a();
// date = new Date();
// const a = 1;
// console.log({a})