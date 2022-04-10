const conn = require("../connection");
const jwt = require("jsonwebtoken");
const SECRET = require("../secret");

const list = async (req, res) => {
    const token = req.headers.authorization.replace("Bearer ", "");
   
    try {
        const { id } = jwt.verify(token, SECRET);
        const { rows } = await conn.query("Select * from transacoes where $1 = usuario_id",[id])
         
        res.status(200).json(rows);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const byId = async (req, res) => {
    const token = req.headers.authorization.replace("Bearer ", "");
    const {id: dealID}  = req.params ;

    try {
        const { id } = jwt.verify(token, SECRET);
        const { rows } = await conn.query("Select * from transacoes where id = $1 and $2 = usuario_id ",[dealID,id])
         
        res.status(200).json(rows);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

module.exports = {
    list,
    byId
}