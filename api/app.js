const express = require("express");
const app = express();
const PORT = process.env.PORT || 3080;

app.get('/', (req, res) => {
    res.send('SThereum is active\n');
})

app.listen(PORT, () => console.log(`server is running ${PORT}`));
