const DB = require("../lib/db");

async function run(req, res) {
    const db = DB.getInstance();
    const pkey = req.query.pkey;    
    
    if (!pkey) {
        return res.status(400).json({ ret: -9, error: "Missing parameter..." });
    }

    const query = {
        text: 'SELECT * FROM CONTRACT_STO WHERE BUY_PKEY = $1 OR SELL_PKEY = $1 ORDER BY CONTRACTTIME DESC',
        values: [pkey]
    }

    try {
        const result = await db.executeQuery(query);
        const contractList = result.rows;
        res.json({ ret: 0, message: "contractlist returned", data: contractList });
    } catch (queryError) {
        console.error(queryError);
        res.status(500).json({ ret: -10, error: "An error occurred while retrieving hoga" });
    }
} 

exports.run = run;