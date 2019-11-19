const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

// ADMIN ROUTES
const adminRoute = require('./api/routes/admin'); //all admin routes pass here its correct

//EMPLOYEE ROUTES
const employeeRoute = require('./api/routes/employee'); //all employee routes pass here its correct
// ROUTES 
const articleRoutes = require('./api/routes/article');
const authorRoutes = require('./api/routes/author');
const feedRoutes = require('./api/routes/feed');
const gifRoutes = require('./api/routes/gif');

//AUTH ROUTES
// const usersRoutes = require('./auth/users');
// const loginRoutes = require('./auth/login');

// CORS to make sure the front end can safely make calls to your app.
app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


// To log in the terminal
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.get('/', (request, response) => {
  	response.json({ info: 'Node.js, Express, and Postgres API' })
});


// ADMIN CREATE USER, SIGIN & DELETE API IS JUST ONE
app.use('/auth/v1', adminRoute);

// EMPLOYEE CREATE POST, SIGNIN & DELETE API IS JUST ONE
app.use('/api/v1', employeeRoute);
//APIs
app.use('/api/v1/article', articleRoutes);
app.use('/api/v1/author', authorRoutes);
app.use('/api/v1/feed', feedRoutes);
app.use('/api/v1/gif', gifRoutes);


//AUTH APIs
// app.use('/auth/v1/signup', usersRoutes);
// app.use('/auth/v1/login', loginRoutes);


// To handle all requests that werent handled above
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status(404);
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;