// server.js

'use strict'

var bodyParser = require('body-parser');
var express = require('express');
var path = require("path");

var app = express();

var loginRouter = require("./routes/login");
var userRouter = require("./routes/user");
var meetingRouter = require("./routes/meeting");

app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('./'));

app.use("/authentication", loginRouter);
app.use("/api/meetings", meetingRouter);
app.use("/api/users", userRouter);

app.get("*", function(request, response) {
    response.sendFile(path.join(__dirname, "../index.html"));
});

app.listen(app.get('port'), function(){
    console.log("Listening on port", app.get('port'));
});