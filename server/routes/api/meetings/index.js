var {check, validationResult} = require('express-validator/check');
var router = require('express').Router();

router.use('/:meetingId', [
  check('meetingId')
    .exists()
    .withMessage('MeetingId is required')
    .isInt({gt: 0})
    .withMessage('Invalid MeetingId'),
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
    findMeetingById(req, res, req.params.meetingId)
      .then((meeting) => {
        if (meeting.length === 0) {
          res.status(404).send('Sjednica ne postoji!');
          return;
        } else {
          req.meeting = meeting[0];
          next();
        }
      }, (error) => {
        res.status(500).send(error);
        return;
      });
  }
]);
router.use('/:meetingId/agenda-items', [
  function(req, res, next) {
    req.meetingId = req.params.meetingId;
    next();
  },
  require('./agenda-items')
]);
router.use('/:meetingId/notifications', [
  function(req, res, next) {
    req.meetingId = req.params.meetingId;
    next();
  },
  require('./notifications')
]);
router.use('/:meetingId/presence', [
  function(req, res, next) {
    req.meetingId = req.params.meetingId;
    next();
  },
  require('./presence')
]);
router.use('/:meetingId/absence', [
  function(req, res, next) {
    req.meetingId = req.params.meetingId;
    next();
  },
  require('./absence')
]);

// Supports GET, POST
router.route('/')
  .get([
    retrieveMeetings
  ])
  .post([
    check('Address')
      .exists()
      .withMessage('Address is required')
      .isLength({ min: 0, max: 40 })
      .withMessage('Address is too long'),
    check('City')
      .exists()
      .withMessage('City is required')
      .isLength({ min: 0, max: 40 })
      .withMessage('City is too long'),
    check('DateTime')
      .exists()
      .withMessage('DateTime is required'),
    // check('Number')
    //   .exists()
    //   .withMessage('Number is required')
    //   .isInt({gt: 0})
    //   .withMessage('Invalid Number'),
    check('NumberInYear')
      .exists()
      .withMessage('NumberInYear is required')
      .isInt({gt: 0})
      .withMessage('Invalid Number'),
    check('TypeId')
      .exists()
      .withMessage('TypeId is required')
      .isIn([1,2,3])
      .withMessage('Invalid TypeId'),
    function(req, res, next) {
      var errors = validationResult(req);

      if (errors.isEmpty()) {
        if (isNaN(Date.parse(req.body.DateTime))) {
          res.status(422).send('Nevaljan datum!');
          return;
        } else {
          var now = new Date();
          var DateTime = new Date(req.body.DateTime);

          if (DateTime < now) {
            res.status(422).send('Ne možete praviti sjednicu u prošlosti!');
            return;
          } else {
            req.body.DateTime = DateTime;
            next();
          }
        }
      } else {
        res.status(422).send(errors.mapped());
        return;
      }
    },
    function(req, res, next) {
      findMeetingNumber(req, res)
        .then((number) => {
          number = number[0];

          if (!number) {
            req.Number = 1;
          } else {
            req.Number = number.Number;
          }

          next();
        }, (error) => {
          res.status(500).send(error);
        });
    },
    createMeeting
  ]);

// Supports GET, PUT
router.route('/:meetingId')
  .get([
    retrieveMeeting
  ])
  .put([
    check('Address')
      .exists()
      .withMessage('Address is required')
      .isLength({ min: 0, max: 40 })
      .withMessage('Address is too long'),
    check('City')
      .exists()
      .withMessage('City is required')
      .isLength({ min: 0, max: 40 })
      .withMessage('City is too long'),
    check('DateTime')
      .exists()
      .withMessage('DateTime is required'),
    // check('Number')
    //   .exists()
    //   .withMessage('Number is required')
    //   .isInt({gt: 0})
    //   .withMessage('Invalid Number'),
    check('NumberInYear')
      .exists()
      .withMessage('NumberInYear is required')
      .isInt({gt: 0})
      .withMessage('Invalid Number'),
    check('TypeId')
      .exists()
      .withMessage('TypeId is required')
      .isIn([1,2,3])
      .withMessage('Invalid TypeId'),
    function(req, res, next) {
      var errors = validationResult(req);

      if (errors.isEmpty()) {
        if (isNaN(Date.parse(req.body.DateTime))) {
          res.status(422).send('Nevaljan datum!');
          return;
        } else {
          req.body.DateTime = new Date(req.body.DateTime);
          next();
        }
      } else {
        res.status(422).send(errors.mapped());
        return;
      }
    },
    replaceMeeting
  ])

function retrieveMeetings(req, res) {
  var queryString = `
    SELECT *
    FROM Meetings
  `;

  req.connection.query(queryString, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    res.status(200).send(result);
  });
}

function retrieveMeeting(req, res) {
  res.status(200).send(req.meeting);
  return;
}

function createMeeting(req, res) {
  var queryString = `
    INSERT INTO Meetings
    (
      Address,
      City,
      DateTime,
      Number,
      NumberInYear,
      TypeId
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  var values = [
    req.body.Address,
    req.body.City,
    req.body.DateTime,
    req.Number,
    req.body.NumberInYear,
    req.body.TypeId
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.serverStatus !== 2) {
      res.status(500).send('Sjednica nije napravljena!');
      return;
    }

    queryString = `
      SELECT *
      FROM Meetings
      WHERE MeetingId = ?
    `;

    req.connection.query(queryString, [result.insertId], function(error, result) {
      if (error) {
        res.status(500).send(error);
        return;
      }

      var meeting = result[0];
      var location = 'Location: /api/meetings/' + meeting.MeetingId;

      res.set('Location', location);
      res.status(201).send(meeting);
      return;
    });
  });
}

function replaceMeeting(req, res) {
  var queryString = `
  UPDATE Meetings
  SET
    Address = ?,
    City = ?,
    DateTime = ?,
    NumberInYear = ?,
    TypeId = ?
  WHERE MeetingId = ?
`;

var values = [
  req.body.Address,
  req.body.City,
  req.body.DateTime,
  req.body.NumberInYear,
  req.body.TypeId,
  req.params.meetingId
];

req.connection.query(queryString, values, function(error, result) {
  if (error) {
    res.status(500).send(error);
    return;
  }

  if (result.serverStatus !== 2) {
    res.status(500).send('Sjednica nije spremljena!');
    return;
  }

  queryString = `
    SELECT *
    FROM Meetings
    WHERE MeetingId = ?
  `;

  req.connection.query(queryString, [req.params.meetingId], function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    var meeting = result[0];

    res.status(200).send(meeting);
    return;
  });
});
}

function findMeetingById(req, res, meetingId) {
  return new Promise((resolve, reject) => {
    var queryString = `
      SELECT *
      FROM Meetings
      WHERE MeetingId = ?
    `;
  
    req.connection.query(queryString, [meetingId], function(error, result) {
      if (error) {
        reject(error);
      }
  
      resolve(result);
    });
  });
}

function findMeetingNumber(req, res) {
  return new Promise((resolve, reject) => {
    var queryString = `
      SELECT max(Number) + 1 AS Number
      FROM Meetings
    `;

    req.connection.query(queryString, function(error, result) {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
}

module.exports = router;