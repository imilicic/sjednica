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
        var email = request.body["email"];
        var password = request.body["password"];

        var queryString = "SELECT PersonId, FirstName, LastName, Email, PhoneNumber, Password, Salt, RoleName FROM Person INNER JOIN Role USING(RoleId) WHERE Email = ?";
        connection.query(queryString, [email], function (error, result) {
            if (error) {
                throw error;
            }

            if (result.length == 0) {
                response.json({
                    success: false,
                    message: "user-not-found"
                });
            } else {
                var salt = result[0].Salt;
                var passwordData = passwordHash.sha512(password, salt);

                if (result[0].Password !== passwordData.passwordHash) {
                    response.json({
                        success: false,
                        message: "wrong-password"
                    });
                } else {
                    var token = jsonWebToken.sign(result[0], config.secret, {
                        expiresIn: "1d"
                    });

                    var user = {
                        PersonId: result[0].PersonId,
                        FirstName: result[0].FirstName,
                        LastName: result[0].LastName,
                        Email: result[0].Email,
                        PhoneNumber: result[0].PhoneNumber,
                        RoleName: result[0].RoleName
                    };

                    response.json({
                        success: true,
                        message: "successful",
                        token: token,
                        user: user
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
                    response.json({
                        success: false,
                        message: "Failed to authenticate token."
                    });
                } else {
                    request.decoded = decoded;
                    next();
                }
            });
        } else {
            response.json({
                success: false,
                message: "No token provided."
            });
        }
    });

    apiRoutes.get("/get/users/current", function (request, response) {
        var decoded = request.decoded;
        
        response.json({
            PersonId: decoded.PersonId,
            FirstName: decoded.FirstName,
            LastName: decoded.LastName,
            Email: decoded.Email,
            PhoneNumber: decoded.PhoneNumber,
            RoleName: decoded.RoleName
        });
    });

    apiRoutes.get("/get/users", function(request, response) {
        if (request.decoded.RoleName == "admin") {
            var queryString = "SELECT PersonId, FirstName, LastName, Email, PhoneNumber, RoleName FROM Person INNER JOIN Role USING(RoleId)";
            connection.query(queryString, function(error, result) {
                if (error) {
                    throw error;
                }

                response.json({
                    success: true,
                    message: "founded",
                    users: result
                })
            });
        } else {
            response.json({
                success: false,
                message: "not-admin"
            });
        }
    });

    apiRoutes.put("/put/users/password", function (request, response) {
        var personId = request.body["personId"]
        var newPassword = request.body["newPassword"];
        var oldPassword = request.body["oldPassword"];
        var user = request.decoded;

        var salt = user.Salt;
        var password = user.Password;
        var passwordData = passwordHash.sha512(oldPassword, salt);

        if (passwordData.passwordHash != password) {
            response.json({
                success: false,
                message: "wrong-old-password"
            });
        } else {
            salt = passwordHash.generateRandomString(16);
            passwordData = passwordHash.sha512(newPassword, salt);

            var newUser = {
                PersonId: user.PersonId,
                FirstName: user.FirstName,
                LastName: user.LastName,
                Email: user.Email,
                PhoneNumber: user.PhoneNumber,
                Password: passwordData.passwordHash,
                Salt: passwordData.salt,
                RoleId: user.RoleId
            };

            queryString = "UPDATE Person SET Password = ?, Salt = ? WHERE PersonId = ?";
            connection.query(queryString, [newUser.Password, newUser.Salt, newUser.PersonId], function (error, result) {
                if (error) {
                    throw error;
                }

                if(result.changedRows == 1) {
                    var token = jsonWebToken.sign(newUser, config.secret, {
                        expiresIn: "1d"
                    });

                    response.json({
                        success: true,
                        message: "successful",
                        token: token
                    });
                } else {
                    response.json({
                        success: false,
                        message: "unsuccessful"
                    });
                }
            });
        }
    });

    return apiRoutes;
}