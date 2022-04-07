const express = require('express');
const conexao = require('./conexao');
const router = require('./router');

const port = 3000
const app = express()

app.use( router )

app.listen(port,async ()=>{    
    console.log("running port " + port);
})