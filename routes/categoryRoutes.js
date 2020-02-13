const express = require('express');
const router = express.Router();

const { create } = require('../controllers/categoryController');

router.post('/category/create', create);

module.exports = router;
