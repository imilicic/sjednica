var {check, validationResult} = require('express-validator/check');
var express = require('express');

var router = express.Router();

router.use('/:voteId', [
  check('voteId')
    .exists()
    .withMessage('VoteId is required')
    .isInt({gt: 0})
    .withMessage('Invalid VoteId'),
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
    findVoteById(req, res, req.params.voteId)
      .then((vote) => {
        if (vote.length === 0) {
          res.status(404).send('Glas ne postoji!');
          return;
        } else {
          req.vote = vote[0];
          next();
        }
      }, (error) => {
        res.status(500).send(error);
        return;
      });
  }
]);

// Supports GET, POST
router.route('/')
  .get(retrieveVotes)
  .post([
    isVotingOpened,
    check('Vote')
      .exists()
      .withMessage('Vote is required')
      .isIn([0,1,2])
      .withMessage('Invalid Vote'),
    function(req, res, next) {
      var errors = validationResult(req);

      if (errors.isEmpty()) {
        next();
      } else {
        res.status(422).send(errors.mapped());
        return;
      }
    },
    createVote
  ]);

// Supports GET, PUT
router.route('/:voteId')
  .get([
    retrieveVote
  ])
  .put([
    isVotingOpened,
    check('Vote')
      .exists()
      .withMessage('Vote is required')
      .isIn([0,1,2])
      .withMessage('Invalid Vote'),
    function(req, res, next) {
      var errors = validationResult(req);

      if (errors.isEmpty()) {
        next();
      } else {
        res.status(422).send(errors.mapped());
        return;
      }
    },
    replaceVote
  ]);

function createVote(req, res) {
  var queryString = `
    INSERT INTO Votes (AgendaItemId, UserId, Vote)
    VALUES (?, ?, ?)
  `;
  var values = [
    req.agendaItemId,
    req.decoded.UserId,
    req.body.Vote
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.serverStatus !== 2) {
      res.status(500).send('Glasanje nije spremljeno!');
      return;
    }

    queryString = `
      SELECT *
      FROM Votes
      WHERE VoteId = ?
    `;

    req.connection.query(queryString, [result.insertId], function(error, result) {
      if (error) {
        res.status(500).send(error);
        return;
      }

      var vote = result[0];
      var location = 
        'Location: /api/meetings/' + 
        req.meetingId + 
        '/agenda/agenda-items/' + 
        req.agendaItemId + 
        '/votes/' + 
        vote.VoteId

      res.set('Location', location);
      res.status(201).send(vote);
      return;
    });
  });
}

function retrieveVotes(req, res) {
  var queryString = `
    SELECT *
    FROM Votes
    WHERE
      AgendaItemId = ? AND
      UserId = ?
  `;
  var values = [
    req.agendaItemId,
    req.decoded.UserId
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    res.status(200).send(result);
    return;
  });
}

function retrieveVote(req, res) {
  res.status(200).send(req.vote);
  return;
}

function replaceVote(req, res) {
  var queryString = `
    UPDATE Votes
    SET
      Vote = ?,
      UserId = ?
    WHERE VoteId = ?
  `;
  var values = [
    req.body.Vote,
    req.decoded.UserId,
    req.params.voteId
  ];

  req.connection.query(queryString, values, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.serverStatus !== 2) {
      res.status(500).send('Glasanje nije spremljeno!');
      return;
    }

    queryString = `
      SELECT *
      FROM Votes
      WHERE VoteId = ?
    `;

    req.connection.query(queryString, [req.params.voteId], function(error, result) {
      if (error) {
        res.status(500).send(error);
        return;
      }

      var vote = result[0];

      res.status(201).send(vote);
      return;
    });
  });
}

function findVoteById(req, res, voteId) {
  return new Promise((resolve, reject) => {
    var queryString = `
      SELECT *
      FROM Votes
      WHERE
        VoteId = ? AND
        AgendaItemId = ?
    `;
    var values = [
      voteId,
      req.agendaItemId
    ];
  
    req.connection.query(queryString, values, function(error, result) {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
}

function isVotingOpened(req, res, next) {
  // electronic remotely
  if (req.meeting.TypeId === 1) {
    var date = new Date(req.meeting.DateTime);
    var now = new Date();

    if (date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === date.getFullYear()) {
      next();
    } else {
      res.status(403).send('Glasanje je zatvoreno!');
      return;
    }
  } else if (req.meeting.TypeId === 2) { // electronic locally
    findVoting(req, res).then((voting) => {
      if (voting.length === 0) {
        res.status(403).send('Glasanje je zatvoreno!');
        return;
      } else {
        next();
      }
    }, (error) => {
      res.status(500).send(error);
      return;
    });
  } else { // non electronic
    res.status(403).send('Sjednica nije elektronska!');
    return;
  }
}

function findVoting(req, res) {
  return new Promise((resolve, reject) => {
    var queryString = `
      SELECT *
      FROM Votings
      WHERE AgendaItemId = ?
    `;

    req.connection.query(queryString, [req.agendaItemId], function(error, result) {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
}

module.exports = router;
