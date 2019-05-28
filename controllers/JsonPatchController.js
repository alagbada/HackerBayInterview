const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const jsonPatch = require('fast-json-patch');

const config = require('../config');
const logger = require('../logger');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/**
 * patch an json with a patch
 * This is an express router post method on '/jsonpatch' endpoint
 * it accepts req and res parameter and the request parameter must 
 * have a header property 'x-access-token' which is used for authorization
 * @param {any} res - response
 * @param {any} req - request - the body contains the object to be patched and the patch to use
 * @returns {json} the patched object
 */
router.post('/jsonpatch', (req, res) => {
    let token = req.headers['x-access-token'];
    let doc = req.body.jsonobj;
    let patch = req.body.patch;
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

    let specdoc = jsonPatch.applyPatch(doc, patch).newDocument;
    return res.status(200).send(specdoc);

});

/**
 * json patch router
 * @module JsonPatchController
 * @type {router}
 */
module.exports = router;