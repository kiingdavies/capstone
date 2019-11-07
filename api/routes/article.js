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
router.post('/', function(request, response){
    var authorid = request.body.authorid;
    var message = request.body.message;
    var articleid = request.body.articleid;
    var createdon = request.body.createdon;
    var title = request.body.title;
   
    let values = [authorid, message, articleid, createdon, title];
    pool.connect((err, db, done) => {
    if(err) {
        return response.status(400).send(err) //return console.log(err)
    }
    else {
        db.query('INSERT INTO article (authorid, message, articleid, createdon, title) VALUES($1, $2, $3, $4, $5)', [...values], (err, table) => {
            if(err) {
                return response.status(400).send(err)
            }
            else {
                console.log('DATA INSERTED');
                db.end();
                response.status(201).send('Data Inserted')
            }
        })
    }
})
});

// UPDATE request
// router.patch('/:gifid', function(request, response) {
//     var id = request.params.gifid;
//     pool.connect((err, db, done) => {
//         if(err) {
//             return response.status(400).send(err)
//         }
//         else {
//             db.query('UPDATE gif SET title = "Dramatic" WHERE gifid= $1', [id], (err, result) => {
//                 if(err) {
//                     return response.status(400).send(err)
//                 }
//                 else {
//                     return response.status(200).send({message: 'record updated successfully!'});
                    
//                 }
//             })
//         }
//     })
// })

// DELETE request
router.delete('/:articleid', function(request, response) {
    var id = request.params.articleid;
    pool.connect((err, db, done) => {
    if(err) {
        return response.status(400).send(err)
    }
    else {
        db.query('DELETE FROM article WHERE articleid = $1', [id], (err, result) => {
            if(err) {
                return response.status(400).send(err)
            }
            else {
                return response.status(200).send({message: 'record deleted successfully!'});
                
            }
        })
    }
})
});

// GET request
router.get('/', function(request, response) {
    pool.connect((err, db, done) => {
    if(err) {
        return response.status(400).send(err)
    }
    else {
        db.query('SELECT * FROM article', (err, table) => {
            // done();
            if(err) {
                return response.status(400).send(err)
            }
            else {
                return response.status(200).send(table.rows);
            }
        })
    }
})
});

module.exports = router;