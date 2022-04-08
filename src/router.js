const express = require('express');
const { signIn, signUp, profile } = require('./controllers/user');
const validacao = require("./middlewares/validacao")
const router = express()
router.use( express.json() )


router.get("/usuario", profile);
router.post("/usuario", validacao.userEmailSenha,signUp);

router.post("/login", validacao.userEmailSenha, signIn);
        
module.exports = router;