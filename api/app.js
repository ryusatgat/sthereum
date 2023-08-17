const express = require("express");
const db = require("./lib/db");
const app = express();
const PORT = process.env.PORT || 3080;

app.get('/', (req, res) => {
    res.send('SThereum is active\n');
})

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