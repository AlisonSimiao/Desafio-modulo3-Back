const jwt = require("jsonwebtoken");
const SECRET = require("../secret");

const userEmailSenha = (req, res, next) => {
    const { email, senha } = req.body;
    if (!email)
        return res.status(400).json({ message: "Email é obrigatorio" });

    if (!senha)
        return res.status(400).json({ message: " senha é Obrigatorios" });

    next();
}

const userNome = (req, res, next) => {
    const { nome } = req.body;

    if (!nome)
        return res.status(400).json({
            message: "Campo nome invalido"
        })

    next();
}

const dealEnter = (req, res, next) => {
    const { descricao,
        valor,
        data,
        categoria_id,
        tipo } = req.body;

    if (!descricao)
        return res.status(400).json({ message: "descriçao é obrigatorio" });
    if (!valor)
        return res.status(400).json({ message: "valor é obrigatorio" });
    if (!data)
        return res.status(400).json({ message: "data é obrigatorio" });
    if (!categoria_id)
        return res.status(400).json({ message: "categoria_id é obrigatorio" });
    if (!tipo)
        return res.status(400).json({ message: "tipo é obrigatorio" });

    next();
}

module.exports = {
    userEmailSenha,
    userNome,
    dealEnter
}