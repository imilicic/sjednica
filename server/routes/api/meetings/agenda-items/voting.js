var {check, validationResult} = require('express-validator/check');
var express = require('express');

var router = express.Router();

// Supports GET, POST, DELETE
router.route('/')
  .get([
    retrieveVoting
  ])
  .post([
    createVoting
  ])
  .delete([
    function(req, res, next) {
      findVotingById(req, res)
        .then((voting) => {
          if (voting.length === 0) {
            res.status(404).send('Glasanje nije otvoreno!');
            return;
          } else {
            next();
          }
        }, (error) => {
          res.status(500).send(error);
          return;
        });
    },
    deleteVoting
  ])

function retrieveVoting(req, res) {
  var queryString = `
    SELECT *
    FROM Votings
    WHERE AgendaItemId = ?
  `;

  req.connection.query(queryString, [req.agendaItemId], function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    res.status(200).send(result);
    return;
  });
}

function createVoting(req, res) {
  var queryString = `
    INSERT INTO Votings
    (
      AgendaItemId
    )
    VALUES (?)
  `;

  req.connection.query(queryString, [req.agendaItemId], function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    queryString = `
      SELECT *
      FROM Votings
      WHERE AgendaItemId = ?
    `;

    req.connection.query(queryString, [req.agendaItemId], function(error, result) {
      if (error) {
        res.status(500).send(error);
        return;
      }

      var voting = result[0];
      var location = 
        'Location: /api/meetings/' +
        req.meetingId +
        '/agenda-items/' +
        req.agendaItemId +
        '/voting';

      res.set('Location', location);
      res.status(201).send(voting);
      return;
    });
  });
}

function deleteVoting(req, res) {
  var queryString = `
    DELETE FROM Votings
    WHERE AgendaItemId = ?
  `;

  req.connection.query(queryString, [req.agendaItemId], function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    if (result.serverStatus !== 2) {
      res.status(500).send('Glasanje nije zatvoreno!');
      return;
    } else {
      res.status(500).send('Glasanje je zatvoreno!');
      return;
    }
  });
}

function findVotingById(req, res) {
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