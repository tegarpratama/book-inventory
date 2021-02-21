const express = require('express');

const dashboardController = require('../controllers/dashboard');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, dashboardController.getIndex);

module.exports = router;
