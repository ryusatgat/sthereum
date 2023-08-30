const DB = require("../lib/db");

async function run(req, res) {
    const db = DB.getInstance();
    const pkey = req.query.pkey;    
    
    if (!pkey) {
        return res.status(400).json({ ret: -9, error: "Missing parameter..." });
    }

    const orderListQuery = {
        text: `
            SELECT pkey, symbol, ordertype, price, order_qty, orderid, ordertime
            FROM ORDER_STO
            WHERE pkey = $1
                
            UNION
                
            SELECT pkey, symbol, ordertype, price, order_qty, org_ord_id AS orderid, ordertime
            FROM ORDERCHANGE_STO
            WHERE pkey = $1
            ORDER BY ordertime DESC
        `,
        values: [pkey]
    };
    
    try {
        // Execute the query
        const orderListResult = await db.executeQuery(orderListQuery);
        const orderLists = orderListResult.rows;
        res.json({ ret: 0, message: "orderlist returned", data: orderLists });
    } catch (queryError) {
        console.error(queryError);
        res.status(500).json({ ret: -10, error: "An error occurred while retrieving order list" });
    }
} 

exports.run = run;