// server.js

'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var path = require("path");

var app = express();
var apiRoutes = express.Router();
apiRoutes = require("./apiRoutes")(apiRoutes);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static('./'));

app.use("/api", apiRoutes);

app.get(["/login", "/users", "/users/me", "/meetings"], function(request, response) {
    response.sendFile(path.join(__dirname, "../index.html"));
});

app.get("*", function(request, response) {
    response.json({
        success: false,
        message: "Page not found!"
    });
});

app.listen(3000, function(){
    console.log("Listening on port 3000... ");
});