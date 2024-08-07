DROP DATABASE IF EXISTS hopetrade;
CREATE DATABASE hopetrade;
USE hopetrade;



DROP TABLE IF EXISTS hopetrade.categoria;

CREATE TABLE hopetrade.categoria (
	id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT categoria_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;


INSERT INTO hopetrade.categoria (nombre) VALUES
("Instrumentos musicales"),
("Electrónica y Tecnología"),
("Electrodomésticos"),
("Muebles y Decoración"),
("Ropa y Accesorios"),
("Juguetes y Juegos"),
("Libros, Música y Películas"),
("Deportes"),
("Automóviles y Accesorios"),
("Hogar y Jardín"),
("Salud y Belleza"),
("Infantil y Bebé"),
("Arte y Artesanías");



DROP TABLE iF EXISTS hopetrade.filial;

CREATE TABLE hopetrade.filial (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL,
    direccion VARCHAR(20) NOT NULL,
	hora_apertura TIME NOT NULL,
	hora_cierre TIME NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT filial_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;


INSERT INTO hopetrade.filial (nombre, direccion, hora_apertura, hora_cierre) VALUES 
("Caritas Esperanza", "6 y 55", "08:00:00", "20:00:00"),
("Caritas Las Quintas", "12 y 43", "10:00:00", "19:30:00"),
("Caritas LP", "116 y 66", "09:00:00", "19:00:00"),
("Caritas Solidaridad", "26 y 47", "12:00:00", "18:30:00"),
("Caritas Tolosa", "4 y 526", "08:30:00", "20:00:00");



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


INSERT INTO hopetrade.usuario (dni, nombre, apellido, mail, password, telefono, fecha_nacimiento) VALUES 
("1111", "Martin", "Vazquez", "martinvazquez1104@gmail.com", "$2a$10$kHftH0B3y.riYT28g66ZP.vdrN9/EA1eT6KVuohI9JuAxHj1mE1RK", "12345", "2006-05-15"),
("2222", "Nicolas", "Caporal", "nicolascaporal.unlp@gmail.com", "$2a$10$kHftH0B3y.riYT28g66ZP.vdrN9/EA1eT6KVuohI9JuAxHj1mE1RK", "12345", "2006-05-15"),
("3333", "Bautista", "Bordes", "bautistabordes5@gmail.com", "$2a$10$kHftH0B3y.riYT28g66ZP.vdrN9/EA1eT6KVuohI9JuAxHj1mE1RK", "12345", "2000-01-11");


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


INSERT INTO hopetrade.voluntario (nombre, apellido, mail, password, filial_id)  VALUES 
("jorge", "perez", "george@perez.com", "$2a$10$kHftH0B3y.riYT28g66ZP.vdrN9/EA1eT6KVuohI9JuAxHj1mE1RK", 1);



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


INSERT INTO hopetrade.representante (nombre, apellido, mail, password)  VALUES 
("Mario", "Caritas", "mario@caritas.com", "$2a$10$kHftH0B3y.riYT28g66ZP.vdrN9/EA1eT6KVuohI9JuAxHj1mE1RK");



DROP TABLE IF EXISTS hopetrade.publicacion;

CREATE TABLE hopetrade.publicacion (
	id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL,
	descripcion TEXT NOT NULL,
    url_foto TEXT NOT NULL,
	estado TEXT NOT NULL,
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

INSERT INTO hopetrade.publicacion (nombre, descripcion, url_foto, estado, categoria_id, usuario_id)  VALUES 
("Piano", "88 teclas, marca yamaha, modelo p45b, peso 11,5Kg, 2 años de uso", "publicacion_prueba_1.jpg", "disponible", 1, 3),
("Libro ingles", "Para 1er año", "publicacion_prueba_4.png", "disponible", 7, 3),  
("Teclado genius", "Como nuevo", "publicacion_prueba_2.png", "disponible", 3, 3),
("Mantel", "1 año de uso, sin manchas", "publicacion_prueba_3.png", "disponible", 4, 3);




DROP TABLE IF EXISTS hopetrade.oferta;

CREATE TABLE hopetrade.oferta (
	id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL,
	descripcion TEXT NOT NULL,
    url_foto TEXT NOT NULL,
	estado TEXT NOT NULL,

	publicacion_id INT(10) UNSIGNED NOT NULL,
	oferta_padre_id INT(10) UNSIGNED NULL,
	categoria_id INT(10) UNSIGNED NOT NULL,
    usuario_id INT(10) UNSIGNED NOT NULL,
	filial_id INT(10) UNSIGNED NOT NULL,

	fecha DATE NOT NULL,	
	hora TIME NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL DEFAULT NULL,
	deleted_at TIMESTAMP NULL DEFAULT NULL,
	
	CONSTRAINT oferta_PK PRIMARY KEY (id),
	CONSTRAINT oferta_FK FOREIGN KEY (publicacion_id) REFERENCES hopetrade.publicacion(id),
	CONSTRAINT oferta_FK_1 FOREIGN KEY (categoria_id) REFERENCES hopetrade.categoria(id),
    CONSTRAINT oferta_FK_2 FOREIGN KEY (usuario_id) REFERENCES hopetrade.usuario(id),
	CONSTRAINT oferta_FK_3 FOREIGN KEY (filial_id) REFERENCES hopetrade.filial(id),
	CONSTRAINT oferta_FK_4 FOREIGN KEY (oferta_padre_id) REFERENCES hopetrade.oferta(id)

)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;




DROP TABLE IF EXISTS hopetrade.intercambio;

CREATE TABLE hopetrade.intercambio (
	id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,

	publicacion_id INT(10) UNSIGNED NOT NULL,
	oferta_id INT(10) UNSIGNED NOT NULL,
	
	estado TEXT NOT NULL,

	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NULL DEFAULT NULL,
	
	CONSTRAINT intercambio_PK PRIMARY KEY (id),
	CONSTRAINT intercambio_FK FOREIGN KEY (publicacion_id) REFERENCES hopetrade.publicacion(id),
	CONSTRAINT intercambio_FK_1 FOREIGN KEY (oferta_id) REFERENCES hopetrade.oferta(id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS hopetrade.notificacion;

CREATE TABLE hopetrade.notificacion (
	id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,

	usuario_id INT(10) UNSIGNED NOT NULL,
	contenido TEXT NOT NULL,
	tipo TEXT NOT NULL,
	estado TEXT NOT NULL,

	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT notificaciones_PK PRIMARY KEY (id),
	CONSTRAINT notificaciones_FK_1 FOREIGN KEY (usuario_id) REFERENCES hopetrade.usuario(id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS hopetrade.tarjeta;

CREATE TABLE hopetrade.tarjeta (
	numero BIGINT NOT NULL UNIQUE,
	nombre TEXT NOT NULL,
	cdo_seguridad INT NOT NULL,
	vencimiento TEXT NOT NULL,
	credito INT NOT NULL,

	CONSTRAINT tarjeta_PK PRIMARY KEY (numero)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

INSERT INTO hopetrade.tarjeta (numero, nombre, cdo_seguridad, vencimiento, credito)
VALUES 
    (1234567890123456, 'Bautista Bordes', 123, '12/25', 5000),
    (9876543210987654, 'Nicolas Caporal', 456, '10/24', 8000);



DROP TABLE IF EXISTS hopetrade.donacion;

CREATE TABLE hopetrade.donacion (
	id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,

	nombre TEXT NOT NULL,
	apellido TEXT NOT NULL,
	telefono VARCHAR(15) NOT NULL,
	dni VARCHAR(10) NOT NULL,
	
	tipo TEXT NOT NULL,

	descripcion TEXT NOT NULL,


	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT donacion_PK PRIMARY KEY (id)
	
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS hopetrade.comentario;

CREATE TABLE hopetrade.comentario (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,

    comentario_padre_id INT(10) UNSIGNED NULL, -- si tiene algo es porque soy una respuesta, sino es xq soy un comentario
    usuario_id INT(10) UNSIGNED NOT NULL,
    publicacion_id INT(10) UNSIGNED NOT NULL,
    contenido TEXT NOT NULL,
    estado VARCHAR(10) NOT NULL, -- 2 estados: visible, borrado

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL,

    CONSTRAINT comentario_PK PRIMARY KEY (id),
    CONSTRAINT comentario_FK_1 FOREIGN KEY (usuario_id) REFERENCES hopetrade.usuario(id),
    CONSTRAINT comentario_FK_2 FOREIGN KEY (publicacion_id) REFERENCES hopetrade.publicacion(id),
    CONSTRAINT comentario_FK_3 FOREIGN KEY (comentario_padre_id) REFERENCES hopetrade.comentario(id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;