
var config = require("../config");
var connection = require("../connection");
var express = require('express');
var jsonWebToken = require("jsonwebtoken");
var passwordHash = require("../passwordHash");

var loginRouter = express.Router();

loginRouter.post("/", loginUser);

module.exports = loginRouter;

function loginUser(request, response) {
    if(!request.body.email || !request.body.password) {
        return response.status(400).send("Morate unijeti i e-mail i lozinku!");
    }

    var email = request.body.email;
    var password = request.body.password;

    var queryString = "SELECT UserId, FirstName, LastName, Email, PhoneNumber, Password, Salt, Name AS RoleName FROM Users INNER JOIN Roles USING(RoleId) WHERE Email = ?";
    connection.query(queryString, [email], function (error, users) {
        if (error) {
            throw error;
        }

        if (users.length == 0) {
            return response.status(422).send("Korisnik ne postoji!");
        } else {
            var user = users[0];
            var passwordData = passwordHash.hashPassword(password, user.Salt);

            if (user.Password !== passwordData.passwordHash) {
                return response.status(422).send("Kriva lozinka!");
            } else {
                delete user.Password;
                delete user.Salt;

                var auth_token = jsonWebToken.sign(user, config.secret, {
                    expiresIn: "1d"
                });

                return response.status(201).send({
                    auth_token: auth_token
                });
            }
        }
    });
}