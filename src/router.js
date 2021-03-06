const express   = require('express');
const user      = require('./controllers/user');
const category  = require('./controllers/category');
const deal      = require('./controllers/deal');
const validacao = require("./middlewares/validacao")
const router    = express()


router.use( express.json() )

//Route user
router.get("/usuario", user.profile);
router.post("/usuario", validacao.userNome,validacao.userEmailSenha,user.signUp);
router.put("/usuario", validacao.userNome,validacao.userEmailSenha,user.update);
router.post("/login", validacao.userEmailSenha, user.signIn);    

//Route category
router.get("/categoria", category.list);

//Route transicion
router.get("/transacao", deal.list);
router.get("/transacao/extrato", deal.extract);
router.get("/transacao/:id",deal.byId);
router.post("/transacao",validacao.dealEnter,deal.signUP);
router.put("/transacao/:id",validacao.dealEnter,deal.update);
router.delete("/transacao/:id",deal.del);


module.exports = router;