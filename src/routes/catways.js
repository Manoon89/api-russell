const express = require('express');
const router = express.Router();
const Catway = require('../models/catway');
const private = require('../middlewares/private');

const serviceCatways = require('../services/catways')

// Permet d'accéder à la page de gestion des catways
router.get('/manage', private.checkJWT, async (req, res) => {
    
    try {
        const catways = await Catway.find();
        const { error, success } = req.query;
        
        // retourne la liste des catways présents dans la base de données
        return res.render('catways', {
            catways: catways, 
            error: error || null, 
            success: success || null
        });
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

// Permet d'accéder à la page de création d'un nouveau Catway
router.get('/add', private.checkJWT, (req, res) => {
  res.render('addCatway');
});
router.post('/', private.checkJWT, serviceCatways.add);

// Permet d'accéder à la liste de tous les catways
router.get('/', private.checkJWT, serviceCatways.getAll);

// Permet d'accéder aux détails d'un catway, y compris la date de création & la date de modification
router.get('/details/:id', private.checkJWT, async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id); 
        if (!catway) {
            return res.redirect('/catways/manage?error=Catway introuvable');
        }
        return res.render('detailsCatway', { catway: catway });
    } catch (error) {
        console.error('Erreur lors de la récupération du catway :', error);
        return res.redirect('/catways/manage?error=Erreur lors de la récupération');
    }
});
router.get('/:id', private.checkJWT, serviceCatways.getOne);

// Permet d'accéder à la page de modification d'un catway
router.get('/edit/:id', private.checkJWT, async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);
        if (!catway) {
            return res.redirect('/catways/manage?error=Catway introuvable');
        }
        return res.render('editCatway', { catway: catway });
    } catch (error) {
        console.error('Erreur lors de la récupération du catway :', error);
        return res.redirect('/catways/manage?error=Erreur lors de la récupération');
    }
});
router.put('/:id', private.checkJWT, serviceCatways.update);

// Permet de supprimer un catway
router.delete('/:id', private.checkJWT, serviceCatways.delete);

module.exports = router;