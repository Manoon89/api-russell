const express = require('express');
const router = express.Router();

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
router.get('/', async (req, res) => {
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

module.exports = router;
