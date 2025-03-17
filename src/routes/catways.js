const express = require('express');
const router = express.Router();

const serviceCatways = require('../services/catways')
const reservationsRouter = require('./reservations');

router.get('/manage', (req, res) => {
    res.render('catways');
  });

router.post('/', serviceCatways.add);
router.get('/', serviceCatways.getAll);
router.get('/:id', serviceCatways.getOne);
router.put('/:id', serviceCatways.update);
router.delete('/:id', serviceCatways.delete);

router.use('/:catwayNumber/reservations', reservationsRouter);

module.exports = router;