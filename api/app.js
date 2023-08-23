const express = require("express");
const contract = require("./sub/contract");
const login = require("./sub/login");
const logout = require("./sub/logout");
const app = express();
const PORT = process.env.PORT || 3080;

app.get('/', (req, res) => {
    res.send('SThereum is activated!\n');
})

app.get('/api/contract', (req, res) => {
    contract.run(req, res)
})

//LOGIN 처리 -- 중복로그인 허용 시, 세션키 추가 해야하나?
app.get('/api/login', (req, res) => {
    login.run(req, res);    
});

//LOGOUT 처리 -- 중복로그인 허용 시, 세션키 추가 해야하나?
app.get('/api/logout', (req, res) => {
    logout.run(req, res);    
});

//주문 처리



app.listen(PORT, () => console.log(`server is running ${PORT}`));