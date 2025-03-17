const express = require('express');
const router = express.Router();
const User = require('../models/user');
const private = require('../middlewares/private');

const serviceUsers = require('../services/users')

// Permet d'accéder à la page de gestion des utilisateurs
router.get('/manage', private.checkJWT, async (req, res) => {

    try {
        const users = await User.find();
        
        return res.render('users', {users: users});
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

// Permet d'accéder à la page d'ajout d'un utilisateur
router.get('/add', private.checkJWT, (req, res) => {
  res.render('addUser');
});
router.post('/', private.checkJWT, serviceUsers.add);

// Permet d'accéder à la page des détails d'un utilisateur (sauf le mot de passe)
router.get('/details/:email', private.checkJWT, async (req, res) => {
  try {
      const user = await User.findOne({ email: req.params.email }); // Recherche par email
      if (!user) {
          return res.redirect('/users/manage?error=Utilisateur introuvable');
      }
      return res.render('detailsUser', { user: user });
  } catch (error) {
      console.error('Erreur lors de la récupération des détails :', error);
      return res.redirect('/users/manage?error=Erreur lors de la récupération des détails');
  }
});
router.get('/:email', private.checkJWT, serviceUsers.getByEmail);

// Permet d'accéder à la liste de tous les utilisateurs
router.get('/', private.checkJWT, serviceUsers.getAll);

// Permet d'accéder à la page de modification d'un utilisateur
router.get('/edit/:email', private.checkJWT, async (req, res) => {
  try {
      const user = await User.findOne({ email: req.params.email }); // Recherche par email
      if (!user) {
          return res.redirect('/users/manage?error=Utilisateur introuvable');
      }
      return res.render('editUser', { user: user });
  } catch (error) {
      console.error('Erreur lors de la récupération pour modification :', error);
      return res.redirect('/users/manage?error=Erreur lors de la récupération pour modification');
  }
});
router.put('/:email', private.checkJWT, serviceUsers.update);

// Permet de supprimer un utilisateur
router.delete('/:email', private.checkJWT, serviceUsers.delete);

// Permet d'accéder à l'authentification d'un utilisateur sur la page d'accueil
router.post('/authenticate', serviceUsers.authenticate);

module.exports = router;