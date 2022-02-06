//mysql 연결객체 불러오기
const { errorMonitor } = require('events');
require('dotenv').config({path : '../.env' });
const jwt = require('jsonwebtoken');
//const { resolve } = require('path/posix');
const mod = require('./connection');
const qs = require('qs');
const con = mod.init(); //con => 연결객체
const axios = require('axios');

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
    /*
	const memberId = req.body.id || '';
	const memberPassword = req.body.password || '';
    const mamberNickname = req.body.nickname || '';
    const memberEmail = req.body.email || '';
    const memberPhone = req.body.phone || '';
    const prv1 = parseInt(req.body.prv1);
    const prv2 = parseInt(req.body.prv2);
    const prv3 = parseInt(req.body.prv3);
    */
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

exports.loginPage = (req,res)=>{ //인가코드요청
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code`;
    res.redirect(kakaoAuthURL);
}

//인가코드 이용해서 토큰 요청
exports.reqToken = async(req,res)=>{ // 비동기 랑 어웨잇 쓸지 고민
    // const token = '';
    // try{
    //     token = await axios.post('https://kauth.kakao.com/oauth/token', {
    //         grant_type: 'authorization_code',//특정 스트링
    //         client_id:kakao.clientID,
    //         redirectUri:kakao.redirectUri,
    //         code:req.query.code,
    //         client_secret:kakao.clientSecret
    //     },{
    //         headers:{
    //             'content-type':'application/x-www-form-urlencoded;charset=utf-8' //utf-8 넣을건지 나중에
    //         }
    //     })
    //     console.log(token);
    // }catch(err){
    //     console.log(err);
    // }
    // console.log('영웅소프트 화이팅!');
    try{//access토큰을 받기 위한 코드
        token = await axios({//token
            method: 'POST',
            url: 'https://kauth.kakao.com/oauth/token',
            headers:{
                'content-type':'application/x-www-form-urlencoded'
            },
            data:qs.stringify({
                grant_type: 'authorization_code',//특정 스트링
                client_id:kakao.clientID,
                client_secret:kakao.clientSecret,
                redirectUri:kakao.redirectUri,
                code:req.query.code//결과값을 반환했다. 안됐다.
            })//객체를 string 으로 변환
        })
    }catch(err){
        res.json(err.data);
    }

    // try{
    //     await axios.get('https://kapi.kakao.com/v2/user/me', {
    //         headers:{
    //             Authorization: `Bearer ${token.data}`,
    //             'content-type':'application/x-www-form-urlencoded'
    //         }
    //     })
    // }catch(err){
    //     console.log(err);
    // }
    //res.send('success');


    try{
        console.log(token.data.access_token);//access정보를 가지고 또 요청해야 정보를 가져올 수 있음.
        user =  await axios({
            method:'get',
            url:'https://kapi.kakao.com/v2/user/me',
            headers:{
                Authorization: `Bearer ${token.data.access_token}`
            }
        })
        console.log(user);
    }catch(e){
        res.json(e.data);
    }
 
    // req.session.kakao = user.data;    
}

/*
exports.signup = (req, res) => {
    const signupId = req.body.id;
    const signupPassword = req.body.password;
    const signupName = req.body.name;
    if(!signupId){
        return res.status(401).json({err: 'id must be required'});
    }
    if(!signupPassword){
        return res.status(401).json({err: 'password must be required'});
    }
    if(!signupName){
        return res.status(401).json({err: 'name must be required'});
    }
    con.query('select name from users where id = ?', signupId, (error, rows, fields) => {
        if(error) return res.status(404).json({err: 'undefinsdged error'});
        if (!!rows[0]) {
            return res.status(400).json({err: 'this id already exists'});
        }
        con.query('select name from users where name = ?', signupName, (error, rows, fields) => {
                if(error) return res.status(404).json({err: 'undefined error'});
                if (!!rows[0]) {
                    return res.status(400).json({err: 'this name already exists'});
                }
                con.query('insert into users set ?', req.body, (error, rows, fields) => {
                    if(error) return res.status(404).json({err: 'undefined error'});
                    return res.status(204).json({msg: 'welcome!'});
                })
        })
    })
}*/