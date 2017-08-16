// userRouter.js

var config = require("../config");
var connection = require("../connection");
var express = require('express');
var jsonWebToken = require("jsonwebtoken");
var passwordHash = require("../passwordHash");

var userRouter = express.Router();

userRouter.use(function(request, response, next) {
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

userRouter.post("/", createUser);
userRouter.get("/", readUsers);
userRouter.get("/:userId", readUser);
userRouter.put("/:userId", updateUser);

module.exports = userRouter;

function createUser(request, response) {
    if (!request.body.FirstName || !request.body.LastName || 
        !request.body.Email || 
        !request.body.Password || !request.body.hasOwnProperty("CouncilMember") ||
        !request.body.hasOwnProperty("CouncilMemberStartEnd")
    ) {
        return response.status(400).send("Nevaljan zahtjev!");
    }

    if (request.decoded.RoleName != "admin") {
        return response.status(401).send("Nisi admin!");
    }

    var councilMember = request.body.CouncilMember;
    var email = request.body.Email;
    var endDate;
    var firstName = request.body.FirstName;
    var lastName = request.body.LastName;
    var password = request.body.Password;
    var phoneNumber;
    var roleId = 3;
    var startDate;

    var queryString = "SELECT * FROM Users WHERE Email = ?"
    connection.query(queryString, [email], function (error, result) {
        if (error) {
            throw error;
        }

        if (result.length > 0) {
            return response.status(422).send("Korisnik s ovim emailom već postoji!");
        } else {
            if (councilMember) {
                var CouncilMemberStartEnd = request.body.CouncilMemberStartEnd[0];
                if(isNaN(Date.parse(CouncilMemberStartEnd.EndDate)) || isNaN(Date.parse(CouncilMemberStartEnd.StartDate))) {
                    return response.status(400).send("Nevaljan datum!");
                }

                roleId = 2;
                endDate = CouncilMemberStartEnd.EndDate.split("T")[0];
                startDate = CouncilMemberStartEnd.StartDate.split("T")[0];
            }

            // var salt = passwordHash.generateRandomString(16);
            var passwordData = passwordHash.hashPassword(password);

            var queryString;
            var values;

            if (request.body.PhoneNumber) {
                phoneNumber = request.body.PhoneNumber;
                queryString = "INSERT INTO Users (FirstName, LastName, Email, Password, Salt, PhoneNumber, RoleId) VALUES (?, ?, ?, ?, ?, ?, ?)";
                values = [firstName, lastName, email, passwordData.passwordHash, passwordData.salt, phoneNumber, roleId];
            } else {
                queryString = "INSERT INTO Users (FirstName, LastName, Email, Password, Salt, RoleId) VALUES (?, ?, ?, ?, ?, ?)";
                values = [firstName, lastName, email, passwordData.passwordHash, passwordData.salt, roleId];
            }

            connection.query(queryString, values, function (error, result) {
                if (error) {
                    throw error;
                }

                if (result.serverStatus == 2) {
                    if (councilMember) {
                        var queryString2 = "INSERT INTO CouncilMembers (UserId, StartDate, EndDate) VALUES (?, ?, ?)";
                        connection.query(queryString2, [result.insertId, startDate, endDate], function(error2, result2) {
                            if (error2) {
                                throw error2;
                            }

                            if (result2.serverStatus == 2) {
                                return response.status(201).send("Korisnik je izrađen.");
                            } else {
                                return response.status(201).send("Korisnik je izrađen, ali nije dodan u vijeće!");
                            }
                        });
                    } else {
                        return response.status(201).send("Korisnik je izrađen.");
                    }
                } else {
                    return response.status(500).send("Korisnik nije izrađen.");
                }
            });
        }
    });
}

function readUser(request, response) {
    if (request.decoded.RoleName == "admin") {
        var userId = request.params.userId;
        var queryString = "SELECT UserId, FirstName, LastName, Email, PhoneNumber, Name AS RoleName FROM Users INNER JOIN Roles USING (RoleId) WHERE UserId = ? ";

        connection.query(queryString, [userId], function(error, user) {
            if (error) {
                throw error;
            }
            
            if (user.length > 0) {
                user = user[0];

                if (user.RoleName == 'councilmember') {
                    queryString = "SELECT StartDate, EndDate FROM CouncilMembers WHERE UserId = ? ORDER BY StartDate DESC";
                    connection.query(queryString, [userId], function(error, councilMemberStartEnd) {
                        if (error) {
                            throw error;
                        }

                        if (councilMemberStartEnd.length > 0) {
                            user.CouncilMemberStartEnd = councilMemberStartEnd;
                            return response.status(201).send(user);
                        } else {
                            return response.status(422).send("Korisnik je član vijeća, ali nema datuma članstva!");
                        }
                    });
                } else {
                    return response.status(201).send(user);
                }
            } else {
                return response.status(422).send("Korisnik ne postoji!");
            }
        });
    } else {
        return response.status(401).send("Nisi admin!");
    }
}

function readUsers(request, response) {
    if (request.decoded.RoleName == "admin") {
        var queryString = "SELECT UserId, FirstName, LastName, Email, PhoneNumber, Name AS RoleName FROM Users INNER JOIN Roles USING(RoleId)";
        
        connection.query(queryString, function(error, users) {
            if (error) {
                throw error;
            }

            return response.status(201).send({
                users: users
            });
        });
    } else {
        return response.status(401).send("Nisi admin!");
    }
}

function updateUser(request, response) {
    if (!request.body.newPassword || !request.body.oldPassword) {
        return response.status(400).send("Nevaljan zahtjev!");
    }

    var newPassword = request.body.newPassword;
    var oldPassword = request.body.oldPassword;
    var user = request.decoded;

    var queryString = "SELECT Password, Salt FROM Users WHERE UserId = ?";
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

            queryString = "UPDATE Users SET Password = ?, Salt = ? WHERE UserId = ?";
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
}

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