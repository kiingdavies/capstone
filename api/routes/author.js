const pg = require('pg');
const express = require('express');
const router = express.Router();
const app = express();
app.use(express.json());


// POSTGRESQL connection

const pool = new pg.Pool({
    port: 5432,
    password: '',
    database: 'teamwork',
    max: 10,
    host: 'localhost',
    user: 'postgres'
});

// POST request
router.post('/', (request, response) => {
    const message = request.body.message;
    const token = request.body.token;
    const authorid = request.body.authorid;
   
    let values = [ message, token, authorid];
    pool.connect((err, db, done) => {
    
        db.query('INSERT INTO author (message, token, authorid) VALUES($1, $2, $3)', [...values]) 
        .then(() => {
            response.status(201).json({
                status: "success",
                message: "author posted successfully!"
            })
        }).catch((error) => {
            console.log(error)
            response.status(400).json({
                error: error,
            })
        })
    })
});

// UPDATE request
router.patch('/:authorid',(request, response) => {
    const message = request.body.message;
    const token = request.body.token;
    const authorid = parseInt(request.params.authorid);
   
    let values = [ message, token, authorid];
    pool.connect((err, db, done) => {
       
        db.query('UPDATE "author" SET "message"=$1 , "token"=$2 WHERE "authorid"=$3', [...values]) 
            .then(() => {
                response.status(201).json({
                    status: "success",
                    message: "author updated successfully!"
                })
            }).catch((error) => {
                console.log(error)
                response.status(400).json({
                    error: error,
                })
        })
    })
})

// DELETE request
router.delete('/:authorid', (request, response) => {
    var authorid = request.params.authorid;
    pool.connect((err, db, done) => {

        db.query('DELETE FROM author WHERE authorid = $1', [authorid]) 
        .then(() => {
            response.status(201).json({
                status: "success",
                message: "author deleted successfully!"
            })
        }).catch((error) => {
            console.log(error)
            response.status(400).json({
                error: error,
            })
        })
    })
});

// GET request
router.get('/', (request, response) => {
    pool.connect((err, db, done) => {

    db.query('SELECT * FROM author')
    .then((author) => {
        response.status(200).json({
            status: "success",
            data: author.rows
        })
    }).catch((error) => {
        console.log(error)
        response.status(400).json({
            error: error,
        })
    })
})
});

//Middleware to validate ID for GET one item request
function isValidId(req, res, next) {
    if(!isNaN(req.params.authorid)) return next();
    next(new Error('Invalid Author ID'));
}

// GET one record
router.get('/:authorid', isValidId, (req, res) => {
    const authorid = req.params.authorid;
    pool.connect((err, db, done) => {
     
        db.query('SELECT * FROM author WHERE authorid = $1', [authorid])
        .then((author) => {
            res.status(200).json({
                status: "success",
                data: author.rows
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
