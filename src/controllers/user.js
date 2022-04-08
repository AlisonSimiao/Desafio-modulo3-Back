const conn = require("./../connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = require("../secret");

const update = async (req, res) => {
    const token = req.headers.authorization.replace("Bearer ", "");
    const {nome, email, senha } = req.body;

    try {
        const { id } = jwt.verify(token, SECRET);
        
        const newPassword = await bcrypt.hash(senha,10);
        const { rowCount } = await conn.query("UPDATE usuarios SET nome = $1, email = $2, senha = $3  WHERE id = $4;", [nome, email, newPassword, id])

        if (rowCount == 0)
            return res.status(400).json({ message: "usuario nao encontrado" });

        res.status(200).json();
    }
    catch (error) {
        return res.status(200).json({ message: error.message });
    }

}
const profile = async (req, res) => {
    const token = req.headers.authorization.replace("Bearer ", "");
    try {
        const { id } = jwt.verify(token, SECRET);

        const { rowCount, rows } = await conn.query("select id,email,nome from usuarios where $1 = id", [id])

        if (rowCount == 0)
            return res.status(400).json({ message: "usuario nao encontrado" });

        const usuario = rows[0];

        res.status(200).json(
            usuario
        )
    }
    catch (error) {
        return res.status(200).json({ message: error.message });
    }
}
const signIn = async (req, res) => {
    const { email, senha } = req.body;
    
    try {
        const { rows, rowCount } = await conn.query("select * from usuarios where email = $1 ", [email])

        if (rowCount == 0)
            return res.status(400).json({ message: "usuario nao encontrado" });

        const usuario = rows[0];

        const senhaVerificada = await bcrypt.compare(senha, usuario.senha); // bcrypt compare
        if (!senhaVerificada)
            return res.status(400).json({ message: "Email ou senha não confere." });

        const token = jwt.sign({ id: usuario.id }, SECRET, { expiresIn: "1d" });// jwt sing {id: usu id}, "senhaparatokem",{ expiresIn: '1d'}
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

    const { rowCount } = await conn.query("select email from usuarios where $1 = email", [email]);

    if (rowCount > 0)
        return res.status(400).json({
            message: "Email ja cadastrado no sistema"
        })

    const newPassword = await bcrypt.hash(senha, 10);
    const query = await conn.query("insert into usuarios(nome, email, senha) values ($1,$2,$3)", [nome, email, newPassword]);

    if (query.rowCount !== 1)
        return res.status(400).json({
            message: "Erro interno ao cadastrar usuario"
        })

    const { rows } = await conn.query("select * from usuarios where $1 = email", [email]);
    const { senha: aux, ...userData } = rows[0];

    res.status(200).json(userData);
}

module.exports = {
    signIn,
    signUp,
    profile,
    update
}