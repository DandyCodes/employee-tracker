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
  ("sales"),
  ("engineering"),
  ("finance");
INSERT INTO
  roles (title, salary, department_id)
VALUES
  (
    "sales lead",
    60.7,
    (
      SELECT
        id
      FROM
        departments
      WHERE
        name = "sales"
    )
  );
INSERT INTO
  roles (title, salary, department_id)
VALUES
  (
    "sales assistant",
    62.1,
    (
      SELECT
        id
      FROM
        departments
      WHERE
        name = "sales"
    )
  );
INSERT INTO
  roles (title, salary, department_id)
VALUES
  (
    "lead engineer",
    65.5,
    (
      SELECT
        id
      FROM
        departments
      WHERE
        name = "engineering"
    )
  );
INSERT INTO
  roles (title, salary, department_id)
VALUES
  (
    "accountant",
    65.5,
    (
      SELECT
        id
      FROM
        departments
      WHERE
        name = "finance"
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
        title = "sales lead"
        AND department_id = (
          SELECT
            id
          FROM
            departments
          WHERE
            name = "sales"
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
        title = "sales assistant"
        AND department_id = (
          SELECT
            id
          FROM
            departments
          WHERE
            name = "sales"
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
  ("Tony", "Martin", 3, NULL),
  ("Martha", "Daniels", 4, 3);