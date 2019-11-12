const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Helper = {
    /** 
     * comparePassword
     * @param {string} hashPassword
     * @param {string} password
     * @returns {Boolean} return True or False
    */
    comparePassword(hashPassword, password) {
        return bcrypt.compare(password, hashPassword);
    },
    /**
     * isValidEmail helper method
     * @param {string} email
     * @returns {Boolean} True or False
     */
    isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    },
    /**
     * isValidPassword 
     * @param {string} password
     * @returns {Boolean} return True or False
     * 
     */
    hashPassword(password) {
        if(password.length < 10){
            return error;
        }else {
            return bcrypt.hash(password, 10);
        }
        
    }
};

module.exports = Helper;