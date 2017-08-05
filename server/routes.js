// routes.js

var config = require("./config");
var connection = require("./connection");
var path = require("path");
var jsonWebToken = require("jsonwebtoken");

module.exports = function (app) {
    app.post('/api/login', function (request, response) {
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
                    token: token
                });
            }
        });
    });

    app.get('*', function (request, response) {
        response.sendFile(path.join(__dirname, '../index.html'))
    });
}