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

    db.connect().then(() => {
        const insertQuery = `INSERT INTO loginhis (pkey) VALUES ('${pkey}')`;
        db.executeQuery(insertQuery)
            .then(() => {
                res.json({ message: "Login successfully." });
                res.redirect('/main');
            })
            .catch((insertError) => {
                console.error(insertError);
                res.status(500).json({ error: "An error occurred while login." });
            })
            .finally(() => {
                db.disconnect();
            });
    }).catch((connectError) => {
        console.error(connectError);
        res.status(500).json({ error: "Could not connect to the database." });
    });
});

//Login 완료페이지
app.get('/main', (req, res) => {
    res.send('SThereum main\n');
});

db.connect().then(() => {
    db.executeQuery("SELECT NOW() as time").then((queryResult, queryError) => {
        if(queryError) {
            console.error(queryError);
        } else {
            console.debug(queryResult.rows[0].time);
        }        
        db.disconnect();
    });
});

app.listen(PORT, () => console.log(`server is running ${PORT}`));   