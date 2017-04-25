var router = require('express').Router();

router.use('/', require('./homeController'));
router.use('/post', require('./postController'));

module.exports = router;
