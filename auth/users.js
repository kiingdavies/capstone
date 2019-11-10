const pg = require('pg');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

// POSTGRESQL connection
const pool = new pg.Pool({
    port: 5432,
    password: 'adedeji007',
    database: 'teamwork',
    max: 10,
    host: 'localhost',
    user: 'postgres'
});

// JWT
// POST route
router.post('/auth/signup', (req, res) => {
    const feedid = request.body.feedid;
    const createdon = request.body.createdon;
    const title = request.body.title;
    const gifurl = request.body.gifurl;
    const authorid = request.body.authorid;
   
    let values = [ feedid, createdon, title, gifurl, authorid];
    pool.connect((err, db, done) => {
    
        db.query('INSERT INTO feed ( feedid, createdon, title, gifurl, authorid) VALUES($1, $2, $3, $4, $5)', [...values])
        .then(() => {
            response.status(201).json({
                status: "success",
                message: "User Created Successfully!"
            })
        }).catch((error) => {
            console.log(error)
            response.status(400).json({
                error: error,
            })
        })
    })
});

//GET route
router.get('/', (request, response) => {
    pool.connect((err, db, done) => {

        db.query('SELECT * FROM users')
        .then((users) => {
            response.status(200).json({
                status: "success",
                data: users.rows
            })
        }).catch((error) => {
            console.log(error)
            response.status(400).json({
                error: error,
                })
            })
        })
});

module.exports = router;