const express = require('express');
const user = require('./controllers/user');
const validacao = require("./middlewares/validacao")
const router = express()
router.use( express.json() )


router.get("/usuario", user.profile);
router.post("/usuario", validacao.userEmailSenha,user.signUp);
router.put("/usuario", user.update);
router.post("/login", validacao.userEmailSenha, user.signIn);
        
module.exports = router;