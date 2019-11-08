const pg = require('pg');
const express = require('express');
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

// POST request
router.post('/', (request, response) => {
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
                message: "feed posted successfully!"
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
router.patch('/:feedid',(request, response) => {
    const createdon = request.body.createdon;
    const title = request.body.title;
    const gifurl = request.body.gifurl;
    const authorid = request.body.authorid;
    const feedid = parseInt(request.params.feedid);
   
    let values = [ createdon, title, gifurl, authorid, feedid];
    pool.connect((err, db, done) => {
       
        db.query('UPDATE "feed" SET "createdon"=$1 , "title"=$2, "gifurl"=$3, "authorid"=$4 WHERE "feedid"=$5', [...values]) 
            .then(() => {
                response.status(201).json({
                    status: "success",
                    message: "feed updated successfully!"
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
router.delete('/:feedid', (request, response) => {
    var feedid = request.params.feedid;
    pool.connect((err, db, done) => {

        db.query('DELETE FROM feed WHERE feedid = $1', [feedid]) 
        .then(() => {
            response.status(201).json({
                status: "success",
                message: "feed deleted successfully!"
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

    db.query('SELECT * FROM feed')
    .then((feed) => {
        response.status(200).json({
            status: "success",
            data: feed.rows
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