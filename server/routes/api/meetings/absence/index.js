var {check, validationResult} = require('express-validator/check');
var router = require('express').Router();

// Supports GET, POST, PUT
router.route('/')
  .get(
    isAdmin,
    retrieveAbsence
  )
  .post(
    inputValidators(createAbsence)
  )
  .put(
    inputValidators(replaceAbsence)
  );

function retrieveAbsence(req, res) {
  var queryString = `
    SELECT *
    FROM AbsenceOfCouncilMembers
    WHERE MeetingId = ?
  `;

  req.connection.query(queryString, [req.meetingId], function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    res.status(200).send(result);
    return;
  });
}

function createAbsence(req, res) {
  var queryString = `
    INSERT INTO AbsenceOfCouncilMembers
    (
      CouncilMembershipId,
      MeetingId,
      Reason
    )
    VALUES (?, ?, ?)
  `;
  var councilMembershipId;

  if (req.decoded.CouncilMemberships.IsCouncilMember) {
    var councilMembershipId = req.decoded.CouncilMemberships.History[0].CouncilMembershipId;
  } else {
    res.status(400).send('Korisnik nije član vijeća!');
    return;
  }

  var values = [
    councilMembershipId,
    req.meetingId,
    req.body.Reason
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.serverStatus !== 2) {
      res.status(500).send('Odsutnost nije spremljena!');
      return;
    }

    findAbsence(req, res)
      .then((presence) => {
        presence = presence[0];
        var location = 
          'Location: /api/meetings/' +
          req.meetingId +
          '/absence';

        res.set('Location', location);
        res.status(201).send(presence)
        return;
      }, (error) => {
        res.status(500).send(error);
        return;
      });
  });
}

function replaceAbsence(req, res) {
  var queryString = `
    UPDATE AbsenceOfCouncilMembers
    SET
      Reason = ?
    WHERE
      MeetingId = ? AND
      CouncilMembershipId = ?
  `;
  var councilMembershipId;

  if (req.decoded.CouncilMemberships.IsCouncilMember) {
    var councilMembershipId = req.decoded.CouncilMemberships.History[0].CouncilMembershipId;
  } else {
    res.status(400).send('Korisnik nije član vijeća!');
    return;
  }

  var values = [
    req.body.Reason,
    req.meetingId,
    councilMembershipId
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.serverStatus !== 2) {
      res.status(500).send('Odsutnost nije spremljena!');
      return;
    }

    findAbsence(req, res)
      .then((presence) => {
        presence = presence[0];

        res.status(200).send(presence)
        return;
      }, (error) => {
        res.status(500).send(error);
        return;
      });
  });
}

function findAbsence(req, res) {
  return new Promise((resolve, reject) => {
    var queryString = `
      SELECT *
      FROM AbsenceOfCouncilMembers
      WHERE
        CouncilMembershipId = ? AND
        MeetingId = ?
    `;
    var councilMembershipId;
    
    if (req.decoded.CouncilMemberships.IsCouncilMember) {
      var councilMembershipId = req.decoded.CouncilMemberships.History[0].CouncilMembershipId;
    } else {
      res.status(400).send('Korisnik nije član vijeća!');
      return;
    }

    var values = [
      councilMembershipId,
      req.meetingId
    ];

    req.connection.query(queryString, values, function(error, result) {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
}

function isAdmin(req, res, next) {
  if (req.decoded.RoleName === 'admin') {
    next();
  } else {
    res.status(403).send('Nisi admin!');
    return;
  }
}

function inputValidators(func) {
  return [
    check('Reason')
      .exists()
      .withMessage('Reason is required')
      .isLength({ min: 0, max: 500 })
      .withMessage('Reason is too long'),
    function(req, res, next) {
      var errors = validationResult(req);

      if (errors.isEmpty()) {
        next();
      } else {
        res.status(422).send(errors.mapped());
        return;
      }
    },
    func
  ];
}

module.exports = router;