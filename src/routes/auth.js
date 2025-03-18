const express = require('express');
const router = express.Router();
const authService = require('../services/auth');

router.post('/login', authService.login);

// Permet de rendre la vue "dashboard" une fois l'authentification réussie. 
router.get('/dashboard', authService.goToDashboard);

router.get('/logout', authService.logout);

module.exports = router;