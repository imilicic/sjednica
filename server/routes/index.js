var connection = require('express-myconnection');
var express = require('express');
var jsonWebToken = require('jsonwebtoken');
var mysql = require('mysql');

var config = require('../config');
var router = express.Router();

router.use(connection(mysql, config.connectionObject, 'single'));
router.use(function(req, res, next) {
  req.getConnection(function (error, connection) {
    if (error) {
      return res.status(500).send(error);
    } else {
      // ok if using single mysql connection
      req.connection = connection;
      next();
    }
  });
});
router.use('/api', isAuthenticated, require('./api'));
router.use('/authentication', require('./authentication'));

function isAuthenticated(request, response, next) {
  var token = getToken(request);

  if (!token) {
    return response.status(401).send('Niste prijavljeni!');
  }

  jsonWebToken.verify(token, config.secret, function (error, decoded) {
    if (error) {
      return response.status(401).send('Prijava nije valjana!');
    } else {
      request.decoded = decoded;
      next();
    }
  });
}

function isAdmin(req, res, next) {
  if (req.decoded.RoleName !== 'admin') {
    res.status(403).send('Nisi admin!');
    return;
  } else {
    next();
  }
}

/**
 * returns jwt token from HTTP request
 * @function
 * @param {HTTP Request Object} request - HTTP Request
 */
var getToken = function (request) {
  var parts;

  if (!request.headers.authorization) {
    return false;
  }

  parts = request.headers.authorization.split(' ');

  if (parts.length !== 2) {
    return false;
  }

  if (parts[0] === 'Bearer') {
    return parts[1];
  }

  return false;
}

module.exports = router;
