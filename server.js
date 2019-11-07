const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const pg = require('pg');
const cors = require('cors');
const PORT = 3000;
// const app = express();
const http = require('http');
const app = require('./app');
const server = http.createServer(app);

// app.use(morgan('dev'));
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// const pool = new pg.Pool({
//     port: 5432,
//     password: 'adedeji007',
//     database: 'teamwork',
//     max: 10,
//     host: 'localhost',
//     user: 'postgres'
// });



// // CORS to make sure the front end can safely make calls to your app.
// app.use((request, response, next) => {
//     response.setHeader('Access-Control-Allow-Origin', '*');
//     response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//     response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//     next();
//   });

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

// ROUTES
app.post('/gif', function(request, response) {
    var gifid = request.body.gifid;
    var message = request.body.message;
    var createdon = request.body.createdon;
    var title = request.body.title;
    var imageurl = request.body.imageurl;
    let values = [gifid, message, createdon, title, imageurl];
    pool.connect((err, db, done) => {
    if(err) {
        return response.status(400).send(err) //return console.log(err)
    }
    else {
        db.query('INSERT INTO gif (gifid, message, createdon, title, imageurl) VALUES($1, $2, $3, $4, $5)', [...values], (err, table) => {
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

// // UPDATE request
// app.patch('/:gifid', function(request, response) {
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
app.delete('/gif/:gifid', function(request, response) {
    var id = request.params.gifid;
    pool.connect((err, db, done) => {
    if(err) {
        return response.status(400).send(err)
    }
    else {
        db.query('DELETE FROM gif WHERE gifid = $1', [id], (err, result) => {
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
app.get('/', function(request, response) {
    pool.connect((err, db, done) => {
    if(err) {
        return response.status(400).send(err)
    }
    else {
        db.query('SELECT * FROM gif', (err, table) => {
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



server.listen(PORT, () => console.log('Listening on port  ' + PORT));
