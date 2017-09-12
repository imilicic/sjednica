var router = require('express').Router();

// Supports GET, POST
router.route('/')
  .get(
    isAdmin,
    retrievePresence
  )
  .post(
    function(req, res, next) {
      findPresence(req, res, req.decoded.UserId).then((presence) => {
        if (presence.length === 0) {
          req.userId = req.decoded.UserId;
          next();
        } else {
          res.status(200).send('Prisutnost je spremljena!');
          return;
        }
      })
    },
    createPresence
  );

// Supports GET
router.route('/count')
  .get(
    retrievePresenceCount
  )

// Supports POST, DELETE
router.route('/userId/:userId')
  .post(
    isAdmin,
    function(req, res, next) {
      findPresence(req, res, req.params.userId).then((presence) => {
        if (presence.length === 0) {
          req.userId = req.params.userId;
          next();
        } else {
          res.status(200).send('Prisutnost je spremljena!');
          return;
        }
      })
    },
    createPresence
  )
  .delete(
    isAdmin,
    function(req, res, next) {
      findPresence(req, res, req.params.userId).then((presence) => {
        if (presence.length === 0) {
          res.status(404).send('Prisutnost ne postoji!');
          return;
        } else {
          next();
        }
      });
    },
    deletePresence
  );

function deletePresence(req, res) {
  var queryString = `
    DELETE FROM PresenceOfUsers
    WHERE UserId = ? AND
    MeetingId = ?
  `;
  var values = [
    req.params.userId,
    req.meetingId
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    res.status(200).send('Prisutnost obrisana!');
    return;
  });
}

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

function retrievePresenceCount(req, res) {
  var queryString = `
    SELECT count(*) AS Number
    FROM PresenceOfUsers
    WHERE MeetingId = ?
  `;

  req.connection.query(queryString, [req.meetingId], function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    res.status(200).send(result[0]);
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
    req.userId,
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

    findPresence(req, res, req.userId)
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

function findPresence(req, res, userId) {
  return new Promise((resolve, reject) => {
    var queryString = `
      SELECT *
      FROM PresenceOfUsers
      WHERE
        UserId = ? AND
        MeetingId = ?
    `;
    var values = [
      userId,
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
  if (req.decoded.RoleId === 1) {
    next();
  } else {
    res.status(403).send('Nisi admin!');
    return;
  }
}

module.exports = router;