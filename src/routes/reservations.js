const express = require('express');
const router = express.Router();

const serviceReservations = require('../services/reservations')

/* en commentaire en attendant de compléter les fichiers du dossier service
router.get('/:id/reservations', serviceReservations.getAll);
router.get('/:id/reservations/:idReservation', serviceReservations.getOne);
router.post('/:id/reservations', serviceReservations.add);
router.put('/:id/reservations', serviceReservations.update);
router.delete('/:id/reservations/:idReservation', serviceReservations.delete);
*/

module.exports = router;