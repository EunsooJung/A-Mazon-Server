const express = require('express');
const router = express.Router();

const { sendFromCtl } = require('../controllers/userController');

// second parameter is sendFromCtl from userController
router.get('/', sendFromCtl);

module.exports = router;
