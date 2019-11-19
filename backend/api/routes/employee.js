// require POSTGRESQL connection and others
// const pg = require('pg');
const express = require('express');
const router = express.Router();
// const app = express();
// app.use(express.json());

// POSTGRESQL connection
const employeeSignin = require('../controllers/employee');
// const adminCreateTable = require('../controllers/createTables');
// const adminDelete = require('../controllers/createTables');



router.post('/signin', employeeSignin.signin);
// router.post('/create-user', adminCreateTable.createUsersTable);
// router.post('/delete', adminDelete.deleteUser);

module.exports = router;