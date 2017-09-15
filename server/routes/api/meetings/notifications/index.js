var {check, validationResult} = require('express-validator/check');
var express = require('express');

var router = express.Router();

router.use('/:notificationId', function(req, res, next) {
  findNotificationById(req, res, req.params.notificationId)
    .then((notification) => {
      if (notification.length === 0) {
        res.status(404).send('Obavijest ne postoji!');
        return;
      } else {
        req.notification = notification[0];
        next();
      }
    }, (error) => {
      res.status(500).send(error);
      return;
    });
});

// Supports GET, POST
router.route('/')
  .get(
    retrieveNotifications
  )
  .post(
    inputValidators(createNotification)
  );

// Suports GET, PUT
router.route('/:notificationId')
  .get(
    retrieveNotification
  )
  .put(
    inputValidators(replaceNotification)
  );

function retrieveNotifications(req, res) {
  var queryString = `
    SELECT
      MeetingNotificationId AS NotificationId,
      Text
    FROM MeetingNotifications
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

function retrieveNotification(req, res) {
  res.status(200).send(req.notification);
  return;
}

function createNotification(req, res) {
  var queryString = `
    INSERT INTO MeetingNotifications
    (
      MeetingId,
      Text
    )
    VALUES (?, ?)
  `;
  var values = [
    req.meetingId,
    req.body.Text
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.serverStatus !== 2) {
      res.status(500).send('Obavijest nije dodana!');
      return;
    }

    findNotificationById(req, res, result.insertId)
      .then((notification) => {
        notification = notification[0];
        var location =
          'Location: /api/meetings/' +
          req.meetingId +
          '/notifications/' +
          notification.MeetingNotificationId;
  
        res.set('Location', location);
        res.status(201).send(notification);
        return;
      }, (error) => {
        res.status(500).send(error);
        return;
      });
  });
}

function replaceNotification(req, res) {
  var queryString = `
    UPDATE MeetingNotifications
    SET
      Text = ?
    WHERE MeetingNotificationId = ?
  `;
  var values = [
    req.body.Text,
    req.params.notificationId
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.serverStatus !== 2) {
      res.status(500).send('Obavijest nije spremljena!');
      return;
    }

    findNotificationById(req, res, req.params.notificationId)
      .then((notification) => {
        notification = notification[0];
        
        res.status(200).send(notification);
        return;
      }, (error) => {
        res.status(500).send(error);
        return;
      });
  });
}

function findNotificationById(req, res, notificationId) {
  return new Promise((resolve, reject) => {
    var queryString = `
      SELECT
        MeetingNotificationId AS NotificationId,
        Text
      FROM MeetingNotifications
      WHERE
        MeetingNotificationId = ? AND
        MeetingId = ?
    `;
    var values = [
      notificationId,
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

function inputValidators(func) {
  return [
    isAdmin,
    check('Text')
      .exists()
      .withMessage('Text is required')
      .isLength({ min: 0, max: 500 })
      .withMessage('Text is too long'),
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

function isAdmin(req, res, next) {
  if (req.decoded.RoleId === 1) {
    next();
  } else {
    res.status(403).send('Nisi admin!');
    return;
  }
}

module.exports = router;