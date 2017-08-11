// server.js

'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var path = require("path");

var app = express();
var apiRoutes = express.Router();
apiRoutes = require("./apiRoutes")(apiRoutes);

app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static('./'));

app.use("/api", apiRoutes);

app.get("*", function(request, response) {
    response.sendFile(path.join(__dirname, "../index.html"));
});

app.listen(app.get('port'), function(){
    console.log("Listening on port", app.get('port'));
});