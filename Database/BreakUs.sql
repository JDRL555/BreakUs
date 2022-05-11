CREATE DATABASE breakus_database;

CREATE TABLE IF NOT EXISTS reg_user(
    id_u INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name_u TEXT NOT NULL,
    lastName_u TEXT,
    user_u VARCHAR(10) NOT NULL,
    email_u VARCHAR(15) NOT NULL,
    psw_u VARCHAR(50) NOT NULL,
    access_level_user SET("Atleta", "Entrenador") DEFAULT "Atleta",
    pass_u ENUM("0", "1"),
    time_u DATETIME,
    PRIMARY KEY (id_u),
    CONSTRAINT UNIQUE (user_u),
    CONSTRAINT UNIQUE (email_u)
);

CREATE TABLE IF NOT EXISTS reg_trainer(
    id_t INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name_t TEXT NOT NULL,
    lastName_t TEXT,
    user_t VARCHAR(10) NOT NULL,
    email_t VARCHAR(15) NOT NULL,
    psw_t VARCHAR(50) NOT NULL,
    access_level_trainer SET("Atleta", "Entrenador") DEFAULT "Entrenador",
    pass_t ENUM("0", "1"),
    time_t DATETIME,
    PRIMARY KEY (id_t),
    CONSTRAINT UNIQUE (user_t),
    CONSTRAINT UNIQUE (email_t)
);

CREATE TABLE IF NOT EXISTS plan_choice(
    id_u INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_plan INT UNSIGNED NOT NULL,
    plan_type SET("NOVATO", "INTERMEDIO", "AVANZADO"),
    PRIMARY KEY(id_plan),
    FOREIGN KEY(id_u) REFERENCES reg_user(id_u)
);

CREATE TABLE IF NOT EXISTS routines_u(
    id_u INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_plan INT UNSIGNED NOT NULL,
    routines_completed INT,
    PRIMARY KEY (routines_completed),
    FOREIGN KEY(id_u) REFERENCES reg_user(id_u),
    FOREIGN KEY(id_plan) REFERENCES plan_choice(id_plan)
);

CREATE TABLE IF NOT EXISTS routines_novato(
    id_t INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_plan INT UNSIGNED NOT NULL,
    exercies1 TEXT,
    exercies2 TEXT,
    exercies3 TEXT,
    exercies4 TEXT,
    exercies5 TEXT,
    exercies6 TEXT,
    exercies7 TEXT,
    exercies8 TEXT,
    exercies9 TEXT,
    exercies10 TEXT,
    routines_done INT,
    PRIMARY KEY(routines_done),
    FOREIGN KEY(id_t) REFERENCES reg_trainer(id_t),
    FOREIGN KEY(id_plan) REFERENCES plan_choice(id_plan)
);

CREATE TABLE IF NOT EXISTS routines_intermedio(
    id_t INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_plan INT UNSIGNED NOT NULL,
    exercies1 TEXT,
    exercies2 TEXT,
    exercies3 TEXT,
    exercies4 TEXT,
    exercies5 TEXT,
    exercies6 TEXT,
    exercies7 TEXT,
    exercies8 TEXT,
    exercies9 TEXT,
    exercies10 TEXT,
    routines_done INT,
    PRIMARY KEY(routines_done),
    FOREIGN KEY(id_t) REFERENCES reg_trainer(id_t),
    FOREIGN KEY(id_plan) REFERENCES plan_choice(id_plan)
);

CREATE TABLE IF NOT EXISTS routines_avanzado(
    id_t INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_plan INT UNSIGNED NOT NULL,
    exercies1 TEXT,
    exercies2 TEXT,
    exercies3 TEXT,
    exercies4 TEXT,
    exercies5 TEXT,
    exercies6 TEXT,
    exercies7 TEXT,
    exercies8 TEXT,
    exercies9 TEXT,
    exercies10 TEXT,
    routines_done INT,
    PRIMARY KEY(routines_done),
    FOREIGN KEY(id_t) REFERENCES reg_trainer(id_t),
    FOREIGN KEY(id_plan) REFERENCES plan_choice(id_plan)
);


