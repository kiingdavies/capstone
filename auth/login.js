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

// LOGIN POST route
router.post('/',(request, response, next) => {
    const email = request.body.email;
    const password = request.body.password;

    if(!email || !password)
    {
        return response.status(400).send({'message': 'Some values are missing'});
    }

    if(!Helper.isValidEmail(email)) {
        return response.status(401).send({'message': 'Please enter a valid email address'});
    }
     
    pool.connect((err, db, done) => {
        db.query('SELECT * FROM users WHERE email = $1', [email]) 
            .then((result) => {
                if(result.rows[0] == null)
                {
                    response.status(401).json({
                        status: "error",
                        message: "Account doesnt exist. Please Check and Try Again!"
                    })
                }
                let passwordHash = result.rows[0].password;
                if(!Helper.comparePassword(passwordHash, password))
                {
                    console.log(password)
                    response.status(400).json({
                        status: "error",
                        message: "Incorrect Email/Password"
                    })  
                }
                const token = jwt.sign({userId: result.rows[0].password},'RANDOM_KEY',{ expiresIn: '24h'});
                response.status(200).json({
                    status: "success",
                    data: {
                        userId: result.rows[0].userid,
                        token: token
                    }
                })
        }) 
    })
});

module.exports = router;