const express = require('express');
const router = express.Router();
const Catway = require('../models/catway');
const private = require('../middlewares/private');

const serviceCatways = require('../services/catways')
const reservationsRouter = require('./reservations');

router.get('/manage', private.checkJWT, async (req, res) => {
    
    try {
        const catways = await Catway.find();
        
        return res.render('catways', {catways: catways});
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/add', private.checkJWT, (req, res) => {
  res.render('addCatway');
});
router.post('/', private.checkJWT, serviceCatways.add);

router.get('/', private.checkJWT, serviceCatways.getAll);

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

router.get('/edit/:id', private.checkJWT, async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id); // Récupère le catway à modifier
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

router.delete('/:id', private.checkJWT, serviceCatways.delete);

router.use('/:catwayNumber/reservations', reservationsRouter);

module.exports = router;