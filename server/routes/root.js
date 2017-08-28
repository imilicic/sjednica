var config = require('../config');
var connection = require('express-myconnection');
var express = require('express');
var jsonWebToken = require('jsonwebtoken');
var mysql = require('mysql');

var apiRouter = require('./api/api');
var loginRouter = require('./authentication/login');

var rootRouter = express.Router();

rootRouter.use(connection(mysql, config.connectionObject, 'single'));
rootRouter.use(function(req, res, next) {
    req.getConnection(function(error, connection) {
        if (error) {
            return res.status(500).send(error);
        } else {
            req.connection = connection; //ok if using single mysql connection
            next();
        }
    });
});
rootRouter.use('/api', isAuthenticated, apiRouter);
rootRouter.use('/authentication', loginRouter);

module.exports = rootRouter;

function isAuthenticated(request, response, next) {
    var token = getToken(request);

    if (token) {
        jsonWebToken.verify(token, config.secret, function(error, decoded) {
            if (error) {
                return response.status(401).send('Prijava nije valjana!');
            } else {
                request.decoded = decoded;
                next();
            }
        });
    } else {
        return response.status(401).send('Niste prijavljeni!');
    }
}

/**
 * returns jwt token from HTTP request
 * @function
 * @param {HTTP Request Object} request - HTTP Request
 */
var getToken = function(request) {
    if (request.headers.authorization) {
        var parts = request.headers.authorization.split(' ');

        if (parts.length == 2) {
            if (parts[0] == 'Bearer') {
                return parts[1];
            }
        }
    }

    return false;
}
