const { Client } = require("pg");
const client = new Client({ // for test...
    user: "postgres",
    host: "192.168.0.10",
    database: "postgres",
    password: "postgres",
    port: 5432
});

async function connect() {
    await client.connect();
} 

async function disconnect() {
    return await client.end();
}

async function executeQuery(...args) {
    return await client.query(...args);
}

exports.connect = connect;
exports.disconnect = disconnect;
exports.executeQuery = executeQuery;