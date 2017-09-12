var router = require('express').Router();

router.use('/council-members', require('./council-members'));
router.use('/meetings', require('./meetings'));
router.use('/roles', require('./roles'));
router.use('/types', require('./types'));
router.use('/users', require('./users'));

module.exports = router;