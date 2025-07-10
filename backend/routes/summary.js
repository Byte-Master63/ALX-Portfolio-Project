const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/summary');

router.get('/', getSummary);

module.exports = router;
