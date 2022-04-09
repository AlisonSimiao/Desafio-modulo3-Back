const conn = require("./../connection");
const jwt = require("jsonwebtoken");
const SECRET = require("../secret");

const list = async (req, res) => {
    const token = req.headers.authorization.replace("Bearer ", "");
   
    try {
        const { id } = jwt.verify(token, SECRET);
        
        const { rows } = await conn.query("Select * from categorias")

        res.status(200).json(rows);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }

}

module.exports = {
    list
}