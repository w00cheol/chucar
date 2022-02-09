//mysql 연결객체 불러오기
const { errorMonitor } = require('events');
require('dotenv').config({path : '../.env' });
const jwt = require('jsonwebtoken');
//const { resolve } = require('path/posix');
const mod = require('./connection');
const qs = require('qs');
const con = mod.init(); //con => 연결객체
const axios = require('axios');
const e = require('express');
const res = require('express/lib/response');
const express = require('express');

const kakao = { //나중에 import로 유출방지
    clientID: '9e7627ff0adc857af4fd5e69de0222e6',
    clientSecret: '9F00S9wCb8X6cggmdqesUVTYoQeD41P4',
    redirectUri: 'http://34.64.207.117:3000/oauth'
}

exports.home = (req, res) =>{
    console.log('home');
    res.send('Welcome to CHUCAR!');
}
exports.show = (req, res) =>{
    console.log('show');
    con.query('SELECT * from contract_send', (error, rows) => {
        if(error) return res.status(404).json({err: 'Undefined error!'});
        res.json(rows);
    })
}
exports.find_from_usrid = (req, res) =>{
    console.log('find_contract_from_id');
    findId = req.params.usrid;
    if(!findId){
        return res.status(400).json({err: 'usrid must be required'});
    }
    con.query('SELECT * from contract_send where ct_usrid = ?', findId, (error, rows, fields) => {
        if(error) return res.status(404).json({err: 'Undefined error!'});
        // if(!rows[0]) return res.status(404).json({err: 'Unknown usrid'});
        res.json(rows);
    })
}
exports.showReply = (req, res) =>{
    console.log('showReply');
    ct_key = req.params.ct_key;
    if(!findId){
        return res.status(400).json({err: 'ct_key must be required'});
    }
    con.query(`select * from contract_reply where ct_key = ${ct_key}`, (error, rows, fields) => {
        if(error) return res.status(404).json({err: 'Undefined error!'});
        // if(!rows[0]) return res.status(404).json({err: 'Unknown usrid'});
        res.json(rows);
    })
}
exports.contractFinish = (req, res) =>{
    console.log('contractFinish');
    ct_key = req.params.ct_key;
    if(!findId){
        return res.status(400).json({err: 'ct_key must be required'});
    }
    con.query(`update contract_send set ct_stat = 2 where ct_key = ${ct_key}`, (error, rows, fields) => {
        if(error) return res.status(404).json({err: 'Undefined error!'});
        // if(!rows[0]) return res.status(404).json({err: 'Unknown usrid'});
        res.status(204).json(1);
    })
}
exports.contractInfo = (req, res) =>{
    console.log('contractInfo');
    ct_key = req.params.ct_key;
    if(!findId){
        return res.status(400).json({err: 'ct_key must be required'});
    }
    con.query(`select * from contract_send where ct_key = ${ct_key}`, (error, rows, fields) => {
        if(error) return res.status(404).json({err: 'Undefined error!'});
        // if(!rows[0]) return res.status(404).json({err: 'Unknown usrid'});
        res.json(rows);
    })
}
exports.find_from_proid = (req, res) =>{
    console.log('find_reply_from_id');
    findId = req.params.proid;
    if(!findId){
        return res.status(400).json({err: 'proid must be required'});
    }
    con.query(`select * from contract_send where ct_key  in (
        SELECT cr_key as num from contract_reply where cr_proid = '${findId}');`, (error, rows, fields) => {
        if(error) return res.status(404).json({err: 'Undefined error!'});
        // if(!rows[0]) return res.status(404).json({err: 'Unknown usrid'});
        res.json(rows);
    })
}
exports.sendReply = (req, res) =>{
    console.log('sendReply');
    const member = {
        cr_key: req.body.cr_key,
        cr_reply: req.body.cr_reply,
        img1: req.body.img1,
        img2: req.body.img2,
        img3: req.body.img3,
        img4: req.body.img4,
        img5: req.body.img5,
        img6: req.body.img6,
        img7: req.body.img7,
        img8: req.body.img8,
        img9: req.body.img9,
        img10: req.body.img10,
        img11: req.body.img11,
        img12: req.body.img12,
        proid: req.body.proid
    }
    con.query(`CALL RPY_CONTRACT('${member.cr_key}', '${member.cr_reply}', '${member.img1}', '${member.img2}', '${member.img3}',
                                 '${member.img4}', '${member.img5}', '${member.img6}', '${member.img7}', '${member.img8}',
                                 '${member.img9}', ${member.img10}), ${member.img11}), ${member.img12}, ${member.proid})`, (error, rows, fields) => {
        if(error) res.status(404).json(error);
        res.status(201).json({success:true});
    })
}
exports.delete = (req, res) => { 
    console.log('delete');
    deleteId = req.params.id;
    if(!deleteId){
        return res.status(400).json({err: 'id must be required'});
    }
    con.query('SELECT * from users where id = ?', deleteId, (error, rows, fields) => {
        if(error) return res.status(404).json({err: 'Undefined error!'});
        if(!rows[0]) return res.status(404).json({err: 'Unknown user'});
        else con.query('DELETE from users where id = ?', id, (error, rows, fields) => {
            if(error) return res.status(404).json({err: 'Undefined error!'});
            res.status(204);
        })
    })
    //REST API protocol에 의거 "no content" 전송
}
exports.create = (req, res) => {
    console.log('create');
    const newId = req.body.id;
    const newName = req.body.name || '';
    if(!newId){
        return res.status(400).json({err: 'Incorrct id'});
    }
    if(!newName){
        return res.status(400).json({err: 'Incorrect name'});
    }
    con.query('SELECT * from users where id = ?', newId, (error, rows, fields) => {
        if(error) return res.status(404).json({err: 'Undefined error!'});
        if(!!rows[0]) return res.status(404).json({err: 'the id already exist'});
        else con.query('insert into users set ?', req.body, (error, rows, fields) => {
            if(error) return res.status(404).json({err: 'Undefined error!'});
            res.status(201).json(rows);
            //REST API 규약에 맞게 Created code 전송
        })
    })
}
exports.update = (req, res) =>{
    console.log('update');
    const id = req.params.id;
    const updateName = req.body.name || '';
    if(!id){
        return res.status(400).json({err: 'Incorrct id'});
    }
    if(!updateName.length){
        return res.status(400).json({err: 'Incorrect name'});
    }
    var updateUser = [updateName, id];
    con.query('SELECT * from users where id = ?', id, (error, rows, fields) => {
        if(error) return res.status(404).json({err: 'Undefined error!'});
        if(!rows[0]) return res.status(404).json({err: 'the id doesn\'t  exist'});
        con.query('UPDATE users SET name = ? where id = ?', updateUser, (error, rows, fields) => {
            if(error) return res.status(404).json(error);
            res.status(204).end();
        })
    })
}
exports.signup = (req, res) => {
    const member = {
        id: req.body.id,
        password: req.body.password,
        nickname: req.body.nickname,
        email: req.body.email,
        phone: req.body.phone,
        prv1: parseInt(req.body.prv1),
        prv2: parseInt(req.body.prv2),
        prv3: parseInt(req.body.prv3),
    }

    if(!member.id){
        return res.status(401).json({err: 'id must be required'});
    }
    else if(!member.password){
        return res.status(401).json({err: 'password must be required'});
    }
    else if(!member.nickname){
        return res.status(401).json({err: 'nickname must be required'});
    }
    console.log("REST API Post Method - Member Login And JWT Sign");
    con.query(`CALL REG_USER('${member.id}','${member.password}','${member.nickname}','${member.email}','${member.phone}',${member.prv1},${member.prv2},${member.prv3},@err)`, (error, rows, fields) => {
        console.log('1');
        if(error) res.status(404).json(error);
        console.log('2');
        con.query('select @err as err' , (error, rows, fields) => {

        console.log('3');
            if(error) res.status(404).json(error);
            if(rows[0].err){
                    const secret = process.env.jwtcode;
                    jwt.sign({
                            memberId : rows[0].name,
                            memberName : rows[0].password
                    },
                    secret,
                    {
                        expiresIn : '300'
                    },
                    (err, token) => {
                        if (err) {
                            res.status(401).json({err:'token sign fail'});
                        }
                        res.json({token:token});
                    });
            }else {
                res.status(401).json({success:false, errormessage:'wrong id or password'});
            }
        })
    })
}

