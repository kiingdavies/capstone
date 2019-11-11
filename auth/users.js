const pg = require('pg');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
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
function validUser(users) {
    const validEmail = typeof users.email == 'string' && 
                        users.email.trim() != '';
    const validPassword = typeof users.password == 'string' && 
                            users.password.trim() != '' && 
                            users.password.trim().length >= 6;

    return validEmail && validPassword;
}

// POST route
router.post('/', (request, response, next) => {

        const hash = bcrypt.hash(request.body.password, 10);
        const firstname = request.body.firstname;
        const lastname = request.body.lastname;
        const email = request.body.email;
        const password = hash;
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
                    message: "User Added Successfully!"
                })
            }).catch((error) => {
                console.erro(error)
                response.status(400).json({
                    status: "error",
                    error: "An error occured, Please Try again",
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