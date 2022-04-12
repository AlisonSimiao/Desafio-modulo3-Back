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

const signUP = async (req, res) => {
    const token = req.headers.authorization.replace("Bearer ", "");
    const { descricao,
            valor,
            data,
            categoria_id,
            tipo} = req.body;

    try {
        const { id } = jwt.verify(token, SECRET);
        
        const { rowCount
        } = await conn.query("insert into transacoes(descricao,valor,data,categoria_id,tipo,usuario_id) values($1,$2,$3,$4,$5,$6)",[descricao,valor,data,categoria_id,tipo,id])
        
        if(rowCount === 0)
            return res.status(400).json( {message: "Erro> transação nao adicionada"} );

        const queryTake = `select transacoes.id,
                                transacoes.tipo,
                                transacoes.descricao,
                                transacoes.valor,
                                transacoes.data,
                                transacoes.usuario_id,
                                transacoes.categoria_id, 
                                categorias.descricao as categoria_nome 
                                from transacoes,categorias 
                                where transacoes.categoria_id = categorias.id`

        const { rows: dealResponse } = await conn.query(queryTake);
        
        res.status(200).json(dealResponse);
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
        const {rowCount, rows } = await conn.query("Select * from transacoes where id = $1 and $2 = usuario_id ",[dealID,id]);

        if(!rowCount)
            return res.status(404).json({
                message: "Transação não encontrada."
            })

        res.status(200).json(rows);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const update = async (req, res) =>{
    const token = req.headers.authorization.replace("Bearer ", "");
    const { id: dealID } = req.params;
    const { descricao,
        valor,
        data,
        categoria_id,
        tipo } = req.body;

    try {
        const { id } = jwt.verify(token, SECRET);
        const { rowCount } = await conn.query(`UPDATE transacoes 
                                                    SET descricao = $1, valor = $2, data = $3, categoria_id = $4,tipo = $5, usuario_id = $6  
                                                    WHERE id = $7 and usuario_id = $6`, 
                                                    [descricao,valor,data,categoria_id,tipo,id,dealID])

        if (rowCount == 0)
            return res.status(400).json({ message: "transaçao nao encontrado" });

        res.status(204).json();
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

module.exports = {
    list,
    byId,
    signUP,
    update
}