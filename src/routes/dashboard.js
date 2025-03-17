const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation');
const private = require('../middlewares/private');

// Permet de rendre la page tableau de bord avec les informations de l'utilisateur connecté & la liste des réservations
router.get('/', private.checkJWT, async(req, res) => {
    try {
        const reservations = await Reservation.find();
        const user = req.decoded;
             
        return res.render('dashboard', {reservations: reservations, user: user});
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;