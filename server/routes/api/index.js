var router = require('express').Router();

router.use('/meetings', require('./meetings'));
router.use('/roles', require('./roles'));
router.use('/types', require('./types'));
router.use('/users', require('./users'));

module.exports = router;