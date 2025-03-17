const express = require('express');
const router = express.Router();
const authService = require('../services/auth');

router.post('/login', authService.login);

// Permet de rendre la vue "dashboard" une fois l'authentification réussie. 
router.get('/dashboard', (req, res) => {
    res.render('dashboard', { user: req.session?.user || null });
});

router.get('/logout', authService.logout);

module.exports = router;