const axios = require('axios');

axios.get('http://localhost:3000/users') // 전체 차 목록 출력할때 쓰셈
.then((res) => { //성공
    console.log(res.data);
})
.catch((err) => { //실패
    console.log(err.response.data);
})
.then(()=>{ //성공이던 실패던 항상 always
    console.log('영웅소프트 화이팅!');
});


axios.post('http://localhost:3000/users', { //회원가입할때 쓰셈
    id:36,
    name:'436'
})
.then((response) => {
    console.log('the user created succesfully');
})
.catch((err) => { //실패
    console.log(err.response.data);
})
.then(() => { //성공이던 실패던 항상 always
    console.log('영웅소프트 화이팅!');
});


axios.get(`http://localhost:3000/users/${1}`)
.then(function (res) {
	console.log(res.data);
})
.catch(function (err) {
	console.log(err.response.data);
})
.then(function () {
    console.log('영웅소프트 화이팅!');
});