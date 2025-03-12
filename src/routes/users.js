const express = require('express');
const router = express.Router();

const serviceUsers = require('../services/users')

/* en commentaire en attendant de compléter les fichiers du dossier service
router.get('/', serviceUsers.getById);
router.get('/:email', serviceUsers.getByEmail);
router.post('/', serviceUsers.add);
router.put('/:email', serviceUsers.update);
router.delete('/:email', serviceUsers.delete);
*/

/* importé avec express-generator. On garde en commentaire au cas où. 
GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/

router.post('/authenticate', serviceUsers.authenticate);

module.exports = router;