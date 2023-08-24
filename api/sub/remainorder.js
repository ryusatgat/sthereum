const DB = require("../lib/db");

async function run(req, res) {
    const db = DB.getInstance();
    const pkey = req.query.pkey;    
    
    if (!pkey) {
        return res.status(400).json({ ret: -9, error: "Missing parameter..." });
    }

    const query = {
        text: 'SELECT * FROM ORDER_STO WHERE PKEY = $1 AND ORDER_QTY <> CONTRACT_QTY ORDER BY ORDERTIME DESC',
        values: [pkey]
    }

    try {
        // Execute the query
        const remainOrdersResult = await db.executeQuery(query);
        const remainOrders = remainOrdersResult.rows;
        res.json({ ret: 0, message: "Remain order returned", data: remainOrders });
    } catch (queryError) {
        console.error(queryError);
        res.status(500).json({ ret: -10, error: "An error occurred while retrieving order list" });
    }
} 

exports.run = run;