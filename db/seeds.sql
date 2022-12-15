USE employee_tracker_db;
INSERT INTO department (name)
VALUES ("Customer Service"),
    ("Engineering"),
    ("Sales"),
    ("Human Resources");

INSERT INTO role (title, salary, department_id)
VALUES ("Customer Service Manager", 100000, 1),
    ("Customer Service Associate", 60000, 1),
    ("Engineering Manager", 100000, 2),
    ("Engineering Associate", 80000, 2),
    ("Sales Manager", 100000, 3),
    ("Sales Associate", 80000, 3),
    ("Human Resources Manager", 100000, 4),
    ("Human Resources Associate", 60000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Steve", "Rogers", 1, NULL),
    ("Bucky", "Barnes", 2, 1),
    ("Tony", "Stark", 3, NULL),
    ("Peter", "Parker", 4, 3),
    ("Natasha", "Romanoff", 5, NULL),
    ("Yelena", "Belova", 6, 5),
    ("Clint", "Barton", 7, NULL),
    ("Kate", "Bishop", 8, 7);