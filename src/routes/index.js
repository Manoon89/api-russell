const express = require('express');
const router = express.Router();

const serviceIndex = require('../services/index')

const userRoute = require('../routes/users');
const catwayRoute = require('../routes/catways');
const reservationRoute = require('../routes/reservations');
const dashboardRoute = require('../routes/dashboard');
const authRoute = require('../routes/auth');

// On récupère les autres fichiers route existants
router.use('/users', userRoute);
router.use('/catways', catwayRoute);
router.use('/reservations', reservationRoute);
router.use('/dashboard', dashboardRoute);
router.use('/auth', authRoute);

// On renvoie sur la vue "index"
router.get('/', serviceIndex.goToIndex);

router.post('/login', serviceIndex.login);

module.exports = router;
