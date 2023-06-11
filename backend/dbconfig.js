import dotenv from 'dotenv'
dotenv.config()

import pgPromise from 'pg-promise';

const connectionString = process.env.CONNECTION_STRING
const pgp = pgPromise()
const connection = pgp(connectionString)

export default connection;