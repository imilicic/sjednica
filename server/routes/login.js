
var config = require("../config");
var connection = require("../connection");
var express = require('express');
var jsonWebToken = require("jsonwebtoken");
var passwordHash = require("../passwordHash");

var loginRouter = express.Router();

loginRouter.post("/", loginUser);

module.exports = loginRouter;

function loginUser(request, response) {
    if(!request.body.Email || !request.body.Password) {
        return response.status(400).send("Morate unijeti i e-mail i lozinku!");
    }

    var email = request.body.Email;
    var password = request.body.Password;

    var queryString = "SELECT UserId, FirstName, LastName, Email, PhoneNumber, Password, Salt, Name AS RoleName FROM Users INNER JOIN Roles USING(RoleId) WHERE Email = ?";
    connection.query(queryString, [email], function(error, user) {
        if (error) {
            throw error;
        }

        if (user.length === 0) {
            return response.status(422).send("Korisnik ne postoji!");
        }

        var user = user[0];
        var passwordData = passwordHash.hashPassword(password, user.Salt);

        if (user.Password !== passwordData.passwordHash) {
            return response.status(422).send("Kriva lozinka!");
        }

        delete user.Password;
        delete user.Salt;

        queryString = "SELECT StartDate, EndDate FROM CouncilMemberships WHERE UserId = ? ORDER BY StartDate DESC";
        connection.query(queryString, [user.UserId], function(error, history) {
            if (error) {
                throw error;
            }
            
            if (history.length > 0) {
                var councilMemberships = {
                    IsCouncilMember: false
                };
                var now = new Date();

                if (new Date(history[0].StartDate) <= now && now <= new Date(history[0].EndDate)) {
                    councilMemberships.IsCouncilMember = true;
                }

                councilMemberships.history = history;
                user.CouncilMemberships = councilMemberships;
            }

            var auth_token = jsonWebToken.sign(user, config.secret, {
                expiresIn: "1d"
            });

            return response.status(201).send({
                auth_token: auth_token
            });
        });
    });
}