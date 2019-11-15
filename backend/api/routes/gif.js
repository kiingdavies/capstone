const pg = require('pg');
const express = require('express');
// const cloudinary = require('cloudinary').v2;
const fileupload = require('express-fileupload');
const cloud = require('./cloudinary-config');
const router = express.Router();
const app = express();
const date = new Date();

//ROUTER MIDDLEWARES
app.use(express.json());
app.use(fileupload());

// POSTGRESQL connection
const pool = new pg.Pool({
    port: 5432,
    password: '',
    database: 'teamwork',
    max: 10,
    host: 'localhost',
    user: 'postgres'
});


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
                        userid: req.body.userid,
                        title: req.body.title,
                        image: result.url,
                        imageid: result.id   
                    }
//                     // Track the file in the database
// pool.connect((err, db, done) => { 
                    db.query('INSERT INTO "gif"("userid","title","imageurl","imageid","createdat") VALUES ($1, $2, $3, $4,$5)',
                    [imageDetails.userid,imageDetails.title,imageDetails.image,imageDetails.imageid,date])
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

// POST  comment request
router.post('/', (request, response) => {
    try {
    const id = parseInt(request.body.id);
    const userid = request.body.userid;
    const gifid = request.body.gifid;
    const comment = request.body.comment;
    console.log(id);
    
//     const createdon = request.body.createdon;
//     const title = request.body.title;
//     const imageurl = request.body.imageurl;

    let values = [userid, gifid, comment, createdat];
    pool.connect((err, db, done) => {
   
        db.query('INSERT INTO gif (userid, gifid, comment, createdat) VALUES($1, $2, $3, $4)', [...values]) 
        .then((result) => {
            response.status(201).json({
                status: "success",
                data: result.rows,
                message: "Your Comment was posted successfully!"
            })
        }).catch((error) => {
            console.log(error)
            response.status(400).json({
                error: error,
            })
        })
    })
  }catch(execptions)
  {
      console.log(execptions);
      
  }
});

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
    try{
    const gifid = parseInt(request.params.gifid);
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
    }catch(execptions)
    {
        console.log(execptions);
        
    }
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
    try{
    const gifid = req.params.gifid;
    pool.connect((err, db, done) => {
     
        db.query('SELECT "u"."firstname", "u"."lastname", "g"."title", "g"."imageurl", "g"."createdat" FROM "gif" g INNER JOIN "users" u  on "g"."userid" = "u"."gifid" WHERE "g"."gifid" = $1',[gifid])
        .then((result) => {
            res.status(200).json({
                status: "success",
                data: result.rows 
            })
        }).catch((error) => {
            console.log(error)
            res.status(401).json({
                status: "error",
                message: "an error occurred"
                })
            })
        })
    } catch(execptions)
    {
        console.log(execptions);
        
    }
});

module.exports = router;
