var {check, validationResult} = require('express-validator/check');
var express = require('express');

var router = express.Router();

router.use('/votings', [
  function (req, res, next) {
    req.agendaItemId = req.params.agendaItemId;
    next();
  },
  require('./votings')
]);
router.use('/:agendaItemId', [
  check('agendaItemId')
    .exists()
    .withMessage('AgendaItemId is required')
    .isInt({ gt: 0 })
    .withMessage('Invalid AgendaItemId'),
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
    findAgendaItemById(req, res, req.params.agendaItemId).then((agendaItem) => {
      if (agendaItem.length === 0) {
        res.status(404).send('Točka dnevnog reda ne postoji!');
        return;
      } else {
        req.agendaItem = agendaItem[0];
        next();
      }
    }, (error) => {
      res.status(500).send(error);
      return;
    })
  }
]);
router.use('/:agendaItemId/cummulative-vote', [
  function(req, res, next) {
    req.agendaItemId = req.params.agendaItemId;
    next();
  },
  require('./cummulative-vote')
]);
router.use('/:agendaItemId/documents', [
  function(req, res, next) {
    req.agendaItemId = req.params.agendaItemId;
    next();
  },
  require('./documents')
]);
router.use('/:agendaItemId/votes', [
  function (req, res, next) {
    req.agendaItemId = req.params.agendaItemId;
    next();
  },
  require('./votes')
]);
router.use('/:agendaItemId/voting', [
  function (req, res, next) {
    req.agendaItemId = req.params.agendaItemId;
    next();
  },
  require('./voting')
]);

// Supports GET, POST
router.route('/')
  .get(retrieveAgendaItems)
  .post(
    inputValidators(createAgendaItem)
  );

// Supports GET, PUT
router.route('/:agendaItemId')
  .get(retrieveAgendaItem)
  .put(
    inputValidators(replaceAgendaItem)
  );

function createAgendaItem(req, res) {
  var queryString = `
    INSERT INTO AgendaItems
    (
      MeetingId,
      Number,
      Text
    )
    VALUES (?, ?, ?)
  `;
  var values = [
    req.meetingId,
    req.body.Number,
    req.body.Text
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.serverStatus !== 2) {
      res.status(500).send('Točka dnevnog reda nije dodana!');
      return;
    }

    findAgendaItemById(req, res, result.insertId)
      .then((agendaItem) => {
        agendaItem = agendaItem[0];
        var location = 
          'Location: /api/meetings/' +
          req.meetingId +
          '/agenda-items/' +
          agendaItem.AgendaItemId;
  
        res.set('Location', location);
        res.status(201).send(agendaItem);
        return;
      }, (error) => {
        res.status(500).send(error);
        return;
      });
  });
}

function retrieveAgendaItems(req, res) {
  var queryString = `
    SELECT *
    FROM AgendaItems
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

function retrieveAgendaItem(req, res) {
  return res.status(200).send(req.agendaItem);
}

function replaceAgendaItem(req, res) {
  var queryString = `
    UPDATE AgendaItems
    SET
      Number = ?,
      Text = ?
    WHERE AgendaItemId = ?
  `;
  var values = [
    req.body.Number,
    req.body.Text,
    req.params.agendaItemId
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.serverStatus !== 2) {
      res.status(500).send('Točka dnevnog reda nije spremljena!');
      return;
    }

    findAgendaItemById(req, res, req.params.agendaItemId)
      .then((agendaItem) => {
        agendaItem = agendaItem[0];

        res.status(200).send(agendaItem);
        return;
      }, (error) => {
        res.status(500).send(error);
        return;
      });
  });
}

function findAgendaItemById(req, res, agendaItemId) {
  return new Promise((resolve, reject) => {
    var queryString = `
      SELECT *
      FROM AgendaItems
      WHERE
        AgendaItemId = ? AND
        MeetingId = ?
    `;
    var values = [
      agendaItemId,
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
    check('Number')
      .exists()
      .withMessage('Number is required')
      .isInt({gt: 0})
      .withMessage('Invalid Number'),
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

module.exports = router;