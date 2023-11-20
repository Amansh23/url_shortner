// routes/index.js
const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');


router.post('/api/shorten', (req, res) => {
  console.log('Received POST request for /api/shorten');
  urlController.shortenUrl(req, res);
});

router.get('/:shortUrl', (req, res) => {
  console.log('Received GET request for /:shortUrl');
  urlController.redirectUrl(req, res);
});

router.get('/', (req, res) => {
  // You can render a form here to take input from the user
  res.render('index');
});


module.exports = router;
