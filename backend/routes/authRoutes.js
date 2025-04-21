const express = require('express');
const {protect} = require('../middleware/authMiddleware');

const {
    registerUser,
    loginUser,
    getUserInfo
} = require('../controllers/authControllers');

const router = express.Router();

router.post('/register' , registerUser);
router.post('/login' , loginUser);
router.get('/user' , protect , getUserInfo);

module.exports = router;