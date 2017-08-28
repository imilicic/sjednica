var express = require('express');

var meetingRouter = require('./meetings/meeting');
var userRouter = require('./users/user');

var apiRouter = express.Router();

apiRouter.use('/meetings', meetingRouter);
apiRouter.use('/users', userRouter);

module.exports = apiRouter;