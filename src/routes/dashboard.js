const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation');
const User = require('../models/user');
const private = require('../middlewares/private');

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