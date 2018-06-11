const router = require('express').Router();

const BaseController = require('../libs/core/BaseController');
router.get('/teste', BaseController.action('AccountController', 'teste'));

module.exports = router;