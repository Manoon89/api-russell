const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation');

router.get('/', async(req, res) => {
    try {
        const reservations = await Reservation.find();
        return res.render('dashboard', {reservations: reservations});
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;