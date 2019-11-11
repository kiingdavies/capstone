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
function validUser(user) {
    const validEmail = typeof user.email == 'string' && 
                        user.email.trim() != '';
    const validPassword = typeof user.password == 'string' && 
                            user.password.trim() != '' && 
                            user.password.trim().length >= 6;

    return validEmail && validPassword;
}

// POST route
router.post('/', (request, response, next) => {
    const firstname = request.body.firstname;
    const lastname = request.body.lastname;
    const email = request.body.email;
    const password = request.body.password;
    const gender = request.body.gender;
    const jobrole = request.body.jobrole;
    const department = request.body.department;
    const address = request.body.address;

    let values = [firstname, lastname, email, password, gender, jobrole, department, address];
    pool.connect((err, db, done) => {
   
        db.query('INSERT INTO users ( firstname, lastname, email, password, gender, jobrole, department, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [...values]) 
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

// GET one record
router.get('/:email', (req, res) => {
    const email = req.params.email;
    pool.connect((err, db, done) => {
     
        db.query('SELECT * FROM users WHERE email = $1', [email])
        .then((users) => {
            res.status(200).json({
                status: "success",
                data: users.rows
            })
        }).catch((error) => {
            console.log(error)
            res.status(400).json({
                error: error,
                })
            })
        })
});

module.exports = router;