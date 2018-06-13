const router = require('express').Router();

const BaseController = require('../libs/core/BaseController');
router.get('/', BaseController.action('AccountController', 'index'));

module.exports = router;