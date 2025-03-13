const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation');

router.get('/dashboard', async(req, res) => {
    try {
        const reservations = await Reservation.find();
        res.render('dashboard', {reservations: reservations});
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;