const express = require('express');
const router = express.Router();
const User = require('../models/user');
const private = require('../middlewares/private');

const serviceUsers = require('../services/users')

router.get('/manage', private.checkJWT, async (req, res) => {

    try {
        const users = await User.find();
        
        return res.render('users', {users: users});
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/add', private.checkJWT, (req, res) => {
  res.render('addUser');
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