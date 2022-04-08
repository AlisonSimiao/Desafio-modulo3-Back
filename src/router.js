const express = require('express');
const user = require('./controllers/user');
const validacao = require("./middlewares/validacao")
const router = express()
router.use( express.json() )


router.get("/usuario", user.profile);
router.post("/usuario", validacao.userNome,validacao.userEmailSenha,user.signUp);
router.put("/usuario", validacao.userNome,validacao.userEmailSenha,user.update);
router.post("/login", validacao.userEmailSenha, user.signIn);
        
module.exports = router;