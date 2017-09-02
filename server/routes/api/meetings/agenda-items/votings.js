var {check, validationResult} = require('express-validator/check');
var express = require('express');

var router = express.Router();

// Supports GET
router.route('/')
  .get([
    retrieveVotings
  ]);

function retrieveVotings(req, res) {
  var queryString = `
    SELECT Votings.AgendaItemId
    FROM Votings
    INNER JOIN AgendaItems
    USING(AgendaItemId)
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

module.exports = router;
