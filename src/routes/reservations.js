const express = require('express');
const router = express.Router({mergeParams: true});
const Reservation = require('../models/reservation');
const private = require('../middlewares/private');

const serviceReservations = require('../services/reservations')

router.get('/manage', private.checkJWT, async (req, res) => {

    try {
        const reservations = await Reservation.find();
        console.log('Réservations récupérées :', reservations);
        
        return res.render('reservations', {reservations: reservations});
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/add', private.checkJWT, (req, res) => {
  res.render('addReservation');
});
router.post('/', serviceReservations.add);

router.get('/', serviceReservations.getAll);

router.get('/details/:id', private.checkJWT, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id); // Recherche la réservation par son ID
        if (!reservation) {
            return res.redirect('/reservations/manage?error=Réservation introuvable');
        }
        return res.render('detailsReservation', { reservation: reservation });
    } catch (error) {
        console.error('Erreur lors de la récupération des détails :', error);
        return res.redirect('/reservations/manage?error=Erreur lors de la récupération des détails');
    }
});
router.get('/:id', serviceReservations.getOne);

router.get('/edit/:id', private.checkJWT, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id); // Recherche la réservation par son ID
        if (!reservation) {
            return res.redirect('/reservations/manage?error=Réservation introuvable');
        }
        return res.render('editReservation', { reservation: reservation });
    } catch (error) {
        console.error('Erreur lors de la récupération pour modification :', error);
        return res.redirect('/reservations/manage?error=Erreur lors de la récupération pour modification');
    }
});
router.put('/:id', serviceReservations.update);

router.delete('/:id', serviceReservations.delete);

module.exports = router;