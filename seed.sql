DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;
CREATE TABLE departments(
  id INT AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);
CREATE TABLE roles(
  id INT AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);
CREATE TABLE employees(
  id INT AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);
INSERT INTO
  departments (name)
VALUES
  ("Sales"),
  ("Engineering"),
  ("Finance");
INSERT INTO
  roles (title, salary, department_id)
VALUES
  (
    "Sales Lead",
    85000,
    (
      SELECT
        id
      FROM
        departments
      WHERE
        name = "Sales"
    )
  );
INSERT INTO
  roles (title, salary, department_id)
VALUES
  (
    "Sales Assistant",
    75000,
    (
      SELECT
        id
      FROM
        departments
      WHERE
        name = "Sales"
    )
  );
INSERT INTO
  roles (title, salary, department_id)
VALUES
  (
    "Lead Engineer",
    95000,
    (
      SELECT
        id
      FROM
        departments
      WHERE
        name = "Engineering"
    )
  );
INSERT INTO
  roles (title, salary, department_id)
VALUES
  (
    "Accountant",
    85000,
    (
      SELECT
        id
      FROM
        departments
      WHERE
        name = "Finance"
    )
  );
INSERT INTO
  employees (first_name, last_name, role_id, manager_id)
VALUES
  (
    "James",
    "Bond",
    (
      SELECT
        id
      FROM
        roles
      WHERE
        title = "Sales Lead"
        AND department_id = (
          SELECT
            id
          FROM
            departments
          WHERE
            name = "Sales"
        )
    ),
    NULL
  );
INSERT INTO
  employees (first_name, last_name, role_id, manager_id)
VALUES
  (
    "Sarah",
    "Thomas",
    (
      SELECT
        id
      FROM
        roles
      WHERE
        title = "Sales Assistant"
        AND department_id = (
          SELECT
            id
          FROM
            departments
          WHERE
            name = "Sales"
        )
    ),
    (
      SELECT
        id
      FROM
        (
          SELECT
            *
          FROM
            employees
        ) AS employees
      WHERE
        first_name = "James"
        AND last_name = "Bond"
    )
  );
INSERT INTO
  employees (first_name, last_name, role_id, manager_id)
VALUES
  ("Tony", "Martin", 3, 1),
  ("Martha", "Daniels", 4, 3),
  ("Craig", "Johnson", 4, 3);
INSERT INTO
  departments (name)
VALUES
  ("Legal");
INSERT INTO
  roles (title, salary, department_id)
VALUES
  ("Lawyer", 95000, 4);