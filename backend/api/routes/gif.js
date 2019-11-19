// require POSTGRESQL connection and others

const express = require('express');
// import { validate, Authenticate } from '../../middlewares';
const GifController = require('../controllers/gif'); // Gif controllers

// const { verifyToken } = Authenticate;
const {
  createGif, deleteGif, commentGif, getGif
} = GifController;


const router = express.Router();


router.post('/create', GifController.createGif);


// router.post('/get', gifCreate.getGif);
// router.post('/create-user', adminCreateTable.createUsersTable);
// router.post('/delete', adminDelete.deleteUser);

module.exports = router;

