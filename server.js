/**
 * This server module contains the basic express setup, modules import
 * and middleware usage. This is the entry point to the app 
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('./logger');
const process = require('process');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const AuthController = require('./controllers/AuthController');
const JsonPatchController = require('./controllers/JsonPatchController');
const ImageController = require('./controllers/ImageController');

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('It is working');
});

/**
 * This is the controller middleware for the express router  
 */
app.use('/api/v2', AuthController);
app.use('/api/v2', JsonPatchController);
app.use('/api/v2', ImageController.router);

app.listen(port, () => {
    logger.log('info', `server running on port ${port}`);
});



module.exports = app;