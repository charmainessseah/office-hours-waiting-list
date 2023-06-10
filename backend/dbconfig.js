// import mysql from 'mysql'
import dotenv from 'dotenv'
dotenv.config()

import pgPromise from 'pg-promise';

const connectionString = process.env.CONNECTION_STRING
const pgp = pgPromise()
const connection = pgp(connectionString)


// var connection = mysql.createConnection({
//   host: "avocado.ciip1144g4cq.us-east-1.rds.amazonaws.com",
//   user: "admin",
//   password: "teamAvocado!",
//   port: "3306",
//   database: "office_hours_waiting_list",
//   // host: process.env.DB_HOST,
//   // port: process.env.DB_PORT,
//   // user: process.env.DB_USER,
//   // password: process.env.DB_PASSWORD,
// });

// connection.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

export default connection;