var express = require('express');
var {check, validationResult} = require('express-validator/check');

var passwordHash = require('../../../passwordHash');
var router = express.Router();

router.use('/:userId', [
  check('userId')
    .exists()
    .withMessage('UserId required')
    .isInt({ gt: 0, allow_leading_zeros: false })
    .withMessage('Invalid userId'),
  function(req, res, next) {
    var errors = validationResult(req);

    if (errors.isEmpty()) {
      next();
    } else {
      res.status(422).send(errors.mapped());
      return;
    }
  },
  function(req, res, next) {
    findUserById(req, res, req.params.userId).then((user) => {
      if (user.length === 0) {
        res.status(404).send('Korisnik ne postoji!');
        return;
      } else {
        req.user = user[0];
        next();
      }
    }, (error) => {
      res.status(500).send(error);
      return;
    });
  }
]);

router.use('/:userId/councilMemberships', [
  isAdmin,
  function(req, res, next) {
    req.userId = req.params.userId;
    next();
  },
  require('./councilMembership')
]);

// Supports GET, POST
router.route('/')
  .get([
    isAdmin,
    retrieveUsers
  ])
  .post([
    isAdmin,
    check('Email')
      .exists()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email')
      .isLength({ min: 0, max: 40})
      .withMessage('Email is too long'),
    check('FirstName')
      .exists()
      .withMessage('FirstName is required')
      .isLength({ min: 0, max: 40})
      .withMessage('FirstName is too long'),
    check('LastName')
      .exists()
      .withMessage('LastName is required')
      .isLength({ min: 0, max: 40})
      .withMessage('LastName is too long'),
    check('Password')
      .exists()
      .withMessage('Password is required')
      .isLength({ min: 8, max: 40 })
      .withMessage('Password must have at least 8 characters')
      .matches('^(?=[a-zA-Z0-9]{8,})(?=[^a-zA-Z]*[a-zA-Z])(?=[^0-9]*[0-9]).*')
      .withMessage('Password must have at least 1 letter and 1 number'),
    check('PhoneNumber')
      .exists()
      .withMessage('PhoneNumber is required')
      .matches("^[0-9]{3} [0-9]{6,10}$|^null$")
      .withMessage('Invalid phone number'),
    check('RoleId')
      .exists()
      .withMessage('RoleId is required')
      .isIn([1, 2])
      .withMessage('Invalid RoleId'),
    function (req, res, next) {
      var errors = validationResult(req);

      if (errors.isEmpty()) {
        next();
      } else {
        res.status(422).send(errors.mapped());
        return;
      }
    },
    function(req, res, next) {
      findUserByEmail(req, res, req.body.Email).then((user) => {
        if (user.length === 0) {
          next();
        } else {
          res.status(409).send('Korisnik već postoji!');
          return;
        }
      }, (error) => {
        res.status(500).send(error);
        return;
      });
    },
    createUser
  ]);

// Supports GET, PUT
router.route('/:userId')
  .get([
    isAdmin,
    retrieveUser
  ])
  .put([
    check('Email')
      .exists()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email')
      .isLength({ min: 0, max: 40})
      .withMessage('Email is too long'),
    check('FirstName')
      .exists()
      .withMessage('FirstName is required')
      .isLength({ min: 0, max: 40})
      .withMessage('FirstName is too long'),
    check('LastName')
      .exists()
      .withMessage('LastName is required')
      .isLength({ min: 0, max: 40})
      .withMessage('LastName is too long'),
    check('OldPassword')
      .exists()
      .withMessage('OldPassword is required'),
    check('Password')
      .exists()
      .withMessage('Password is required')
      .isLength({ min: 8, max: 40 })
      .withMessage('Password must have at least 8 characters')
      .matches(
        '^(?=[a-zA-Z0-9]{8,})(?=[^a-zA-Z]*[a-zA-Z])(?=[^0-9]*[0-9]).*|^00000000$'
      )
      .withMessage('Password must have at least 1 letter and 1 number'),
    check('PhoneNumber')
      .exists()
      .withMessage('PhoneNumber is required')
      .matches("^[0-9]{3} [0-9]{6,10}$|^null$")
      .withMessage('Invalid phone number'),
    check('RoleId')
      .exists()
      .withMessage('RoleId is required')
      .isIn([1, 2])
      .withMessage('Invalid RoleId'),
    function(req, res, next) {
      var errors = validationResult(req);

      if (errors.isEmpty()) {
        next();
      } else {
        res.status(422).send(errors.mapped());
        return;
      }
    },
    function(req, res, next) {
      var editingUser = req.user;
      
      if (editingUser.Email !== req.body.Email) {
        findUserByEmail(req, res, req.body.Email).then((foundUser) => {
          if (foundUser.length === 0) {
            next();
          } else {
            res.status(409).send('Korisnik s tim emailom već postoji!');
            return;
          }
        }, (error) => {
          res.status(500).send(error);
          return;
        });
      } else {
        next();
      }
    },
    replaceUser
  ]);

