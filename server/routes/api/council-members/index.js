var router = require('express').Router();
var {check, validationResult} = require('express-validator/check');

router.use('/:councilMemberId', [
  function(req, res, next) {
    findCouncilMemberById(req, res, req.params.councilMemberId)
    .then((councilMember) => {
      if (councilMember.length === 0) {
        res.status(404).send('Ne postoji!');
        return;
      } else {
        req.councilMember = councilMember[0];
        next();
      }
    })
  }
])

// Supports GET, POST
router.route('/')
  .get(
    retrieveCouncilMembers
  )
  .post(
    inputValidators(createCouncilMember)
  );

// Supports GET, PUT, DELETE
router.route('/:councilMemberId')
  .get(
    retrieveCouncilMember
  )
  .put(
    inputValidators(replaceCouncilMember)
  )

function createCouncilMember(req, res) {
  var queryString = `
    INSERT INTO CouncilMemberships
    (
      EndDate,
      StartDate,
      UserId
    )
    VALUES (?, ?, ?)
  `;
  var values = [
    req.body.EndDate,
    req.body.StartDate,
    req.body.UserId
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    findCouncilMemberById(req, res, result.insertId)
    .then(councilMember => {
      councilMember = councilMember[0];

      res.set('Location', 'Location: /api/council-member/' + councilMember.CouncilMemberId);
      res.status(201).send(councilMember);
      return;
    }, error => {
      res.status(500).send(error);
      return;
    })
  })
}

function replaceCouncilMember(req, res) {
  var queryString = `
    UPDATE CouncilMemberships
    SET
      StartDate = ?,
      EndDate = ?
    WHERE CouncilMembershipId = ?
  `;
  var values = [
    req.body.StartDate,
    req.body.EndDate,
    req.params.councilMemberId
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    findCouncilMemberById(req, res, req.params.councilMemberId)
    .then(councilMember => {
      res.status(200).send(councilMember[0]);
      return;
    }, error => {
      res.status(500).send(error);
      return;
    })
  })
}

function retrieveCouncilMember(req, res) {
  res.status(200).send(req.councilMember);
  return;
}

function retrieveCouncilMembers(req, res) {
  var queryString = `
    SELECT
      Email,
      FirstName,
      LastName,
      PhoneNumber,
      RoleId,
      StartDate,
      EndDate,
      CouncilMembershipId AS CouncilMemberId
    FROM Users
    INNER JOIN CouncilMemberships
    USING (UserId)
    WHERE
      NOW() BETWEEN StartDate AND EndDate
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

function inputValidators(callback) {
  return [
    check('StartDate')
      .exists()
      .withMessage('StartDate is required'),
    check('EndDate')
      .exists()
      .withMessage('EndDate is required'),
    check('UserId')
      .exists()
      .withMessage('UserId is required')
      .isInt({ gt: 0 })
      .withMessage('Invalid UserId'),
    function(req, res, next) {
      var errors = validationResult(req);

      if (errors.isEmpty()) {
        next();
      } else {
        res.status(422).send(errors.mapped());
        return;
      }
    },
    callback
  ];
}

function findCouncilMemberById(req, res, councilMemberId) {
  return new Promise((resolve, reject) => {
    var queryString = `
      SELECT
        Email,
        FirstName,
        LastName,
        PhoneNumber,
        RoleId,
        StartDate,
        EndDate,
        CouncilMembershipId AS CouncilMemberId
      FROM Users
      INNER JOIN CouncilMemberships
      USING (UserId)
      WHERE
        CouncilMembershipId = ?
    `;

    req.connection.query(queryString, [councilMemberId], function(error, result) {
      if (error) {
        reject(error);
      }

      resolve(result);
    })
  });
}

module.exports = router;