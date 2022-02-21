import React, { useEffect, useState } from 'react';
import IMP from 'iamport-react-native'; // 아임포트 결제모듈을 불러옵니다.
import storage from '../../storage';
import axios from 'axios';

export default function PaymentPage({navigation}) {

    const [merchant,setMerchant] = useState(null);
    const [userid,setUserid] = useState(null);
  
    useEffect(()=>{
        (async()=>{
            setUserid(await storage.getData('id'));
            console.log('id : '+userid);
            await axios({ // 다음 주문번호 발급
            url: `${storage.chucar_url}/merchant`,
            method: 'POST',
            data: {
                code: 1, //상품번호 일단 1로 고정
                customer_uid: `${userid}`,
            }
            })
            .then(function(res) {
                console.log(res.data);
                if(res.data) setMerchant(res.data);
            })
            .catch(function(err) {
                console.log(err)
            })
        })();
    },[userid]);

    const data = {
        pg: 'danal_tpay',
        pay_method: 'card',
        name: '츄카 딜러 이용권 결제',
        merchant_uid: merchant, //결제 id
        amount: '100',
        customer_uid: userid,
    //   buyer_name: '홍길동',
        buyer_tel: '01012345678',
    //   buyer_email: 'example@naver.com',
    //   buyer_addr: '서울시 강남구 신사동 661-16',
    //   buyer_postcode: '06018',
        app_scheme: 'example',
        // [Deprecated v1.0.3]: m_redirect_url
    };

    const callback = (response) => { /* [필수입력] 결제 종료 후, 라우터를 변경하고 결과를 전달합니다. */
      console.log(response);
      navigation.replace('MainPage',response);
      alert('결제가 완료되었습니다.')
    };
    return (
      <IMP.Payment
        userCode={'imp62201906'} // 가맹점 식별코드
        data={data} // 결제 데이터
        callback={callback} // 결제 종료 후 콜백
        // loading={{
        //   message: '잠시만 기다려주세요...', // 로딩화면 메시지 
        //   image: {uri:'../../../img/chucar-logoN3.png'} // 커스텀 로딩화면 이미지
        // }}
      />
    );
    
}