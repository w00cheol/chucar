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
    con.query('SELECT * from users', (error, rows) => {
        if(error) return res.status(404).json({err: 'Undefined error!'});
        res.json(rows);
    })
}
exports.find = (req, res) =>{
    console.log('find');
    findId = req.params.id;
    if(!findId){
        return res.status(400).json({err: 'id must be required'});
    }
    con.query('SELECT * from users where id = ?', findId, (error, rows, fields) => {
        if(error) return res.status(404).json({err: 'Undefined error!'});
        if(!rows[0]) return res.status(404).json({err: 'Unknown user'});
        res.json(rows);
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
            const token = req.headers.authorization;
            const refresh_token = req.headers.refresh_token;
            console.log(refresh_token);
            await axios.post('https://kauth.kakao.com/oauth/token', {
                headers:{
                    'Content-type':'application/x-www-form-urlencoded;charset=utf-8'
                },
                data:qs.stringify({
                    grant_type: 'refresh_token',//특정 스트링
                    client_id:'9e7627ff0adc857af4fd5e69de0222e6',
                    refresh_token:refresh_token,
                    client_secret:'9F00S9wCb8X6cggmdqesUVTYoQeD41P4'
                })//객체를 string 으로 변환
            })
            console(1);
        }catch(err){
            console.log(err);
            res.json(0);
        }
}
//프론트에서 토큰값을 헤더에 껴서 보내면 카카오 api 를 이용하여 정보 확인 받은 후 프론트에게 전달
// exports.checkToken = async(req, res) => {
//     try{
//         const token = req.headers.authorization;
//         console.log(token);
//         tokenInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
//             headers:{
//                 Authorization: `Bearer ${token}`,
//                 'Content-type':'application/x-www-form-urlencoded;utf-8'
//             }
//         })
//         console.log(tokenInfo.data.properties.nickname);
//         res.json(tokenInfo.data.properties.nickname);
//     }catch(err){
//         console.log(err.data);
//         res.json(0);
//     }
// }

exports.logout = (req,res) => {
    console.log(res.data);
}

exports.contractSend = (req,res) => { //견적서 전송
    const contract = {
        kind: parseInt(req.body.kind),
        brand: req.body.brand,
        model: req.body.model,
        detail: req.body.detail,
        price: parseInt(req.body.price),
        mnpay: parseInt(req.body.mnpay),
        distance: parseInt(req.body.distance),
        option: req.body.option,
        protosay: req.body.protosay,
        procode: req.body.procode,
        usrid: req.body.usrid
    }
    con.query(`CALL SND_CONTRACT('${contract.kind}', '${contract.brand}', '${contract.model}', '${contract.detail}', '${contract.price}',
                                 '${contract.mnpay}', '${contract.distance}', '${contract.option}', '${contract.protosay}',
                                 '${contract.procode}', '${contract.usrid}')`, (error, rows, fields) => {
        if(error) res.status(404).json(error);
        res.status(201).json({success:true});
    })
}