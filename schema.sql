DROP DATABASE IF EXISTS dindin;
CREATE DATABASE dindin;

DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios(
	id serial primary key,
	nome varchar(50) not null,
	email varchar(50) not null unique,
	senha text not null
);

DROP TABLE IF EXISTS categorias;
CREATE TABLE categorias(
 	id serial primary key,
	descricao text not null unique
)

DROP TABLE IF EXISTS transacoes;
CREATE TABLE transacoes(
	id serial primary key,
	descricao text not null,
    valor int not null,
	data TIMESTAMP not null,
	categoria_id int not null,
	usuario_id int not null,
	tipo varchar(7) not null,
    CONSTRAINT transacoes_categorias_id_fk FOREIGN KEY( categoria_id ) REFERENCES categorias(id),
    CONSTRAINT produtos_usuario_id_fk FOREIGN KEY( usuario_id ) REFERENCES usuarios(id)
)