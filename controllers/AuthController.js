/**
 * This is the auth controller module that takes care of the login authentication
 * It uses JWT authentication, so tokens are generated at every successful login
 * while error status 404 is thrown when the login parameters are not valid
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const logger = require('../logger');
const config = require('../config');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/**
 * This express router is chained with a post method, that accepts two parameters
 * @param {any} res - response parameter,
 * @param {any} req - request parameter - the body property contains the username and password,
 * @return {any} The response object that contains the authentication status and the token values
 */

router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
        let token = jwt.sign({username: username}, config.secret, {expiresIn: 86400});
        logger.log('info', `${username} has logged in successfully`);
        return res.status(200).send({auth: true, token: token});
    } 
    logged.log('error', 'invalid login attempt');
    return res.status(404).send({auth: false, token: null});

});

module.exports = router;