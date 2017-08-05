// routes.js

var path = require("path");

module.exports = function (app) {
    app.get('*', function (request, response) {
        response.sendFile(path.join(__dirname, '../index.html'))
    });
}