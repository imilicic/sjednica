// apiRoutes.js

var config = require("./config");
var connection = require("./connection");
var jsonWebToken = require("jsonwebtoken");
var passwordHash = require("./passwordHash");

/**
 * returns jwt token from HTTP request
 * @function
 * @param {HTTP Request Object} request - HTTP Request
 */
var getToken = function (request) {
    if (request.headers.authorization) {
        var parts = request.headers.authorization.split(" ");

        if (parts.length == 2) {
            if (parts[0] == "Bearer") {
                return parts[1];
            }
        }
    }

    return false;
}

module.exports = function (apiRoutes) {
    apiRoutes.post("/login", function (request, response) {
        if(!request.body.email || !request.body.password) {
            return response.status(400).send("Morate unijeti i e-mail i lozinku!");
        }

        var email = request.body.email;
        var password = request.body.password;

        var queryString = "SELECT PersonId, FirstName, LastName, Email, PhoneNumber, Password, Salt, RoleName FROM Person INNER JOIN Role USING(RoleId) WHERE Email = ?";
        connection.query(queryString, [email], function (error, userArray) {
            if (error) {
                throw error;
            }

            if (userArray.length == 0) {
                return response.status(401).send("Korisnik ne postoji!");
            } else {
                var user = userArray[0];
                var passwordData = passwordHash.sha512(password, user.Salt);

                if (user.Password !== passwordData.passwordHash) {
                    return response.status(401).send("Kriva lozinka!");
                } else {
                    delete user.Password;
                    delete user.Salt;

                    var token = jsonWebToken.sign(user, config.secret, {
                        expiresIn: "1d"
                    });

                    return response.status(201).send({
                        auth_token: token
                    });
                }
            }
        });
    });

    apiRoutes.use(function(request, response, next) {
        var token = getToken(request);

        if (token) {
            jsonWebToken.verify(token, config.secret, function(error, decoded) {
                if (error) {
                    return response.status(401).send("Prijava nije valjana!");
                } else {
                    request.decoded = decoded;
                    next();
                }
            });
        } else {
            return response.status(401).send("Niste prijavljeni!");
        }
    });

    apiRoutes.get("/get/users", function(request, response) {
        if (request.decoded.RoleName == "admin") {
            var queryString = "SELECT PersonId, FirstName, LastName, Email, PhoneNumber, RoleName FROM Person INNER JOIN Role USING(RoleId)";
            
            connection.query(queryString, function(error, result) {
                if (error) {
                    throw error;
                }

                return response.status(201).send({
                    users: result
                });
            });
        } else {
            return response.status(401).send("You are not admin!");
        }
    });

    apiRoutes.put("/put/users/password", function (request, response) {
        if (!request.body.newPassword || !request.body.oldPassword) {
            return response.status(400).send("Nevaljan zahtjev!");
        }

        var newPassword = request.body.newPassword;
        var oldPassword = request.body.oldPassword;
        var user = request.decoded;

        var queryString = "SELECT Password, Salt FROM Person WHERE PersonId = ?";
        connection.query(queryString, [user.PersonId], function(error, passwordData) {
            if (error) {
                throw error;
            }

            var salt = passwordData[0].Salt;
            var password = passwordData[0].Password;

            passwordData = passwordHash.sha512(oldPassword, salt);

            if (passwordData.passwordHash != password) {
                return response.status(401).send("Stara lozinka je kriva!");
            } else {
                salt = passwordHash.generateRandomString(16);
                passwordData = passwordHash.sha512(newPassword, salt);

                queryString = "UPDATE Person SET Password = ?, Salt = ? WHERE PersonId = ?";
                connection.query(queryString, [passwordData.passwordHash, salt, user.PersonId], function (error, result) {
                    if (error) {
                        throw error;
                    }

                    if(result.changedRows == 1) {
                        return response.status(201).send("Lozinka je uspješno promijenjena!");
                    } else {
                        return response.status(500).send("Lozinka nije promijenjena!");
                    }
                });
            }
        });
    });

    return apiRoutes;
}