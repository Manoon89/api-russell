const express = require('express');
const router = express.Router();
const User = require('../models/user');
const private = require('../middlewares/private');

const serviceUsers = require('../services/users')

// Permet d'accéder à la page de gestion des utilisateurs avec la liste de tous les utilisateurs
router.get('/', private.checkJWT, serviceUsers.getAll);

// Permet d'accéder à la page de création d'un nouvel utilisateur
router.get('/add', private.checkJWT, serviceUsers.goToAdd);

// Permet de créer un nouvel utilisateur
router.post('/', private.checkJWT, serviceUsers.add);

// Permet d'accéder à la page des détails d'un utilisateur (sauf le mot de passe)
router.get('/:email', private.checkJWT, serviceUsers.getByEmail);

// Permet d'accéder à la page de modification d'un utilisateur
router.get('/edit/:email', private.checkJWT, serviceUsers.goToEdit);

// Permet de modifier un utilisateur
router.put('/:email', private.checkJWT, serviceUsers.update);

// Permet de supprimer un utilisateur
router.delete('/:email', private.checkJWT, serviceUsers.delete);

// Permet d'accéder à l'authentification d'un utilisateur sur la page d'accueil
router.post('/authenticate', serviceUsers.authenticate);

module.exports = router;