const pg = require('pg');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Helper = require('./authHelper');
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

// BCRYPT & HASHING of PASSWORD
// SIGNUP POST route
router.post('/',(request, response, next) => {
        
    const hash = bcrypt.hash(request.body.password, 10);
    
        const firstname = request.body.firstname;
        const lastname = request.body.lastname;
        const email = request.body.email;
        const password =  hash;
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
                    message: "User Account Successfully created!"
                })
            }).catch((error) => {
                console.error(error)
                response.status(500).json({
                    status: "error",
                    error: "An error occured, Please Try again",
                })
            })
        })
});

// LOGIN POST route
// router.post('/',(request, response, next) => {
//     const email = request.body.email;
//     const password = request.body.password;

//     if(!email || !password)
//     {
//         return response.status(400).send({'message': 'Some values are missing'});
//     }

//     if(!Helper.isValidEmail(email)) {
//         return response.status(401).send({'message': 'Please enter a valid email address'});
//     }
     
//     pool.connect((err, db, done) => {
//         db.query('SELECT * FROM users WHERE email = $1', [email]) 
//             .then((result) => {
//                 if(result.rows[0] == null)
//                 {
//                     response.status(401).json({
//                         status: "error",
//                         message: "Account doesnt exist. Please Check and Try Again!"
//                     })
//                 }
//                 let passwordHash = result.rows[0].password;
//                 if(!Helper.comparePassword(passwordHash, password))
//                 {
//                     console.log(password)
//                     response.status(400).json({
//                         status: "error",
//                         message: "Incorrect Email/Password"
//                     })  
//                 }
//                 const token = jwt.sign({userId: result.rows[0].password},'RANDOM_KEY',{ expiresIn: '24h'});
//                 response.status(200).json({
//                     status: "success",
//                     data: {
//                         userId: result.rows[0].userid,
//                         token: token
//                     }
//                 })
//         }) 
//     })
// });


// DELETE user by email ROUTE
router.delete('/:email', (request, response) => {
    const email = request.params.email;
    pool.connect((err, db, done) => {

        db.query('DELETE FROM users WHERE email = $1', [email]) 
        .then(() => {
            response.status(201).json({
                status: "success",
                message: "User deleted successfully!"
            })
        }).catch((error) => {
            console.log(error)
            response.status(400).json({
                error: error,
            })
        })
    })
});

//GET all users route
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

// GET one user by email route
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