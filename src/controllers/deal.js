const conn = require("../connection");
const jwt = require("jsonwebtoken");
const SECRET = require("../secret");
const { rows } = require("pg/lib/defaults");

const list = async (req, res) => {
    const token = req.headers.authorization.replace("Bearer ", "");
   
    try {
        const { id } = jwt.verify(token, SECRET);
        const { rows } = await conn.query(`select transacoes.*, 
            categorias.descricao as categoria_nome 
            from transacoes,categorias 
            where transacoes.categoria_id = categorias.id and $1 = usuario_id`
,[id])
        
        const data = req.query.filtro ? filter(rows, req.query.filtro) : rows;

        console.log( data );
        res.status(200).json(data);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const filter = (deals, filtros) => {
    const dataFilter = deals.filter((deal)=>{
        return  filtros.includes( deal.categoria_nome );
    })

    return dataFilter;
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
        
        const resInsert = await conn.query("insert into transacoes(descricao,valor,data,categoria_id,tipo,usuario_id) values($1,$2,$3,$4,$5,$6)",[descricao,valor,data,categoria_id,tipo,id])
        
        if(resInsert.rowCount === 0)
            return res.status(400).json( {message: "Erro> transação nao adicionada"} );
        console.log( resInsert );
        const queryTake = `select transacoes.*, 
                                categorias.descricao as categoria_nome 
                                from transacoes,categorias 
                                where transacoes.categoria_id = categorias.id and $1 = usuario_id and transacoes.data = $2`

        const { rows: dealResponse } = await conn.query(queryTake,[id,data]);
        
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

const del = async (req, res) =>{
    const token = req.headers.authorization.replace("Bearer ", "");
    const { id: dealID } = req.params;

    try {
        const { id } = jwt.verify(token, SECRET);
        const { rowCount } = await conn.query(`delete from transacoes where $1 = id and $2 = usuario_id`, 
                                                    [dealID,id]);

        if (rowCount == 0)
            return res.status(400).json({ message: "transaçao nao encontrado" });

        res.status(204).json();
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const extract = async (req, res) =>{
    const token = req.headers.authorization.replace("Bearer ", "");

    try {
        const { id } = jwt.verify(token, SECRET);
        const {rows: deals, rowCount } = await conn.query(`select valor,tipo from transacoes where $1 = usuario_id`, 
                                                    [id]);

        if (rowCount == 0)
            return res.status(400).json({ message: "transaçao nao encontrado" });

        const extractDeals = deals.reduce( (extract, currentDeal)=>{
                if( currentDeal.tipo == "entrada" )
                    extract.entrada += currentDeal.valor;
                else
                    extract.saida += currentDeal.valor;

                return extract;
        }, {entrada: 0, saida: 0} );

        console.log( extractDeals )

        res.status(201).json(extractDeals);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

module.exports = {
    list,
    byId,
    signUP,
    update,
    del,
    extract
}