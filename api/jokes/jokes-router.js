// do not make changes to this file
const router = require('express').Router();
const { validateSession } = require('../middleware/auth-middleware');
const jokes = require('./jokes-data');

router.get('/', validateSession,(req, res) => {
  res.status(200).json(jokes);
});

module.exports = router;
