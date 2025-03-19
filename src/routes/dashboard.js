const express = require('express');
const router = express.Router();
const private = require('../middlewares/private');
const servicesDashboard = require('../services/dashboard');

/**
 * @swagger
 * /:
 *      get: 
 *          summary: Affiche le tableau de bord de l'utilisateur
 *          description: Cette route récupère les réservations et les informations de l'utilisateur connecté, et affiche le tableau de bord. 
 *          tags: [Dashboard]
 *          security:
 *              - JWT: []
 *          reponses: 
 *              200: vue du tableau de bord rendue avec succès
 *              500: erreur du serveur lors de la récupération des donénes
 */
router.get('/', private.checkJWT, servicesDashboard.goToDashboard);

module.exports = router;