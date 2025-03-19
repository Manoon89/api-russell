const express = require('express');
const router = express.Router();
const authService = require('../services/auth');

router.post('/login', authService.login);

/**
 * @swagger
 * /logout: 
 *  get: 
 *      summary: Déconnecte l'utilisateur
 *      description: Cette route supprimer le cookie d'authentification de l'utilisateur et renvoie un message de confirmation
 *      tags: [Authentification]
 *      responses: 
 *          200: 
 *              description: déconnexion réussie
 */
router.get('/logout', authService.logout);

module.exports = router;