const express = require("express");
const router = express.Router();
const axios = require('axios');
const { loginFun, codigoVerificacion, registroUsuario, loginFunGoogle } = require('../controllers/metodos')

router.post('/login', loginFun);
router.post('/verificar-codigo',codigoVerificacion);
router.post('/register', registroUsuario)
module.exports = router;