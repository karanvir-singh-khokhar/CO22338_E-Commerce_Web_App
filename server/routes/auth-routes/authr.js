const express = require('express');
const { Registeruser, Loginuser, Logoutuser, checkAuth } = require('../../controllers/auth-controller/auth-controller');

const router = express.Router();

router.post('/register', Registeruser);  
router.post('/login', Loginuser);  
router.post('/logout', Logoutuser);  
router.get('/check-auth', checkAuth);  

module.exports = router;
