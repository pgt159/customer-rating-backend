const express = require('express');
const { signUp, login, getMe } = require('../controller/userController');

const router = express.Router();

router.post('/signUp', signUp);
router.post('/login', login);
router.get('/me', getMe);
module.exports = router;
