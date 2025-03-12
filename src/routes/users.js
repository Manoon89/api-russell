const express = require('express');
const router = express.Router();

const service = require('../services/users')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/authenticate', service.authenticate);

module.exports = router;