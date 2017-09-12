var router = require('express').Router();

// Supports GET
router.route('/')
  .get(
    retrieveCouncilMembers
  );

function retrieveCouncilMembers(req, res) {
  var queryString = `
    SELECT
      Email,
      FirstName,
      LastName,
      PhoneNumber,
      RoleId,
      UserId,
      StartDate,
      EndDate,
      CouncilMembershipId
    FROM Users
    INNER JOIN CouncilMemberships
    USING (UserId)
    WHERE
      NOW() BETWEEN StartDate AND EndDate
  `;

  req.connection.query(queryString, function(error, result) {
    if (error) {
      res.status(500).send(error);
      return;
    }

    result.map(user => {
      var start = user.StartDate;
      var end = user.EndDate;
      var id = user.CouncilMembershipId;

      delete user.StartDate;
      delete user.EndDate;
      delete user.CouncilMembershipId;

      user.CouncilMemberships = [{
        StartDate: start,
        EndDate: end,
        CouncilMembershipId: id
      }];
      
      return user;
    })

    res.status(200).send(result);
    return;
  });
}

module.exports = router;