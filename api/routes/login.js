const pg = require('pg');
const express = require('express');
const router = express.Router();
const app = express();
const jwt = require('jsonwebtoken');

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
router.post('/', (req, res) => {
    // Mock user 
    const user = {
        id: 1,
        username: 'brad',
        email: 'brad@gmail.com'
    }
    pool.connect((err, db, done) => {

        db.query('SELECT NOW()')
        .then(() => {
            jwt.sign({user}, 'secretkey', (err, token) => {
                res.json({
                    token
                });
            });
        }).catch((error) => {
            console.log(error)
            response.status(400).json({
                error: error,
                })
            })
        })
    // jwt.sign({user}, 'secretkey', (err, token) => {
    //     res.json({
    //         token
    //     });
    // });
});

//GET route
// router.get('/', (req, res) => {
//     pool.connect((err, db, done) => {

//     db.query('SELECT NOW()')
//     .then(() => {
//         res.status(200).json({
            
//             message: 'Welcome'
//         })
//     }).catch((error) => {
//         console.log(error)
//         response.status(400).json({
//             error: error,
//             })
//         })
//     })
// });

module.exports = router;