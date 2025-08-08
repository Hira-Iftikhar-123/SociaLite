const express = require('express');
const router = express.Router();
const { generateCaption } = require('../controllers/aiController');

router.post('/caption', generateCaption);

module.exports = router;