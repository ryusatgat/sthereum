const DB = require("../lib/db");

async function run(req, res) {
    const db = DB.getInstance();
    const pkey = req.query.pkey;
    const symbol = req.query.symbol;
    const ordertype = req.query.ordertype;
    const price = req.query.price;
    const orderqty = req.query.orderqty;
    const orgorderid = req.query.orgorderid;

    if (!pkey || !symbol || !ordertype || !price || !orderqty) {
        return res.status(400).json({ ret: -9, error: "Missing parameter(s)..." });
    }

    if( ordertype === '3' || ordertype === '4') {
        if (!orgorderid) {
            return res.status(400).json({ ret: -9, error: "Missing parameter(s)..." });
        }
    }

    try {
        await insertOrder(pkey, symbol, ordertype, price, orderqty, orgorderid);
        await executeOrders(symbol);
        await recreateHogaTable(symbol);
    }
    catch (error) {
        console.error("An error occurred while inserting order:", error);
    }
}

async function insertOrder(pkey, symbol, ordertype, price, order_qty, orgorderid) {
    const db = DB.getInstance();

    //매수, 매도 주문일 경우
    const insertQuery = {
        text: 'INSERT INTO ORDER_STO (pkey, symbol, ordertype, price, order_qty) VALUES ($1, $2, $3, $4, $5)',
        values: [pkey, symbol, ordertype, price, order_qty]
    };

    //정정,취소 주문일 경우 원주문 저장
    const insertChangeFromOrderQuery = {
        text: 'INSERT INTO ORDERCHANGE_STO (pkey, symbol, ordertype, price, order_qty, org_ord_id) SELECT pkey, symbol, ordertype, price, order_qty, orderid FROM ORDER_STO WHERE orderid = $1',
        values: [orgorderid]
    };

    //정정,취소 주문일 경우 원주문 삭제
    const deleteQuery = {
        text: 'DELETE FROM ORDER_STO WHERE ORDERID = $1',
        values: [orgorderid]
    }

    try {
        if(ordertype === '1' || ordertype === '2' || ordertype === '3')
        await db.executeQuery(insertQuery);
        console.log("Order inserted successfully.");

        if(ordertype === '3'){
            await db.executeQuery(insertChangeFromOrderQuery);
            await db.executeQuery(deleteQuery);
            console.log("Order modified successfully");
        }else if(ordertype === '4'){
            await db.executeQuery(insertChangeFromOrderQuery);
            await db.executeQuery(deleteQuery);
            console.log("Order deleted successfully");
        }
    } catch (error) {
        console.error("An error occurred while inserting order:", error);
    }
}

async function executeOrders(symbol) {
    const db = DB.getInstance();

    try {
        const checkOrdersQuery = {
            text: 'SELECT * FROM ORDER_STO WHERE SYMBOL = $1 AND ORDER_QTY <> CONTRACT_QTY ORDER BY ordertime',
            values: [symbol]
        };

        const orders = await db.executeQuery(checkOrdersQuery);

        for (const order of orders.rows) {
            const remainingQuantity = order.order_qty - order.contract_qty;

            const matchingOrdersQuery = {
                text: 'SELECT * FROM ORDER_STO WHERE SYMBOL = $1 AND ORDERTYPE != $2 AND PRICE = $3 AND CONTRACT_QTY < ORDER_QTY ORDER BY ORDERTIME',
                values: [order.symbol, order.ordertype, order.price]
            };

            const matchingOrders = await db.executeQuery(matchingOrdersQuery);

            for (const matchingOrder of matchingOrders.rows) {
                const matchingRemainingQuantity = matchingOrder.order_qty - matchingOrder.contract_qty;

                const executedQuantity = Math.min(remainingQuantity, matchingRemainingQuantity);

                // Determine buy_pkey and sell_pkey based on ordertype
                const buy_pkey = order.ordertype === "1" ? order.pkey : matchingOrder.pkey;
                const sell_pkey = order.ordertype === "1" ? matchingOrder.pkey : order.pkey;
                const buy_orderid = order.ordertype === "1" ? order.orderid : matchingOrder.orderid;
                const sell_orderid = order.ordertype === "1" ? matchingOrder.orderid : order.orderid;

                const existingContractQuery = {
                    text: 'SELECT * FROM CONTRACT_STO WHERE symbol = $1 AND price = $2 AND buy_orderid = $3 AND sell_orderid = $4',
                    values: [order.symbol, order.price, buy_orderid, sell_orderid]
                };
            
                const existingContract = await db.executeQuery(existingContractQuery);
            
                if (existingContract.rows.length === 0) {
                    // Insert into CONTRACT_STO
                    await insertContract(order.symbol, order.price, executedQuantity, buy_pkey, sell_pkey, buy_orderid, sell_orderid);

                    // Update contract_qty for both orders
                    await updateContractQty(order.orderid, matchingOrder.orderid, executedQuantity);
                    //await updateContractQty(matchingOrder.orderid, executedQuantity);
                    console.log(`Orders ${order.orderid} and ${matchingOrder.orderid} matched and executed ${executedQuantity} shares.`);
                }
            }
        }
    } catch (error) {
        console.error("An error occurred while executing orders:", error);
    }
}

