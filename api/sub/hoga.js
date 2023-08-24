const DB = require("../lib/db");

async function run(req, res) {
    const db = DB.getInstance();
    const symbol = req.query.symbol;    
    
    if (!symbol) {
        return res.status(400).json({ ret: -9, error: "Missing parameter..." });
    }

    const query = {
        text: 'SELECT * FROM HOGA_STO WHERE symbol = $1',
        values: [symbol]
    }

    try {
        const result = await db.executeQuery(query);
        const hogaList = result.rows;
        res.json({ ret: 0, message: "Hoga returned", data: hogaList });
    } catch (queryError) {
        console.error(queryError);
        res.status(500).json({ ret: -10, error: "An error occurred while retrieving hoga" });
    }
} 

exports.run = run;