const req = require('express/lib/request');
const client = require('./frontend');
const axios = require('axios');
const qs = require('qs');
//client.show('users');
//client.signup('sd', '1234', 'asd', 'asd', 'sad', 0,0,0);
//client.kakaoLogin();


//  client.refreshToken('yytTHkERaLxMTI2kCIv1F2DPHinw30HrCnZq-QopyWAAAAF-2fVmSA');
// client.show('gKVqV4mfIeVXse96WX7JyrP981TgpsUao5yokgo9cpgAAAF-3iGQqw');
client.checkToken('gKVqV4mfIeVXse96WX7JyrP981TgpsUao5yokgo9cpgAAAF-3iGQqw');