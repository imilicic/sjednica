var config = require("./config");
var mysql = require("mysql");

var connection = mysql.createConnection(config.connectionObject);
connection.connect(function (error) {
    if (error) { 
        throw error;
    }
});

module.exports = connection;