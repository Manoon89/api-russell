const express = require('express');
const router = express.Router({mergeParams: true});
const Reservation = require('../models/reservation');
const private = require('../middlewares/private');

const serviceReservations = require('../services/reservations')

router.get('/manage', private.checkJWT, async (req, res) => {

    try {
        const reservations = await Reservation.find();
        
        return res.render('reservations', {reservations: reservations});
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/', serviceReservations.add);
router.get('/', serviceReservations.getAll);

/* en commentaire en attendant de compléter les fichiers du dossier service
router.get('/:idReservation', serviceReservations.getOne);
router.put('/:id/reservations', serviceReservations.update);
router.delete('/:id/reservations/:idReservation', serviceReservations.delete);
*/

module.exports = router;