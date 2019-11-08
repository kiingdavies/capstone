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
    const gifid = request.body.gifid;
    const message = request.body.message;
    const createdon = request.body.createdon;
    const title = request.body.title;
    const imageurl = request.body.imageurl;

    let values = [gifid, message, createdon, title, imageurl];
    pool.connect((err, db, done) => {
   
        db.query('INSERT INTO gif (gifid, message, createdon, title, imageurl) VALUES($1, $2, $3, $4, $5)', [...values]) 
        .then(() => {
            response.status(201).json({
                status: "success",
                message: "gif posted successfully!"
            })
        }).catch((error) => {
            console.log(error)
            response.status(400).json({
                error: error,
            })
        })
    })
});

//Code model sample
// pool.connect((err, db, done) => {
//     if(err) {
//         return console.log(err)
//     }
//     else {
//         db.query('SELECT * FROM gif', (err, table) => {
//             if(err) {
//                 return console.log(err)
//             }
//             else {
//                 console.log(table.rows[1].title)
                
//             }
//         })
//     }
// })

// UPDATE request
router.patch('/:gifid',(request, response) => {
    const message = request.body.message;
    const createdon = request.body.createdon;
    const title = request.body.title;
    const imageurl = request.body.imageurl;
    const gifid = parseInt(request.params.gifid);

    let values = [message, createdon, title, imageurl, gifid];
    pool.connect((err, db, done) => {

        db.query('UPDATE gif SET "message"=$1 , "createdon"=$2 , "title"=$3, "imageurl"=$4 WHERE "gifid"=$5', [...values])
            .then(() => {
                response.status(201).json({
                    status: "success",
                    message: "gif updated successfully!"
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
router.delete('/:gifid', (request, response) => {
    var id = request.params.gifid;
    pool.connect((err, db, done) => {

        db.query('DELETE FROM gif WHERE gifid = $1', [id]) 
        .then(() => {
            response.status(201).json({
                status: "success",
                message: "gif deleted successfully!"
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

    db.query('SELECT * FROM gif')
    .then((gif) => {
        response.status(200).json({
            status: "success",
            data: gif.rows
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