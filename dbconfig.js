var mysql = require('mysql');
require('dotenv').config();

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

connection.end();