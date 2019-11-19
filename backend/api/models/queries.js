const Pool = require('pg').Pool;
const dotenv = require('dotenv');
const db = require('../db');
dotenv.config();


const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

pool.on('connect', () => {
  console.log('connected to the Database');
});

module.exports = db;