// routes.js

var config = require("./config");
var connection = require("./connection");
var jsonWebToken = require("jsonwebtoken");

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
        var data = request.body;
        var email = data["email"];
        var password = data["password"];

        queryString = "SELECT * FROM Person WHERE Email = ?";
        connection.query(queryString, [email], function (error, result) {
            if (error) {
                throw error;
            }

            if (result.length == 0) {
                response.json({
                    success: false,
                    message: "Login failed. User not found."
                });
            } else if (result[0].Password !== password) {
                response.json({
                    success: false,
                    message: "Login failed. Wrong password."
                });
            } else {
                var token = jsonWebToken.sign(result[0], config.secret, {
                    expiresIn: "1d"
                });

                response.json({
                    success: true,
                    message: "Login correct!",
                    token: token,
                    user: result[0]
                });
            }
        });
    });

    apiRoutes.use(function(request, response, next) {
        var token = getToken(request);

        if (token) {
            jsonWebToken.verify(token, config.secret, function(error, decoded) {
                if (error) {
                    return response.json({
                        success: false,
                        message: "Failed to authenticate token."
                    });
                } else {
                    request.decoded = decoded;
                    next();
                }
            });
        } else {
            return response.status(403).send({
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
            RoleId: decoded.RoleId
        });
    });

    return apiRoutes;
}