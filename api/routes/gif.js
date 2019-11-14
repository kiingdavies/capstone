const pg = require('pg');
const express = require('express');
const cloudinary = require('cloudinary').v2;
const fileupload = require('express-fileupload');
const cloud = require('api\config\cloudinary-config.js')
const router = express.Router();
const app = express();
const date = new Date();

//ROUTER MIDDLEWARES
app.use(express.json());
app.use(fileupload());

// POSTGRESQL connection
const pool = new pg.Pool({
    port: 5432,
    password: 'adedeji007',
    database: 'teamwork',
    max: 10,
    host: 'localhost',
    user: 'postgres'
});

//CLOUDINARY CONFIG
// cloudinary.config({
//     cloud_name: 'kingdavies',
//     api_key: '316716334214498',
//     api_secret: 'Div1XEDprcmytn48_Y39JY4cqjg'
// })
// Testing cloud posts
router.post('/', (req, res) => {
    try{
            const imageDetails = {
               title: req.body.title,
             }
   // Checks if Gif title exist already
    pool.connect((err, db, done) => { 
        db.query('SELECT * FROM "gif" WHERE "title" = $1',[imageDetails.title])
         .then((result) => {
             if(result.rowCount >= 1)
             {
                 res.status(400).json({
                     status: "error",
                     message: "file already exist"
                 })
             }
    else
         {
            const imageDetails = {
                userid: req.body.userid,
                title: req.body.title,
                image: req.files[0].path,
                imageid: ''
                }

//                 // Post image in cloudinary
                cloud.uploads(imageDetails.image).then((result) => {
                    const imageDetails = {
                        userid: req.body.UserId,
                        title: req.body.title,
                        image: result.url,
                        imageid: result.id   
                    }
//                     // Track the file in the database
// pool.connect((err, db, done) => { 
                    db.query('INSERT INTO "Gifs"("UserID","title","imageUrl","imageId","createdAt") VALUES ($1, $2, $3, $4,$5)',
                    [imageDetails.useridd,imageDetails.title,imageDetails.image,imageDetails.imageid,date])
                    .then(() => {
                        res.status(200).json({
                            status: "success",
                            message: "Gif successfuly uploaded"
                        })
                     }).catch(() => {
                        res.status(400).json({
                            status: "error",
                            message : "An error Occurred"
                        })
                    })
// })
                }).catch((error) => {
                    console.error(error);
                    res.status(400).json({
                        status: "error",
                        message: "Failed to Upload your File"
                    })
                })
// }
         }
     }).catch(() => {

         res.status(400).json({
            status: "error",
            message: "an error occurred, please try again"
         })
     }) 
})
}catch(execptions){
        console.log(execptions)
        }

});







//     let values = [gifid, message, createdon, title, imageurl];
//     pool.connect((err, db, done) => {
   
//         db.query('INSERT INTO gif (gifid, message, createdon, title, imageurl) VALUES($1, $2, $3, $4, $5)', [...values]) 
//         .then(() => {
//             response.status(201).json({
//                 status: "success",
//                 message: "gif posted successfully!"
//             })
//         }).catch((error) => {
//             console.log(error)
//             response.status(400).json({
//                 error: error,
//             })
//         })
//     })
// });
















// POST request
// router.post('/', (request, response) => {
//     const gifid = request.body.gifid;
//     const message = request.body.message;
//     const createdon = request.body.createdon;
//     const title = request.body.title;
//     const imageurl = request.body.imageurl;

//     let values = [gifid, message, createdon, title, imageurl];
//     pool.connect((err, db, done) => {
   
//         db.query('INSERT INTO gif (gifid, message, createdon, title, imageurl) VALUES($1, $2, $3, $4, $5)', [...values]) 
//         .then(() => {
//             response.status(201).json({
//                 status: "success",
//                 message: "gif posted successfully!"
//             })
//         }).catch((error) => {
//             console.log(error)
//             response.status(400).json({
//                 error: error,
//             })
//         })
//     })
// });

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
    const gifid = request.params.gifid;
    pool.connect((err, db, done) => {

        db.query('DELETE FROM gif WHERE gifid = $1', [gifid]) 
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

//Middleware to validate ID for GET one item request
function isValidId(req, res, next) {
    if(!isNaN(req.params.gifid)) return next();
    next(new Error('Invalid Gif ID'));
}

// GET one record
router.get('/:gifid', isValidId, (req, res) => {
    const gifid = req.params.gifid;
    pool.connect((err, db, done) => {
     
        db.query('SELECT * FROM gif WHERE gifid = $1', [gifid])
        .then((gif) => {
            res.status(200).json({
                status: "success",
                data: gif.rows
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