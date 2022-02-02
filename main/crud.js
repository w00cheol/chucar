//mysql 연결객체 불러오기
const { errorMonitor } = require('events');
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
    const id = parseInt(req.params.id, 10);
    if(!id){
        return res.status(400).json({err: 'Incorrct id'});
    }
    con.query('SELECT * from users where id = ?', id, (error, rows, fields) => {
        if(error) return res.status(404).json({err: 'Undefined error!'});
        if(!rows[0]) return res.status(404).json({err: 'Unknown user'});
        res.json(rows);
    })
}
exports.delete = (req, res) => { //검색함수
    const id = parseInt(req.params.id, 10);
    console.log('delete');
    if(!id){
        return res.status(400).json({err: 'Incorrct id'});
    }
    con.query('SELECT * from users where id = ?', id, (error, rows, fields) => {
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
    const newId = parseInt(req.body.id, 10);
    const newName = req.body.name || '';
    if(!newId){
        return res.status(400).json({err: 'Incorrct id'});
    }
    if(!newName.length){
        return res.status(400).json({err: 'Incorrect name'});
    }
    con.query('SELECT * from users where id = ?', newId, (error, rows, fields) => {
        if(error) return res.status(404).json({err: 'Undefined error!'});
        if(!!rows[0]) return res.status(404).json({err: 'the id already exist'});
        else con.query('insert into users set ?', req.body, (error, rows, fields) => {
            if(error) return res.status(404).json({err: 'Undefined error!'});
            res.status(201).end();
            //REST API 규약에 맞게 Created code 전송
        })
    })
}
exports.update = (req, res) =>{
    console.log('update');
    const id = parseInt(req.params.id, 10);
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