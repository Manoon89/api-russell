const express = require('express');
const router = express.Router();

const userRoute = require('../routes/users');
const catwayRoute = require('../routes/catways');
const reservationRoute = require('../routes/reservations');
const dashboardRoute = require('../routes/dashboard');
const authRoute = require('../routes/auth');

router.use('/users', userRoute);
router.use('/catways', catwayRoute);
router.use('/reservations', reservationRoute);
router.use('/dashboard', dashboardRoute);
router.use('/auth', authRoute);

router.get('/', async (req, res) => {
/*  res.status(200).json({
    name: process.env.APP_NAME, 
    version: 1.0, 
    status: 200, 
    message: 'Bienvenue dans cette extraordinaire API'
  })
*/

    res.render('index')
})

router.post('/login', async(req, res) => {
  const {email, password} = req.body; 
  const user = await User.findOne({ email, password });

  if (user) {
    res.render('dashboard', {username: user.username})
  }
  else {
    res.redirect('/', { error: 'Email ou mot de passe incorrect' });
  }

})

/* à garder peut-être pour les vues ? à voir. 
GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/

module.exports = router;
