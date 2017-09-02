var router = require('express').Router();

// Supports GET, POST
router.route('/')
  .get(
    isAdmin,
    retrievePresence
  )
  .post(
    createPresence
  );

function retrievePresence(req, res) {
  var queryString = `
    SELECT *
    FROM PresenceOfUsers
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

function createPresence(req, res) {
  var queryString = `
    INSERT INTO PresenceOfUsers
    (
      UserId,
      MeetingId
    )
    VALUES (?, ?)
  `;
  var values = [
    req.decoded.UserId,
    req.meetingId
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.serverStatus !== 2) {
      res.status(500).send('Prisutnost nije spremljena!');
      return;
    }

    findPresence(req, res)
      .then((presence) => {
        presence = presence[0];
        var location = 
          'Location: /api/meetings/' +
          req.meetingId +
          '/presence';

        res.set('Location', location);
        res.status(201).send(presence)
        return;
      }, (error) => {
        res.status(500).send(error);
        return;
      });
  });
}

function findPresence(req, res) {
  return new Promise((resolve, reject) => {
    var queryString = `
      SELECT *
      FROM PresenceOfUsers
      WHERE
        UserId = ? AND
        MeetingId = ?
    `;
    var values = [
      req.decoded.UserId,
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

module.exports = router;