function retrieveUser(req, res) {
  var user = req.user;

  delete user.Password;
  delete user.Salt;

  res.status(200).send(user);
  return;
}

function retrieveUsers(req, res) {
  var queryString = `
    SELECT *
    FROM Users
  `;

  req.connection.query(queryString, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    res.status(200).send(result);
    return;
  });
}

function createUser(req, res) {
  var password = req.body.Password;

  var passwordData = passwordHash.hashPassword(password);
  var queryString = `
    INSERT INTO Users
    (
      Email,
      FirstName,
      LastName,
      Password,
      PhoneNumber,
      RoleId,
      Salt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  var values = [
    req.body.Email,
    req.body.FirstName,
    req.body.LastName,
    passwordData.passwordHash,
    req.body.PhoneNumber,
    req.body.RoleId,
    passwordData.salt
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.serverStatus !== 2) {
      res.status(500).send('Korisnik nije izrađen.');
      return;
    }

    queryString = `
      SELECT *
      FROM Users
      WHERE Email = ?
    `;

    req.connection.query(queryString, [email], function(error, result) {
      if (error) {
        res.status(500).send(error);
        return;
      }

      var user = result[0];

      res.set('Location', 'Location: /api/users/' + user.UserId);
      res.status(201).send(user);
      return;
    });
  });
}

function replaceUser(req, res) {
  var email = req.body.Email;
  var firstName = req.body.FirstName;
  var lastName = req.body.LastName;
  var oldPassword = req.body.OldPassword;
  var password = req.body.Password;
  var phoneNumber = req.body.PhoneNumber;
  var roleId = req.body.RoleId;
  var user = req.user;
  var userId = req.params.userId;
  
  var passwordData = {
    passwordHash: user.Password,
    salt: user.Salt
  };

  if (password !== "00000000") {
    if (req.decoded.RoleName === 'admin') {
      passwordData = passwordHash.hashPassword(password);
    } else {
      var oldPasswordData = passwordHash.hashPassword(oldPassword, user.Salt);
  
      if (oldPasswordData.passwordHash === user.Password) {
        passwordData = passwordHash.hashPassword(password);
      } else {
        res.status(400).send('Stara lozinka je kriva!');
        return;
      }
    }
  }

  var queryString;
  var values;

  if (req.decoded.RoleName === 'admin') {
    queryString = `
      UPDATE Users
      SET 
        Email = ?,
        FirstName = ?,
        LastName = ?,
        Password = ?,
        PhoneNumber = ?,
        RoleId = ?,
        Salt = ?
      WHERE UserId = ?
    `;
    values = [
      req.body.Email,
      req.body.FirstName,
      req.body.LastName,
      passwordData.passwordHash,
      req.body.PhoneNumber,
      req.body.RoleId,
      passwordData.salt,
      userId
    ];
  } else if (req.decoded.UserId === user.UserId) {
    queryString = `
      UPDATE Users
      SET
        Password = ?,
        Salt = ?
      WHERE UserId = ?
    `;
    values = [
      passwordData.passwordHash,
      passwordData.salt, userId
    ];
  } else {
    res.status(403).send('Nisi admin!');
    return;
  }

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.serverStatus !== 2) {
      res.status(500).send('Podaci nisu promijenjeni!');
      return;
    } else {
      res.status(200).send('Podaci su promijenjeni!');
      return;
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

function findUserById(req, res, userId) {
  return new Promise((resolve, reject) => {
    var queryString = 'SELECT * FROM Users WHERE UserId = ?';
    
    req.connection.query(queryString, [userId], function(error, result) {
      if (error) {
        reject(error);
      }
      
      resolve(result);
    });
  });
}

function findUserByEmail(req, res, email) {
  return new Promise((resolve, reject) => {
    var queryString = 'SELECT * FROM Users WHERE Email = ?';
    
    req.connection.query(queryString, [email], function(error, result) {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
}

module.exports = router;