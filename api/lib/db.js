const config = require('../config')
const { Pool } = require('pg');

class DBPool {
    constructor() {
        this.client = new Pool(config.db);
        this.client.connect().then(
            console.log('Database is connected successfully')
        );
    }

    executeQuery(...args) {
        return this.client.query(...args);
    }
}

module.exports = class DB {
    constructor() {
        throw new Error('use getInstance method!');
    }
    
    static getInstance() {
        if (!this.instance) {
            this.instance = new DBPool();
        }
        return this.instance;
    }
}