// exports.loginPage = (req,res)=>{ //인가코드요청
//     const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code`;
//     res.redirect(kakaoAuthURL);
// }

exports.refreshToken = async(req,res) => {
        try{
            const refresh_token = req.headers.refresh_token;
            console.log('refreshing...');
            newToken = await axios({
                method: 'POST',
                url: 'https://kauth.kakao.com/oauth/token',
                headers:{
                    'content-type':'application/x-www-form-urlencoded'
                },
                data:qs.stringify({
                    grant_type: 'refresh_token',//특정 스트링
                    client_id:'9e7627ff0adc857af4fd5e69de0222e6',
                    refresh_token:refresh_token,
                    client_secret:'9F00S9wCb8X6cggmdqesUVTYoQeD41P4'
                })//객체를 string 으로 변환
            })
            console.log(newToken.data);
            res.json(newToken.data);
        }catch(err){
            console.log(err);
            res.json(0);
        }
}

//앱 사용자만 접근 가능하게함 +외부 공격 일부 차단
exports.checkToken = async(token) => {
    try{
        console.log(token);
        getStatus = await axios({
            method: 'get',
            url: 'https://kapi.kakao.com/v2/user/me',
            headers:{
                Authorization: `Bearer ${token}`,
                'content-type':'application/x-www-form-urlencoded;utf-8'
            }
        })
        console.log(getStatus.status);
        return getStatus.status;
    }catch(err){
        return 0;
    }
}
// 프론트에서 토큰값을 헤더에 껴서 보내면 카카오 api 를 이용하여 정보 확인 받은 후 프론트에게 전달
exports.showInfo = async(req, res) => {
    try{
        const token = req.headers.Authorization; 
        console.log(token);
        tokenInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers:{
                Authorization: `Bearer ${token}`,
                'content-type':'application/x-www-form-urlencoded;utf-8'
            }
        })
        const properties = {
            id: tokenInfo.data.id,
            nickname: tokenInfo.data.properties.nickname
        }
        console.log(tokenInfo.data.id);
        console.log(properties.nickname);
        res.json(properties);
    }catch(err){
        console.log(err);
        res.json(0);
    }
}

