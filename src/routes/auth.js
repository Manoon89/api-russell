const express = require('express');
const router = express.Router();
const authService = require('../services/auth');

router.post('/login', authService.login);
router.get('/logout', authService.logout);

module.exports = router;