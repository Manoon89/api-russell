const express = require('express');
const router = express.Router();
const Catway = require('../models/catway');
const private = require('../middlewares/private');

const serviceCatways = require('../services/catways')

// Permet d'accéder à la page de gestion des catways avec la liste de tous les catways
router.get('/', private.checkJWT, serviceCatways.getAll);

// Permet d'accéder à la page de création d'un nouveau Catway
router.get('/add', private.checkJWT, serviceCatways.goToAdd);

// Permet de créer un nouveau Catway
router.post('/', private.checkJWT, serviceCatways.add);

// Permet d'accéder aux détails d'un catway, y compris la date de création & la date de modification
router.get('/:id', private.checkJWT, serviceCatways.getOne);

// Permet d'accéder à la page de modification d'un catway
router.get('/edit/:id', private.checkJWT, serviceCatways.goToEdit);

// Permet de modifier un Catway
router.put('/:id', private.checkJWT, serviceCatways.update);

// Permet de supprimer un catway
router.delete('/:id', private.checkJWT, serviceCatways.delete);

module.exports = router;