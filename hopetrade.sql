DROP DATABASE IF EXISTS hopetrade;
CREATE DATABASE hopetrade;
USE hopetrade;



DROP TABLE IF EXISTS hopetrade.categoria;

CREATE TABLE hopetrade.categoria (
	id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT categoria_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;



DROP TABLE iF EXISTS hopetrade.filial;

CREATE TABLE hopetrade.filial (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL,
    direccion VARCHAR(20) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT filial_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;


INSERT INTO hopetrade.filial VALUES 
(DEFAULT, "Caritas Esperanza", "6 y 55", DEFAULT), (DEFAULT, "Caritas Las Quintas", "12 y 43", DEFAULT),
(DEFAULT, "Caritas LP", "116 y 66", DEFAULT), (DEFAULT, "Caritas Solidaridad", "26 y 47", DEFAULT),
(DEFAULT, "Caritas Tolosa", "4 y 526", DEFAULT);



DROP TABLE IF EXISTS hopetrade.usuario;

CREATE TABLE hopetrade.usuario (
	id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	dni VARCHAR(10) NOT NULL,
	nombre VARCHAR(50) NOT NULL,
	apellido VARCHAR(50) NOT NULL,
	mail VARCHAR(50) NOT NULL,
	password TEXT NOT NULL,
	telefono VARCHAR(15) NOT NULL,
	fecha_nacimiento DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL DEFAULT NULL,
	UNIQUE (dni),
    CONSTRAINT usuario_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;


INSERT INTO hopetrade.usuario VALUES 
(default, "2013", "walter", "white", "breaking@bad.com", "$2a$10$kHftH0B3y.riYT28g66ZP.vdrN9/EA1eT6KVuohI9JuAxHj1mE1RK", "12345", "2006-05-15", DEFAULT, NULL);



DROP TABLE IF EXISTS hopetrade.voluntario;

CREATE TABLE hopetrade.voluntario (
	id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL,
	apellido VARCHAR(50) NOT NULL,
	mail VARCHAR(50) NOT NULL,
	password TEXT NOT NULL,
	filial_id INT(10) UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL DEFAULT NULL,
	UNIQUE (mail),
    CONSTRAINT voluntario_PK PRIMARY KEY (id),
	CONSTRAINT voluntario_FK FOREIGN KEY (filial_id) REFERENCES hopetrade.filial(id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;


INSERT INTO hopetrade.voluntario VALUES 
(default, "jorge", "curioso", "george@curious.com", "$2a$10$kHftH0B3y.riYT28g66ZP.vdrN9/EA1eT6KVuohI9JuAxHj1mE1RK", 1, DEFAULT, NULL);



DROP TABLE IF EXISTS hopetrade.representante;

CREATE TABLE hopetrade.representante (
	id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL,
	apellido VARCHAR(50) NOT NULL,
	mail VARCHAR(50) NOT NULL,
	password TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL DEFAULT NULL,
	UNIQUE (mail),
    CONSTRAINT representante_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;


INSERT INTO hopetrade.representante VALUES 
(default, "macri", "miau", "macri@gato.com", "$2a$10$kHftH0B3y.riYT28g66ZP.vdrN9/EA1eT6KVuohI9JuAxHj1mE1RK", DEFAULT, NULL);



DROP TABLE IF EXISTS hopetrade.publicacion;

CREATE TABLE hopetrade.publicacion (
	id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL,
	descripcion TEXT NOT NULL,
    url_foto VARCHAR(200) NOT NULL,
    categoria_id INT(10) UNSIGNED NOT NULL,
    usuario_id INT(10) UNSIGNED NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL DEFAULT NULL,
	deleted_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT publicacion_PK PRIMARY KEY (id),
	CONSTRAINT publicacion_FK FOREIGN KEY (categoria_id) REFERENCES hopetrade.categoria(id),
    CONSTRAINT publicacion_FK_1 FOREIGN KEY (usuario_id) REFERENCES hopetrade.usuario(id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;