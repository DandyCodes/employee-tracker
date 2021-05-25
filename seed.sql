DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;
CREATE TABLE department(
  id INT AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);
CREATE TABLE role(
  id INT AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);
CREATE TABLE employee(
  id INT AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);
INSERT INTO
  department (name)
VALUES
  ("kitchen"),
  ("bathroom");
INSERT INTO
  role (title, salary, department_id)
VALUES
  (
    "sales",
    60.7,
    (
      SELECT
        id
      FROM
        department
      WHERE
        name = "kitchen"
    )
  );
INSERT INTO
  role (title, salary, department_id)
VALUES
  (
    "warehouse",
    62.1,
    (
      SELECT
        id
      FROM
        department
      WHERE
        name = "kitchen"
    )
  );
INSERT INTO
  role (title, salary, department_id)
VALUES
  (
    "sales",
    64.2,
    (
      SELECT
        id
      FROM
        department
      WHERE
        name = "bathroom"
    )
  );
INSERT INTO
  role (title, salary, department_id)
VALUES
  (
    "warehouse",
    65.5,
    (
      SELECT
        id
      FROM
        department
      WHERE
        name = "bathroom"
    )
  );
INSERT INTO
  employee (first_name, last_name, role_id, manager_id)
VALUES
  (
    "James",
    "Bond",
    (
      SELECT
        id
      FROM
        role
      WHERE
        title = "sales"
        AND department_id = (
          SELECT
            id
          FROM
            department
          WHERE
            name = "bathroom"
        )
    ),
    NULL
  );
INSERT INTO
  employee (first_name, last_name, role_id, manager_id)
VALUES
  (
    "Sarah",
    "Thomas",
    (
      SELECT
        id
      FROM
        role
      WHERE
        title = "warehouse"
        AND department_id = (
          SELECT
            id
          FROM
            department
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
            employee
        ) AS employee
      WHERE
        first_name = "James"
        AND last_name = "Bond"
    )
  );