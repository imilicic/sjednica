var express = require('express');

var router = express.Router();
var meetingRouter = require('./meetings');
var userRouter = require('./users');

router.use('/meetings', meetingRouter);
router.use('/users', userRouter);

module.exports = router;