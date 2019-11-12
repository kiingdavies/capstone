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
    const authorid = request.body.authorid;
    const message = request.body.message;
    const articleid = request.body.articleid;
    const createdon = request.body.createdon;
    const title = request.body.title;
   
    let values = [authorid, message, articleid, createdon, title];
    pool.connect((err, db, done) => {

        db.query('INSERT INTO article (authorid, message, articleid, createdon, title) VALUES($1, $2, $3, $4, $5)', [...values])
        .then(() => {
            response.status(201).json({
                status: "success",
                message: "article posted successfully!"
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
router.patch('/:articleid',(request, response) => {
    const authorid = request.body.authorid;
    const message = request.body.message;
    const createdon = request.body.createdon;
    const title = request.body.title;
    const articleid = parseInt(request.params.articleid);
   
    let values = [ authorid, message, createdon, title, articleid];
    pool.connect((err, db, done) => {
       
        db.query('UPDATE "article" SET "authorid"=$1,"message"=$2 , "createdon"=$3 , "title"=$4 WHERE "articleid"=$5', [...values]) 
            .then(() => {
                response.status(201).json({
                    status: "success",
                    message: "article updated successfully!"
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
router.delete('/:articleid', (request, response) => {
    var articleid = request.params.articleid;
    pool.connect((err, db, done) => {

        db.query('DELETE FROM article WHERE articleid = $1', [articleid]) 
        .then(() => {
            response.status(201).json({
                status: "success",
                message: "article deleted successfully!"
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

    db.query('SELECT * FROM article')
    .then((article) => {
        response.status(200).json({
            status: "success",
            data: article.rows
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
    if(!isNaN(req.params.articleid)) return next();
    next(new Error('Invalid Article ID'));
}

// GET one record
router.get('/:articleid', isValidId, (req, res) => {
    const articleid = req.params.articleid;
    pool.connect((err, db, done) => {
     
        db.query('SELECT * FROM article WHERE articleid = $1', [articleid])
        .then((article) => {
            res.status(200).json({
                status: "success",
                data: article.rows
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