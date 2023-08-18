const express = require("express");
const db = require("./lib/db");
const contract = require("./sub/contract");
const app = express();
const PORT = process.env.PORT || 3080;

app.get('/', (req, res) => {
    res.send('SThereum is activated!\n');
})

app.get('/api/contract', (req, res) => {
    contract.run(req, res)
})

//LOGIN 처리 -- 중복로그인 허용 시, 세션키 추가 해야하나?
app.get('/login', (req, res) => {
    const pkey = req.query.pkey; // URL 파라미터로부터 pkey 값을 받아옴
    if (!pkey) {
        res.status(400).json({ ret:"-0009", error: "Missing pkey parameter." });
        return;
    }
        const insertQuery = `INSERT INTO loginhis (pkey) VALUES ('${pkey}')`;
        db.executeQuery(insertQuery)
            .then(() => {
                res.json({ ret:"0000", message: "Login successfully." });
            })
            .catch((insertError) => {
                console.error(insertError);
                res.status(500).json({ ret:"-0010", error: "An error occurred while login." });
            })
});

//LOGOUT 처리 -- 중복로그인 허용 시, 세션키 추가 해야하나?
app.get('/logout', (req, res) => {
    const pkey = req.query.pkey; // URL 파라미터로부터 pkey 값을 받아옴
    if (!pkey) {
        res.status(400).json({ ret:"-0009", error: "Missing pkey parameter." });
        return;
    }
        const updateQuery = `UPDATE loginhis SET logout_time = CURRENT_TIMESTAMP WHERE pkey = '${pkey}' AND logout_time IS NULL`;
        db.executeQuery(updateQuery)
            .then(() => {
                res.json({ ret:"0000", message: "Logout successfully." });
            })
            .catch((updateError) => {
                console.error(updateError);
                res.status(500).json({ ret:"-0010", error: "An error occurred while logout." });
            })
});


//Login 완료페이지
app.get('/main', (req, res) => {
    res.send('SThereum main\n');
});

db.connect();

app.listen(PORT, () => console.log(`server is running ${PORT}`));