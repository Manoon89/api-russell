const express = require('express');
const router = express.Router();
const private = require('../middlewares/private');
const servicesDashboard = require('../services/dashboard');

// Permet de rendre la page tableau de bord avec les informations de l'utilisateur connecté & la liste des réservations
router.get('/', private.checkJWT, servicesDashboard.goToDashboard);

module.exports = router;