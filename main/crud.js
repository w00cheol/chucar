//mysql 연결객체 불러오기
const { errorMonitor } = require('events');
require('dotenv').config({path : '../.env' });
const jwt = require('jsonwebtoken');
//const { resolve } = require('path/posix');
const mod = require('./connection');
const con = mod.init(); //con => 연결객체

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
exports.login = (req, res) => {
	const memberId = req.body.id || '';
	const memberPassword = req.body.password || '';
    if(!memberId){
        return res.status(401).json({err: 'id must be required'});
    }
    else if(!memberPassword){
        return res.status(401).json({err: 'password must be required'});
    }
    console.log("REST API Post Method - Member Login And JWT Sign");
    con.query('select name, password from users where id = ?', memberId, (error, rows, fields) => {
        if(error) res.status(404).json({err: 'undefined error'});
        if (!!rows[0]) {
            if (rows[0].password == memberPassword) {
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
            } else {
                res.status(401).json({success:false, errormessage:'wrong password'});
            }
        } else {
            res.status(401).json({success:false, errormessage:'wrong id'});
        }
    })
}
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
}