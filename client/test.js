const req = require('express/lib/request');
const client = require('./frontend');
const axios = require('axios');
const qs = require('qs');
//client.show('users');
//client.signup('sd', '1234', 'asd', 'asd', 'sad', 0,0,0);
//client.kakaoLogin();

const a = {
    access_token:'VfDC40snvSsW9IW7NbL0Ucs0lTxoGwld9LfcTgopb9UAAAF-2dGMDg',
    refresh_token: 'gFoBPJnhlC6hgA1jNAG4szobG3sQhUqRHBvDLAopb9UAAAF-2dGMDQ'
}

client.refreshToken(a);
