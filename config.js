const mysql = require('mysql');
const config = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'listcontact',
};
const pool = mysql.createPool(config);
exports.pool = pool;