async function updateContractQty(orderId, matchingorderid, executedQuantity) {
    const db = DB.getInstance();

    const updateOrderIdQtyQuery = {
        text: 'UPDATE ORDER_STO SET contract_qty = contract_qty + $1 WHERE orderid = $2',
        values: [executedQuantity, orderId]
    };

    const updateMatchingOrderIdQtyQuery = {
        text: 'UPDATE ORDER_STO SET contract_qty = contract_qty + $1 WHERE orderid = $2',
        values: [executedQuantity, matchingorderid]
    };

    await db.executeQuery(updateOrderIdQtyQuery);
    await db.executeQuery(updateMatchingOrderIdQtyQuery);
}

async function insertContract(symbol, price, quantity, buy_pkey, sell_pkey, buy_orderid, sell_orderid) {
    const db = DB.getInstance();

    const insertContractQuery = {
        text: 'INSERT INTO CONTRACT_STO (symbol, price, quantity, buy_pkey, sell_pkey, buy_orderid, sell_orderid) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        values: [symbol, price, quantity, buy_pkey, sell_pkey, buy_orderid, sell_orderid]
    };
    await db.executeQuery(insertContractQuery);
}


async function recreateHogaTable(symbol) {
    const db = DB.getInstance();

    try {
        const deleteQuery = {
            text: 'DELETE FROM HOGA_STO WHERE SYMBOL = $1',
            values: [symbol]
        };
        // Clear existing HOGA_STO table
        await db.executeQuery(deleteQuery);

        // Retrieve orders from ORDER_STO and update HOGA_STO
        const ordersQuery = {
            text: 'SELECT SYMBOL, PRICE, ORDERTYPE, SUM(ORDER_QTY-CONTRACT_QTY) AS QTY FROM ORDER_STO WHERE SYMBOL = $1 AND contract_qty <> order_qty GROUP BY SYMBOL, PRICE, ORDERTYPE',
            values: [symbol]
        };

        const orders = await db.executeQuery(ordersQuery);

        for (const order of orders.rows) {
            await updateHogaTable(order.symbol, order.ordertype, order.price, order.qty);
        }

        console.log("HOGA_STO table recreated successfully.");
    } catch (error) {
        console.error("An error occurred while recreating HOGA_STO:", error);
    }
}

async function updateHogaTable(symbol, ordertype, price, order_qty) {
    const db = DB.getInstance();

    try {
        const existingHogaQuery = {
            text: 'SELECT * FROM HOGA_STO WHERE symbol = $1 AND price = $2',
            values: [symbol, price]
        };

        const existingHoga = await db.executeQuery(existingHogaQuery);

        if (existingHoga.rows.length === 0) {
            const insertHogaQuery = {
                text: 'INSERT INTO HOGA_STO (symbol, hoga_type, price, quantity) VALUES ($1, $2, $3, $4)',
                values: [symbol, ordertype, price, order_qty]
            };

            await db.executeQuery(insertHogaQuery);
        } else {
            const updateHogaQuery = {
                text: 'UPDATE HOGA_STO SET quantity = quantity + $1 WHERE symbol = $2 AND price = $3',
                values: [order_qty, symbol, price]
            };

            await db.executeQuery(updateHogaQuery);
        }
    } catch (error) {
        console.error("An error occurred while updating HOGA_STO:", error);
    }
}

exports.run = run;