exports.logout = (req,res) => {
    console.log(res.data);
}

exports.contractSend = async (req,res) => { //견적서 전송
    try{
        console.log('contractsend')
        const getStatus = await this.checkToken(req.headers.authorization);
        if(getStatus!=200){
            return res.status(401).json({err: 'token fail'});
        }
    }catch(err){
        return res.status(401).json({err: 'token fail'});
    }
    console.log('인증완료');
    const contract = {
        kind: parseInt(req.body.kind), //결제종류
        brand: req.body.brand, // 제조사
        model: req.body.model, //모델
        detail: req.body.detail, //세부모델
        price: parseInt(req.body.price), //가격
        mnpay: parseInt(req.body.mnpay), //월납입금
        distance: parseInt(req.body.distance), //주행거리
        option: req.body.option, //옵션
        protosay: req.body.protosay, //프로에게ㅎㄹ말
        procode: req.body.procode, //추천코드
        usrid: req.body.usrid //작성자아이디
    }
    // const contract = {
    //     kind: 1, //결제종류
    //     brand: '테슬라', // 제조사
    //     model: 'modelS', //모델
    //     detail: '아무거나', //세부모델
    //     price: 300000, //가격
    //     mnpay: 23233, //월납입금
    //     distance: 2355, //주행거리
    //     option: '선루프', //옵션
    //     protosay: '삽니다~', //프로에게ㅎㄹ말
    //     procode: '', //추천코드
    //     usrid: '권우철' //작성자아이디
    // }
    con.query(`CALL SND_CONTRACT('${contract.kind}', '${contract.brand}', '${contract.model}', '${contract.detail}', '${contract.price}',
                                 '${contract.mnpay}', '${contract.distance}', '${contract.option}', '${contract.protosay}',
                                 '${contract.procode}', '${contract.usrid}')`, (error, rows, fields) => {
        if(error) res.status(404).json(error);
        res.status(201).json({success:true});
    })
}