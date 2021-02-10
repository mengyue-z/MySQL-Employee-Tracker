
DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;


CREATE TABLE departments (
  
  id INTEGER(30) AUTO_INCREMENT NOT NULL,

  department VARCHAR(30) NOT NULL,
  
  PRIMARY KEY (id)
);

CREATE TABLE roles (
  
  id INTEGER(30) AUTO_INCREMENT NOT NULL,

  title VARCHAR(30) NOT NULL,

  salary DECIMAL,
  
  department_id INTEGER(30) NOT NULL,
  
  PRIMARY KEY (id)
);

CREATE TABLE employees (
  
  id INTEGER(30) AUTO_INCREMENT NOT NULL,

  first_name VARCHAR(30) NOT NULL,
  
  last_name VARCHAR(30) NOT NULL,

  role_id INTEGER(30) NOT NULL,

  manager_id INTEGER(30),

  PRIMARY KEY (id)
);


INSERT INTO departments (department)
VALUES ("Sales");

INSERT INTO departments (department)
VALUES ("Marketing");


INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Manager", 80000, 1);

INSERT INTO roles (title, salary, department_id)
VALUES ("Marketing Manager", 90000, 2);

INSERT INTO roles (title, salary, department_id)
VALUES ("Marketing Assistant", 50000, 2);


INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Candice", "Zhang",2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 3, 2);


