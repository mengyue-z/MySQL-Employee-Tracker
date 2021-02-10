
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


