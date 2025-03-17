const express = require('express');
const router = express.Router();
const User = require('../models/user');
const private = require('../middlewares/private');

const serviceUsers = require('../services/users')

router.get('/manage', private.checkJWT, async (req, res) => {

    try {
        const users = await User.find();
        
        return res.render('users', {users: users});
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/add', private.checkJWT, (req, res) => {
  res.render('addUser');
});
router.post('/', serviceUsers.add);

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

router.get('/', private.checkJWT, serviceUsers.getAll);

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

router.delete('/:email', private.checkJWT, serviceUsers.delete);

/* importé avec express-generator. On garde en commentaire au cas où. 
GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/

router.post('/authenticate', serviceUsers.authenticate);

module.exports = router;