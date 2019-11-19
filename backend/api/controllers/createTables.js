// db.js
// const { Pool } = require('pg');
// const pool = require('pg').Pool;
const db = require('../db');
const dotenv = require('dotenv');

dotenv.config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL
// });

// pool.on('connect', () => {
//   console.log('connected to the db');
// });

/**
 * Create users Table
 */
const createUsersTable = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      users(
        id UUID PRIMARY KEY,
        firstname VARCHAR(50) NOT NULL,
        lastname VARCHAR(50) NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        gender VARCHAR(10) NOT NULL,
        jobrole VARCHAR(50) NOT NULL,
        department VARCHAR(50) NOT NULL,
        address TEXT NOT NULL,
        created_date TIMESTAMP
      )`;

  db.query(queryText)
    .then((res) => {
      console.log(res);
      db.end();
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });
}

/**
 * Create gif Table
 */
const createUserTable = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      users(
        id UUID PRIMARY KEY,
        email VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
      )`;

  db.query(queryText)
    .then((res) => {
      console.log(res);
      db.end();
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });
}

/**
 * Drop users Table
 */
const dropReflectionTable = () => {
  const queryText = 'DROP TABLE IF EXISTS reflections returning *';
  db.query(queryText)
    .then((res) => {
      console.log(res);
      db.end();
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });
}

/**
 * Drop gif Table
 */
const dropUserTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users returning *';
  db.query(queryText)
    .then((res) => {
      console.log(res);
      db.end();
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });
}

// db.on('remove', () => {
//   console.log('client removed');
//   process.exit(0);
// });

module.exports = {
  createUsersTable,
  
  createUserTable,
  dropReflectionTable,
  dropUserTable
};

require('make-runnable');
