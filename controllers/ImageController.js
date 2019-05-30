const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const sharpImage = require('sharp'); 
const fs = require('fs');
const request = require('request');

const config = require('../config');
const logger = require('../logger');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/**
 * This function download image content from the uri and save it as a filename
 * it also accepts a callback function that triggers when the event is closed
 * @param {*} uri 
 * @param {*} filename 
 * @param {*} callback 
 */
const download = (uri, filename, callback) => {
    logger.log('info', `attempt to download images from ${uri}`);
    request(uri).pipe(fs.createWriteStream(filename).on('close', callback));
}


/**
 * This function resize the downloaded images to the specified width and height
 * which is 50 * 50 for the sake of this exercise
 * this function uses sharp package to carryout the functionality of resizing images
 * @param {*} path - the filepath that the image is saved in
 * @param {*} width 
 * @param {*} height 
 */
const resizeImage = (path, width, height) => {
    sharpImage(path).resize(width, height).toBuffer().then(data => {
        fs.writeFileSync(path, data);
        logger.log('info', 'image resized successfully to specification');
    }).catch(err => {
        logger.log('error',  'error has occured while resizing image');
        throw err;
    });
}


/**
 * This function accepts res and req. The req must have 'x-access-token' header
 * before authorization into the endpoint '/imageresize' can occur
 * in this function the download function is called with resizeImage function as callback 
 * @param {*} req 
 * @param {*} res 
 */
const imageController = (req, res) => {
    let token = req.headers['x-access-token'];
    let uri = req.body.uri;
    let imageName = req.body.imageName;
    let width = parseInt(req.body.width);
    let height = parseInt(req.body.height);
    let format = req.body.format;
    let filePath = './images/' + imageName;
    if (!token) {
        logger.log('info', 'No token was provided');
        return res.status(401).send({auth: false, message: 'No token provided'});
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            logger.log('error', 'failed to authenticate token for json patch endpoint');
            return res.status(500).send({auth: false, message: 'Failed to authenticate token'});
        }
        logger.log('info', `${decoded} is authorized`);
    });

    res.type(`image/${format}`);
    download(uri, filePath, () => resizeImage(filePath, width, height));
    logger.log('info', 'image resize complete');
    return res.send('image resize complete...');
}

router.post('/imageresize', imageController);


module.exports = {
    router,
    download,
    resizeImage,
    imageController
};