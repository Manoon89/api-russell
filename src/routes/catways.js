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

router.post('/', serviceCatways.add);
router.get('/', serviceCatways.getAll);
router.get('/:id', serviceCatways.getOne);
router.put('/:id', serviceCatways.update);
router.delete('/:id', serviceCatways.delete);

router.use('/:catwayNumber/reservations', reservationsRouter);

module.exports = router;