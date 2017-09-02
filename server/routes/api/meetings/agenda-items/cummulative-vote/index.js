var {check, validationResult} = require('express-validator/check');
var express = require('express');

var router = express.Router();

router.use('/', function(req, res, next) {
  var queryString = `
    SELECT TypeId
    FROM Meetings
    WHERE MeetingId = ?
  `;

  req.connection.query(queryString, [req.meetingId], function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    req.meetingTypeId = result[0].TypeId;
    next();
  });
});

// Supports GET, POST, PUT
router.route('/')
  .get([
    function(req, res) {
      // if meeting is non electronic
      if (req.meetingTypeId === 3) {
        retrieveCummulativeVote(req, res);
      } else {
        retrieveCalculatedCummulativeVote(req, res);
      }
    }
  ])
  .post([
    isAdmin,
    function(req, res, next) {
      if (req.meetingTypeId === 3) {
        next();
      } else {
        res.set('Allow','GET');
        res.status(405).send('Nedopuštena metoda!');
        return;
      }
    },
    check('VotesFor')
      .exists()
      .withMessage('VotesFor is required')
      .isInt({min: 0})
      .withMessage('Invalid VotesFor'),
    check('VotesAgainst')
      .exists()
      .withMessage('VotesAgainst is required')
      .isInt({min: 0})
      .withMessage('Invalid VotesAgainst'),
    check('VotesAbstain')
      .exists()
      .withMessage('VotesAbstain is required')
      .isInt({min: 0})
      .withMessage('Invalid VotesAbstain'),
    function(req, res, next) {
      var errors = validationResult(req);

      if (errors.isEmpty()) {
        next();
      } else {
        res.status(422).send(errors.mapped());
        return;
      }
    },
    createCummulativeVote
  ])
  .put([
    isAdmin,
    function(req, res, next) {
      if (req.meetingTypeId === 3) {
        next();
      } else {
        res.set('Allow','GET');
        res.status(405).send('Nedopuštena metoda!');
        return;
      }
    },
    check('VotesFor')
      .exists()
      .withMessage('VotesFor is required')
      .isInt({min: 0})
      .withMessage('Invalid VotesFor'),
    check('VotesAgainst')
      .exists()
      .withMessage('VotesAgainst is required')
      .isInt({min: 0})
      .withMessage('Invalid VotesAgainst'),
    check('VotesAbstain')
      .exists()
      .withMessage('VotesAbstain is required')
      .isInt({min: 0})
      .withMessage('Invalid VotesAbstain'),
    function(req, res, next) {
      var errors = validationResult(req);

      if (errors.isEmpty()) {
        next();
      } else {
        res.status(422).send(errors.mapped());
        return;
      }
    },
    replaceCummulativeVote
  ]);

function retrieveCummulativeVote(req, res) {
  var queryString = `
    SELECT *
    FROM CummulativeVotes
    WHERE AgendaItemId = ?
  `;

  req.connection.query(queryString, [req.agendaItemId], function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    var cummulativeVote = result[0];

    res.status(200).send(cummulativeVote);
    return;
  });
}

function retrieveCalculatedCummulativeVote(req, res) {
  var votesFor = 0;
  var votesAbstain = 0;
  var votesAgainst = 0;
  var queryString = `
    SELECT Vote
    FROM Votes
    WHERE AgendaItemId = ?
  `;

  req.connection.query(queryString, [req.agendaItemId], function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    result.forEach(el => {
      switch (el.Vote) {
        case 0:
          votesAgainst++;
          break;
        case 1:
          votesAbstain++;
          break;
        case 2:
          votesFor++;
          break;
      }
    });

    res.status(200).send({
      AgendaItemId: req.agendaItemId,
      VotesFor: votesFor,
      VotesAbstain: votesAbstain,
      VotesAgainst: votesAgainst
    });
    return;
  });
}

function createCummulativeVote(req, res) {
  var queryString = `
    INSERT INTO CummulativeVotes
    (
      AgendaItemId,
      VotesFor,
      VotesAbstain,
      VotesAgainst
    )
    VALUES (?, ?, ?, ?)
  `;
  var values = [
    req.agendaItemId,
    req.body.VotesFor,
    req.body.VotesAbstain,
    req.body.VotesAgainst
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.serverStatus !== 2) {
      res.status(500).send('Glasovi nisu spremljeni!');
      return;
    } else {
      queryString = `
        SELECT *
        FROM CummulativeVotes
        WHERE AgendaItemId = ?
      `;

      req.connection.query(queryString, [req.agendaItemId], function(error, result) {
        if (error) {
          res.status(500).send(error);
          return;
        }

        var cummulativeVotes = result[0];
        var location = 
          'Location: /api/meetings/' +
          req.meetingId +
          '/agenda/agenda-items/' +
          req.agendaItemId +
          '/cummulative-votes/';

        res.set('Location', location);
        res.status(201).send(cummulativeVotes);
        return;
      });
    }
  });
}

function replaceCummulativeVote(req, res) {
  var queryString = `
    UPDATE CummulativeVotes
    SET
      VotesFor = ?,
      VotesAbstain = ?,
      VotesAgainst = ?
    WHERE AgendaItemId = ?
  `;
  var values = [
    req.body.VotesFor,
    req.body.VotesAbstain,
    req.body.VotesAgainst,
    req.agendaItemId
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.serverStatus !== 2) {
      res.status(500).send('Glasovi nisu promijenjeni!');
      return;
    }

    queryString = `
      SELECT *
      FROM CummulativeVotes
      WHERE AgendaItemId = ?
    `;

    req.connection.query(queryString, [req.agendaItemId], function(error, result) {
      if (error) {
        res.status(500).send(error);
        return;
      }

      var cummulativeVote = result[0];

      res.status(200).send(cummulativeVote);
      return;
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
