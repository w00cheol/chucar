const req = require('express/lib/request');
const client = require('./frontend');
const axios = require('axios');
const qs = require('qs');
//client.show('users');
//client.signup('sd', '1234', 'asd', 'asd', 'sad', 0,0,0);
//client.kakaoLogin();

token = axios({//token
    method: 'POST',
    url: 'https://kauth.kakao.com/oauth/token',
    headers:{
        'content-type':'application/x-www-form-urlencoded'
    },
    data:qs.stringify({
        grant_type: 'authorization_code',//특정 스트링
        client_id:'9e7627ff0adc857af4fd5e69de0222e6',
        redirectUri:'http://34.64.207.117:3000/oauth',
        code:'asg',
        client_secret:'9F00S9wCb8X6cggmdqesUVTYoQeD41P4'
        // grant_type: 'authorization_code',//특정 스트링
        // client_id:kakao.clientID,
        // client_secret:kakao.clientSecret,
        // redirectUri:kakao.redirectUri,
        // code:req.query.code,//결과값을 반환했다. 안됐다.
        // client_secret:'9F00S9wCb8X6cggmdqesUVTYoQeD41P4'
    })//객체를 string 으로 변환
})
// client.contractSend(1, 'sad', 'sd', 'gwe', 300, 20, 40000, 'qwe', 'hi', '003v', 'nope!');