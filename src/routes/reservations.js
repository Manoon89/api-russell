const express = require('express');
const router = express.Router({mergeParams: true});

const serviceReservations = require('../services/reservations')

router.post('/', serviceReservations.add);
router.get('/', serviceReservations.getAll);

/* en commentaire en attendant de compléter les fichiers du dossier service
router.get('/:idReservation', serviceReservations.getOne);
router.put('/:id/reservations', serviceReservations.update);
router.delete('/:id/reservations/:idReservation', serviceReservations.delete);
*/

module.exports = router;