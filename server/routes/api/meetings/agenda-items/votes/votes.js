var {check, validationResult} = require('express-validator/check');
var router = require('express').Router();

// Supports GET
router.route('/')
  .get(retrieveVotes);

function retrieveVotes(req, res) {
  var queryString = `
    SELECT
      AgendaItemId,
      VoteId,
      Vote
    FROM Votes
    INNER JOIN AgendaItems
    USING (AgendaItemId)
    WHERE
      MeetingId = ? AND
      UserId = ?
  `;
  var values = [
    req.meeting.MeetingId,
    req.decoded.UserId
  ];

   req.connection.query(queryString, values, function(error, result) {
     if (error) {
       res.status(500).send(error);
     }

     res.status(200).send(result);
   });
}

module.exports = router;