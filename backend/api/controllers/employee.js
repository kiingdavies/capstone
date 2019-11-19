const bcrypt = require('bcrypt');
const db = require('../db');
const pool = require("../models/queries");
const jwt = require('jsonwebtoken');


// CREATE USER
const signup = (request, response) => {
  const {firstname, lastname, email, password, gender, jobrole, department, address } = request.body; 

  // Check if valid email and password was entered
  function validateUser(user) {
    const validEmail = typeof user.email == 'string' && user.email.trim() != '';
    const validPassword = typeof user.password == 'string' && 
                          user.password.trim() != '' && 
                          user.password.trim().length >= 6;

    return validEmail && validPassword;
  }  

  if(validateUser(request.body)) {
    // Checking uniqueness of email (if email is present in DB)
    pool.query('SELECT email FROM users', (error, results) => {
      if (error) {
        throw error
      }
      // console.log(results.rows)
      results.rows.filter((value) => {
        if(email == value.email) {
          return response.status(400).json({
            message: "User email already exists"
          })
        }
        return email;
      })
    })

    // Hashing password and saving in DB
    bcrypt.hash(password, 8).then(
      (hash) => {
        pool.query('INSERT INTO users (firstname, lastname, email, password, gender, jobrole, department, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [firstname, lastname, email, hash, gender, jobrole, department, address], (error, results) => {
            if (error) {
              throw error
            }
            // console.log(results)
            // const [message] = results.rows;

            pool.query(`SELECT * FROM users WHERE email='${email}'`, (error, results) => {
              if(error) {
                throw Error
              }
              console.log(results.rows);

              const token = jwt.sign({ userId: results.rows[0].id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });

              return response.status(201).json({
                status: "success",
                data: {
                  message: "User Account successfully created",
                  token,
                  userId: results.rows[0].id                     
                }
              });
            })      
        })
      }
    ).catch((error) => {
      response.status(500).json({
        status: "error",
        error: error
      })
    })    
  } else {
    response.status(400).json({
      status: "error",
      error: "Email or Password cannot be blank or less than 6 characters"
    })
  }  
}

const signin = (request, response) => {
  const { email, password } = request.body;

  // Check if valid email and password was entered
  function validateUser(user) {
    const validEmail = typeof user.email == 'string' && user.email.trim() != '';
    const validPassword = typeof user.password == 'string' && 
                          user.password.trim() != '' && 
                          user.password.trim().length >= 6;

    return validEmail && validPassword;
  }  

  if (validateUser(request.body)) {
    // Checking uniqueness of email (if email is present in DB)
    pool.query('SELECT email FROM users', (error, results) => {
      if (error) {
        throw error
      }
      // console.log(results.rows.find(user => user.email == email))      
      const userEmail = results.rows.find(user => user.email == email)
        // console.log(userEmail)
      if (!userEmail) {
          return response.status(400).json({message: 'email not registered'})
      } 

        pool.query(`SELECT * FROM users WHERE email='${userEmail.email}'`, (error, results, next) => {  
          if(error) {
            return response.status(401).json({message: error})
          }     
          const [message] = results.rows;
   
          bcrypt.compare(request.body.password, message.password).then(
            (valid) => {
              if (!valid) {
                return response.status(401).json({
                  error: new Error('Incorrect password!')
                });
              }
              const token = jwt.sign({ userId: message.id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
              response.status(200).json({
                userId: message.id,
                token: token
              });
            }
          ).catch((error) => {
            response.status(500).json({
              error: next(new Error(error))
            });
          })

          // return response.status(201).json({
          //   message: results.rows                       
          // })

        })           
    })
    // bcrypt.compare(password, userPassword).then()
  } else {
    response.status(400).json({
      status: "error",
      error: "Email or Password cannot be blank or less than 6 characters"
    })
  }
}


module.exports = { signup, signin }


// const moment = require('moment');
// const uuidv4 = require('uuid/v4');
// const db = require('../db');
// const Helper = require('./Helper');

// const User = {
//     /**
//      * Create A User
//      * @param {object} req 
//      * @param {object} res
//      * @returns {object} user object 
//      */
//     async create(req, res) {
//         if (!req.body.email || !req.body.password) {
//             return res.status(400).send({ 'message': 'Some values are missing' });
//         }
//         if (!Helper.isValidEmail(req.body.email)) {
//             return res.status(400).send({ 'message': 'Please enter a valid email address' });
//         }
//         const hashPassword = Helper.hashPassword(req.body.password);

//         // id UUID PRIMARY KEY,
//         // firstname VARCHAR(50) NOT NULL,
//         // lastname VARCHAR(50) NOT NULL,
//         // email TEXT UNIQUE NOT NULL,
//         // password TEXT NOT NULL,
//         // gender VARCHAR(10) NOT NULL,
//         // jobrole VARCHAR(50) NOT NULL,
//         // department VARCHAR(50) NOT NULL,
//         // address TEXT NOT NULL,
//         // created_date TIMESTAMP


//         const createQuery = `INSERT INTO
//       users(id, firstname, lastname, email, password, gender, jobrole, department, address, created_date)
//       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
//         const values = [
//             // uuidv4(),
//             req.body.firstname,
//             req.body.lastname,
//             req.body.email,
//             hashPassword,
//             req.body.gender,
//             req.body.jobrole,
//             req.body.department,
//             req.body.address,
//             moment(new Date())
//         ];

//         try {
//             const { rows } = await db.query(createQuery, values);
//             const token = Helper.generateToken(rows[0].id);
//             return res.status(201).send({ token });
//         } catch (error) {
//             if (error.routine === '_bt_check_unique') {
//                 return res.status(400).send({ 'message': 'User with that EMAIL already exist' })
//             }
//             return res.status(400).send(error);
//         }
//     },
//     /**
//      * signing in
//      * @param {object} req 
//      * @param {object} res
//      * @returns {object} user object 
//      */
//     async signin(req, res) {
//         if (!req.body.email || !req.body.password) {
//             return res.status(400).send({ 'message': 'Some values are missing' });
//         }
//         if (!Helper.isValidEmail(req.body.email)) {
//             return res.status(400).send({ 'message': 'Please enter a valid email address' });
//         }
//         const text = 'SELECT * FROM users WHERE email = $1';
//         try {
//             const { rows } = await db.query(text, [req.body.email]);
//             if (!rows[0]) {
//                 return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
//             }
//             if (!Helper.comparePassword(rows[0].password, req.body.password)) {
//                 return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
//             }
//             const token = Helper.generateToken(rows[0].id);
//             return res.status(200).send({ token });
//         } catch (error) {
//             return res.status(400).send(error)
//         }
//     },
//     /**
//      * Delete A User
//      * @param {object} req 
//      * @param {object} res 
//      * @returns {void} return status code 204 
//      */
//     async delete(req, res) {
//         const deleteQuery = 'DELETE FROM users WHERE id=$1 returning *';
//         try {
//             const { rows } = await db.query(deleteQuery, [req.user.id]);
//             if (!rows[0]) {
//                 return res.status(404).send({ 'message': 'user not found' });
//             }
//             return res.status(204).send({ 'message': 'deleted' });
//         } catch (error) {
//             return res.status(400).send(error);
//         }
//     }
// }

// module.exports = User;