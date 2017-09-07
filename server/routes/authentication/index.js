var {check, validationResult} = require('express-validator/check');
var express = require('express');
var jsonWebToken = require('jsonwebtoken');

var config = require('../../config');
var router = express.Router();
var passwordHash = require('../../passwordHash');

// Supports POST
router.route('/')
  .post([
    check('Email')
      .exists()
      .withMessage('Email is required'),
    check('Password')
      .exists()
      .withMessage('Password is required'),
    function(req, res, next) {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        next();
      } else {
        res.status(400).send(errors.mapped());
        return;
      }
    },
    createAuthentication
  ]);

function createAuthentication(req, res) {
  var email = req.body.Email;
  var password = req.body.Password;
  var queryString = `
    SELECT *
    FROM Users
    WHERE Email = ?
  `;

  req.connection.query(queryString, [email], function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.length === 0) {
      res.status(404).send('Korisnik ne postoji!');
      return;
    }

    var user = result[0];
    var passwordData = passwordHash.hashPassword(password, user.Salt);

    if (user.Password !== passwordData.passwordHash) {
      res.status(422).send('Kriva lozinka!');
      return;
    }

    delete user.Password;
    delete user.Salt;

    queryString = `
      SELECT CouncilMembershipId, StartDate, EndDate
      FROM CouncilMemberships
      WHERE UserId = ?
      ORDER BY StartDate DESC
    `;

    req.connection.query(queryString, [user.UserId], function(error, result) {
      if (error) {
        res.status(500).send(error);
        return;
      }

      user.CouncilMemberships = result;

      auth_token = jsonWebToken.sign(user, config.secret, {
        expiresIn: '1d'
      });

      res.status(201).send({
        auth_token: auth_token
      });
      return;
    });
  });
}

module.exports = router;