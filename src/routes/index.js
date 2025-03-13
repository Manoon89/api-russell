const express = require('express');
const router = express.Router();

const userRoute = require('../routes/users');
const catwayRoute = require('../routes/catways');
const reservationRoute = require('../routes/reservations');

router.use('/users', userRoute);
router.use('/catways', catwayRoute);
router.use('/reservations', reservationRoute);

router.get('/', async (req, res) => {
/*  res.status(200).json({
    name: process.env.APP_NAME, 
    version: 1.0, 
    status: 200, 
    message: 'Bienvenue dans cette extraordinaire API'
  })
*/

    res.render('index', {
      title: 'Accueil'

  })
})


/* à garder peut-être pour les vues ? à voir. 
GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/

module.exports = router;
