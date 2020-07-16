USE employee_trackerDB;

INSERT INTO departments (name) 
VALUES ("Graphics"),
("Advertising"),
("HR"),
("Outreach"),
("Sales");

INSERT INTO role (title, salary, department_id) 
VALUES ("CEO", 10000000, 7),
("Intern", 10000, 1920),
("Engineer", 75000, 32),
("Designer", 65000, 78 ),
("Specialist", 90000, 34);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Tia", "Petersen", 19, 2),
("Alex", "Crozier", 77, 2),
("Paul", "Flanagan", 44, 3),
("Brian", "Hart", 98, 4),
("Bri", "Rose", 34, 3);

