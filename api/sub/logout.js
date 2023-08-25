const DB = require("../lib/db");

async function run(req, res) {
    const db = DB.getInstance();
    const pkey = req.query.pkey;    
    
    if (!pkey) {
        return res.status(400).json({ ret: -9, error: "Missing parameter..." });
    }

    const query = {
        text: 'UPDATE loginhis SET logout_time = CURRENT_TIMESTAMP WHERE pkey = $1 AND logout_time IS NULL',
        values: [pkey]
    }

    await db.executeQuery(query)
        .then(() => {
            res.json({ ret: 0, message: "Logout successful" });
        })
        .catch((insertError) => {
            console.error(insertError);
            res.status(500).json({ ret: -10, error: "An error occurred while logout" });
        })
} 

exports.run = run;