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

//LOGIN 처리
app.get('/login', (req, res) => {
    const pkey = req.query.pkey; // URL 파라미터로부터 pkey 값을 받아옴
    if (!pkey) {
        res.status(400).json({ error: "Missing pkey parameter." });
        return;
    }

        const insertQuery = `INSERT INTO loginhis (pkey) VALUES ('${pkey}')`;
        db.executeQuery(insertQuery)
            .then(() => {
                res.json({ message: "Login successfully." });
            })
            .catch((insertError) => {
                console.error(insertError);
                res.status(500).json({ error: "An error occurred while login." });
            })
});

//Login 완료페이지
app.get('/main', (req, res) => {
    res.send('SThereum main\n');
});

db.connect();

app.listen(PORT, () => console.log(`server is running ${PORT}`));