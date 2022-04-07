const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dindin',
  password: 'alison02',
  port: 5432,
});

function query(MSG,args=[]){
    return pool.query(MSG, args);
  }

module.exports = {
    query
} 