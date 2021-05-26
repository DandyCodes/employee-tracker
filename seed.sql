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
  ("kitchen"),
  ("bathroom");
INSERT INTO
  roles (title, salary, department_id)
VALUES
  (
    "sales",
    60.7,
    (
      SELECT
        id
      FROM
        departments
      WHERE
        name = "kitchen"
    )
  );
INSERT INTO
  roles (title, salary, department_id)
VALUES
  (
    "warehouse",
    62.1,
    (
      SELECT
        id
      FROM
        departments
      WHERE
        name = "kitchen"
    )
  );
INSERT INTO
  roles (title, salary, department_id)
VALUES
  (
    "sales",
    64.2,
    (
      SELECT
        id
      FROM
        departments
      WHERE
        name = "bathroom"
    )
  );
INSERT INTO
  roles (title, salary, department_id)
VALUES
  (
    "warehouse",
    65.5,
    (
      SELECT
        id
      FROM
        departments
      WHERE
        name = "bathroom"
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
        title = "sales"
        AND department_id = (
          SELECT
            id
          FROM
            departments
          WHERE
            name = "bathroom"
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
        title = "warehouse"
        AND department_id = (
          SELECT
            id
          FROM
            departments
          WHERE
            name = "kitchen"
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