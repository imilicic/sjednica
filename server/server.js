// server.js

'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static('./'));

require("./routes")(app);

app.listen(3000, function(){
    console.log("Listening on port 3000... ");
});