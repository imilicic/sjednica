var express = require('express');
var {check, validationResult} = require('express-validator/check');

var router = express.Router();

router.use('/:councilMembershipId', [
  check('councilMembershipId')
    .exists()
    .withMessage('CouncilMembershipId required')
    .isInt({ gt: 0, allow_leading_zeros: false })
    .withMessage('Invalid CouncilMembershipId'),
  function(req, res, next) {
    var errors = validationResult(req);

    if (errors.isEmpty()) {
      next();
    } else {
      res.status(422).send(errors.mapped());
      return
    }
  },
  function(req, res, next) {
    findCouncilMembershipById(req, res, req.params.councilMembershipId)
      .then((councilMembership) => {
        if (councilMembership.length === 0) {
          res.status(404).send('Članstvo u vijeću ne postoji!');
          return
        } else {
          req.councilMembership = councilMembership[0];
          next();
        }
      }, (error) => {
        res.status(500).send(error);
        return
      });
  }
]);

// Supports GET, POST
router.route('/')
  .get([
    retrieveCouncilMemberships
  ])
  .post([
    check('StartDate')
      .exists()
      .withMessage('StartDate is required'),
    check('EndDate')
      .exists()
      .withMessage('EndDate is required'),
    function(req, res, next) {
      var errors = validationResult(req);

      if (errors.isEmpty()) {
        var isDateValid = isNaN(Date.parse(req.body.EndDate)) || 
          isNaN(Date.parse(req.body.StartDate));

        if (isDateValid) {
          res.status(400).send('Nevaljan datum!');
          return
        } else {
          next();
        }
      } else {
        res.status(422).send(errors.mapped());
        return
      }
    },
    createCouncilMembership
  ]);

// Supports GET, PUT, DELETE
router.route('/:councilMembershipId')
  .get([
    retrieveCouncilMembership
  ])
  .put([
    check('StartDate')
      .exists()
      .withMessage('StartDate is required'),
    check('EndDate')
      .exists()
      .withMessage('EndDate is required'),
    function(req, res, next) {
      var errors = validationResult(req);

      if (errors.isEmpty()) {
        var isDateValid = isNaN(Date.parse(req.body.EndDate)) || 
          isNaN(Date.parse(req.body.StartDate));

        if (isDateValid) {
          res.status(400).send('Nevaljan datum!');
          return;
        } else {
          next();
        }
      } else {
        res.status(422).send(errors.mapped());
        return;
      }
    },
    function(req, res, next) {
      if (new Date(req.councilMembership.EndDate) < new Date()) {
        res.status(403).send('Ne može se brisati!');
        return;
      } else {
        next();
      }
    },
    replaceCouncilMembership
  ])
  .delete([
    function(req, res, next) {
      if (new Date(req.councilMembership.EndDate) < new Date()) {
        res.status(403).send('Ne može se brisati!');
        return;
      } else {
        next();
      }
    },
    deleteCouncilMembership
  ]);

function createCouncilMembership(req, res) {
  var queryString = `
    INSERT INTO CouncilMemberships
    (
      UserId,
      StartDate,
      EndDate
    )
    VALUES (?, ?, ?)
  `;
  var values = [
    req.userId,
    req.body.StartDate,
    req.body.EndDate
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.serverStatus !== 2) {
      res.status(500).send('Korisnik nije dodan u vijeće!');
      return;
    }

    queryString = `
      SELECT * FROM CouncilMemberships
      WHERE CouncilMembershipId = ?
    `;
    values = [result.insertId];

    req.connection.query(queryString, values, function(error, result) {
      if (error) {
        res.status(500).send(error);
        return;
      }

      var location = 
        'Location: /api/users/' + 
        userId + 
        '/councilMemberships/' + 
        result[0].CouncilMembershipId;

      res.set('Location', location);
      res.status(201).send(result);
      return;
    });
  });
}

function retrieveCouncilMembership(req, res) {
  res.status(200).send(req.councilMembership);
  return;
}

function retrieveCouncilMemberships(req, res) {
  var userId = req.userId;
  var queryString = `
    SELECT CouncilMembershipId, StartDate, EndDate
    FROM CouncilMemberships
    WHERE UserId = ?
    ORDER BY StartDate DESC
  `;

  req.connection.query(queryString, [userId], function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.length === 0) {
      res.status(200).send({
        IsCouncilMember: false,
        History: []
      });
      return;
    }

    var endDate = new Date(result[0].EndDate);
    var isCouncilMember = false;
    var now = new Date();
    var startDate = new Date(result[0].StartDate);

    if (startDate <= now && now <= endDate) {
      isCouncilMember = true;
    }

    var newCouncilMemberships = {
      IsCouncilMember: isCouncilMember,
      History: result
    };

    res.status(200).send(newCouncilMemberships);
    return;
  });
}

function replaceCouncilMembership(req, res) {
  var councilMembership = req.councilMembership;

  var queryString = `
    UPDATE CouncilMemberships
    SET StartDate = ?, EndDate = ?
    WHERE CouncilMembershipId = ?
  `;
  var values = [
    req.body.StartDate,
    req.body.EndDate,
    councilMembership.CouncilMembershipId
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.serverStatus !== 2) {
      res.status(500).send('Članstvo u vijeću nije promijenjeno!');
      return;
    } else {
      res.status(200).send('Članstvo u vijeću je promijenjeno!');
      return;
    }
  });
}

function deleteCouncilMembership(req, res) {
  var councilMembership = req.councilMembership;
  var queryString = `
    DELETE FROM CouncilMemberships
    WHERE CouncilMembershipId = ?
  `;
  var values = [councilMembership.CouncilMembershipId];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.serverStatus !== 2) {
      res.status(500).send('Članstvo u vijeću nije obrisano!');
      return;
    } else {
      res.status(200).send('Članstvo u vijeću obrisano!');
      return;
    }
  });
}

function findCouncilMembershipById(req, res, councilMembershipId) {
  return new Promise((resolve, reject) => {
    var userId = req.userId;
    var queryString = `
      SELECT CouncilMembershipId, StartDate, EndDate
      FROM CouncilMemberships
      WHERE CouncilMembershipId = ? AND UserId = ?
    `;
    var values = [councilMembershipId, userId];
  
    req.connection.query(queryString, values, function(error, result) {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
}

module.exports = router;
