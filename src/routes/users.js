const express = require('express');
const router = express.Router();
const private = require('../middlewares/private');

const serviceUsers = require('../services/users')

router.get('/manage', /*private.checkJWT, */(req, res) => {
  res.render('users', { user: req.session?.user || null });
});

router.post('/', serviceUsers.add);
router.get('/:email', private.checkJWT, serviceUsers.getByEmail);
router.get('/', private.checkJWT, serviceUsers.getAll);
router.put('/:email', private.checkJWT, serviceUsers.update);
router.delete('/:email', private.checkJWT, serviceUsers.delete);

/* importé avec express-generator. On garde en commentaire au cas où. 
GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/

router.post('/authenticate', serviceUsers.authenticate);

module.exports = router;