// require POSTGRESQL connection and others
// const pg = require('pg');
const express = require('express');
const router = express.Router();
// const app = express();
// app.use(express.json());

// POSTGRESQL connection
const adminCtrl = require('../controllers/admin');
const adminCreateUser = require('../controllers/employee');
// const adminCreateTable = require('../controllers/createTables');
// const adminDelete = require('../controllers/createTables');


router.post('/create-user', adminCreateUser.signup);
router.post('/signin', adminCtrl.signin);
router.post('/signin', adminCreateUser.signin);
// router.post('/create-user', adminCreateTable.createUsersTable);
// router.post('/delete', adminDelete.deleteUser);

module.exports = router;