var config = require('../../config');
var express = require('express');
var jsonWebToken = require('jsonwebtoken');
var passwordHash = require('../../passwordHash');

var loginRouter = express.Router();

loginRouter.post('/', loginUser);

module.exports = loginRouter;

function loginUser(req, res) {
    if(!req.body.Email || !req.body.Password) {
        return res.status(400).send('Morate unijeti i e-mail i lozinku!');
    }

    var email = req.body.Email;
    var password = req.body.Password;

    var queryString = 'SELECT UserId, FirstName, LastName, Email, PhoneNumber, Password, Salt, Name AS RoleName FROM Users INNER JOIN Roles USING(RoleId) WHERE Email = ?';

    req.connection.query(queryString, [email], function(error, user) {
        if (error) {
            throw error;
        }

        if (user.length === 0) {
            return res.status(422).send('Korisnik ne postoji!');
        }

        var user = user[0];
        var passwordData = passwordHash.hashPassword(password, user.Salt);

        if (user.Password !== passwordData.passwordHash) {
            return res.status(422).send('Kriva lozinka!');
        }

        delete user.Password;
        delete user.Salt;

        queryString = 'SELECT CouncilMembershipId, StartDate, EndDate FROM CouncilMemberships WHERE UserId = ? ORDER BY StartDate DESC';

        req.connection.query(queryString, [user.UserId], function(error, history) {
            if (error) {
                throw error;
            }

            var councilMemberships = {
                IsCouncilMember: false,
                History: []
            };
            
            if (history.length > 0) {
                var now = new Date();

                if (new Date(history[0].StartDate) <= now && now <= new Date(history[0].EndDate)) {
                    councilMemberships.IsCouncilMember = true;
                }

                councilMemberships.History = history;
            }
            
            user.CouncilMemberships = councilMemberships;
            
            var auth_token = jsonWebToken.sign(user, config.secret, {
                expiresIn: '1d'
            });

            return res.status(201).send({
                auth_token: auth_token
            });
        });
    });
}