const conn  =  require("./../connection");
const bcrypt= require("bcrypt");
const jwt = require("jsonwebtoken")
const process = require('dotenv/config');
const SECRET = require("../secret");

const profile = async (req, res) =>{
    const token = req.headers.authorization.replace("Bearer ","");

    const {id} = jwt.verify(token, SECRET);

    const {rowCount, rows} = await conn.query("select id,email,nome from usuarios where $1 = id", [id])
    
    if (rowCount == 0)
        return res.status(400).json({ message: "usuario nao encontrado"});

    const usuario = rows[0];
   
    res.status(200).json(
            usuario
        )

    res.status(200).json({id});

}
const signIn = async (req, res) =>{
    const { email, senha } = req.body;
    console.log(process)
    try {
        const { rows, rowCount } = await conn.query("select * from usuarios where email = $1 ", [email])

        if (rowCount == 0)
            return res.status(400).json({ message: "usuario nao encontrado"});

        const usuario = rows[0];

        const senhaVerificada = await bcrypt.compare(senha, usuario.senha); // bcrypt compare
        if(! senhaVerificada)
            return res.status(400).json({ message: "Email ou senha não confere." });
        
        const token = jwt.sign({id: usuario.id},SECRET,{expiresIn: "1d"});// jwt sing {id: usu id}, "senhaparatokem",{ expiresIn: '1d'}
        const { senha: _, ...dadosUsuario } = usuario;

        return res.status(200).json({
            usuario: dadosUsuario,
            token,
        })
    }
    catch (error) {
        return res.status(200).json({ message: error.message });
    }
}

const signUp = async (req, res) => {
    const { nome, email, senha } = req.body;

   if (!nome)
        return res.status(400).json({
            message: "Campo nome invalido"
        })
    
    const {rowCount} = await conn.query("select email from usuarios where $1 = email",[email]);
    
    if(rowCount > 0)
    return res.status(400).json({
        message: "Email ja cadastrado no sistema"
    })

    const newPassword = await bcrypt.hash(senha, 10);
    const query = await conn.query("insert into usuarios(nome, email, senha) values ($1,$2,$3)",[nome,email,newPassword]);
    
    if( query.rowCount !== 1)
        return res.status(400).json({
            message: "Erro interno ao cadastrar usuario"
        })

    const {rows}  = await conn.query("select * from usuarios where $1 = email",[email]);
    const {senha: aux, ...userData} = rows[0];

    res.status(200).json(userData);
}

module.exports = {
    signIn,
    signUp,
    profile
}