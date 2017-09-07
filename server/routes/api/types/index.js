var router = require('express').Router();

// Supports GET
router.route('/')
  .get(retrieveTypes);

function retrieveTypes(req, res) {
  var queryString = `
    SELECT *
    FROM Types
  `;

  req.connection.query(queryString, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    res.status(200).send(result);
    return;
  });
}

module.exports = router;