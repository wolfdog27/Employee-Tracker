var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "password",
    database: "employee_trackerDB"
});

connection.connect(function (err) {
    if (err) throw err;
    runSearch();
});

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Departments?",
                "View Roles",
                "View Employees",
                "Add Departments?",
                "Add Roles",
                "Add Employees",
                "Update Employee Roles",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Departments?":
                    viewDepartments();
                    break;

                case "View Roles":
                    viewRoles();
                    break;

                case "View Employees":
                    viewEmployees();
                    break;

                case "Add Departments?":
                    addDepartments();
                    break;

                case "Add Roles":
                    addRoles();
                    break;

                case "Add Employees":
                    addEmployees();
                    break;

                case "Update Employee Roles":
                    updateEmployeeRoles();
                    break;

                case "Exit":
                    connection.end();
                    console.log("Thank You For Using Employee Tracker!");
                    break;
            }
        });
}

function viewDepartments() {
    console.log("View all departments...\n");
    connection.query("SELECT * FROM departments", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        runSearch();
    });
}

function viewRoles() {
    console.log("View all roles...\n");
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        runSearch();
    });
}

function viewEmployees() {
    console.log("View all employees...\n");
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        runSearch();
    });
}

function addDepartments() {
    console.log("Inserting a new department...\n");
    inquirer.prompt([{
        type: "input",
        name: "newDep",
        message: "What would you like to name this department"
    }]).then(function (answer) {
        connection.query(
            "INSERT INTO departments SET ?",
            {
                name: answer.newDep
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " department inserted!\n");
                // Call updateProduct AFTER the INSERT completes
                runSearch();
            }
        );

    })

}
function addRoles() {

    connection.query("SELECT * FROM departments", function (error, result) {
        let myDeps = result.map(function (dep) {
            return {
                name: dep.name,
                value: dep.id
            }
        })
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "What is the title of this role?"
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of this role?"
            },
            {
                type: "list",
                name: "depId",
                message: "What is the department Id of this role?",
                choices: myDeps
            },
        ]).then(function (answer) {
            console.log("Inserting a new role...\n");
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.depId
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " department inserted!\n");
                    // Call updateProduct AFTER the INSERT completes
                    runSearch();
                }
            );

        })
    })



}
function addEmployees() {
    let myRole;
    let myEmployee;

    connection.query("SELECT * FROM role", function (error, result) {
        if (error) throw error
        myRole = result.map(function (role) {
            return {
                name: role.title,
                value: role.id
            }
        });
        connection.query("SELECT * FROM employee", function (e, r) {
            if (e) throw e
            myEmployee = r.map(function (employee) {
                return {
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }
            })

            myEmployee.unshift({
                name: "None",
                value: ""
            })

            inquirer.prompt([
                {
                    type: "input",
                    name: "first",
                    message: "What is the first name of the employee?"
                },
                {
                    type: "input",
                    name: "last",
                    message: "What is the last name of the employee?"
                },
                {
                    type: "list",
                    name: "roleId",
                    message: "What is the role of the employee?",
                    choices: myRole
                },
                {
                    type: "list",
                    name: "empId",
                    message: "Who is the manager?",
                    choices: myEmployee
                },

            ]).then(function (answer) {
                console.log("Inserting a new role...\n");
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answer.first,
                        last_name: answer.last,
                        role_id: answer.roleId,
                        manager_id: answer.empId,
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " department inserted!\n");
                        // Call updateProduct AFTER the INSERT completes
                        runSearch();
                    }
                );

            })
        })
    })
}

function updateEmployeeRoles() {
    connection.query("SELECT * FROM employee", function (error, result) {
        
        let myEmps = result.map(function (emp) {
            return {
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.id,
            }
        })
        
        inquirer.prompt([
            {
                type: "list",
                name: "title",
                message: "Which Employee Role would you like to update?",
                choices: myEmps
            },
        ]).then(function (answer) {
            connection.query("SELECT * FROM role", function (error, result) {
                if (error) throw error
                myRole = result.map(function (role) {
                    return {
                        name: role.title,
                        value: role.id
                    }
                });
                inquirer.prompt([
                    {
                        type: "list",
                        name: "roleId",
                        message: "Which Role would you like to assign to the selected employee?",
                        choices: myRole
                    },
                ]).then(function (roleAnswer) {
                    
                    connection.query("UPDATE employee SET role_id = ? WHERE id = ?",[roleAnswer.roleId, answer.title],
   
                        function (err, res) {
                            if (err) throw err;
                            console.log(res.affectedRows + " department inserted!\n");
                            // Call updateProduct AFTER the INSERT completes
                            runSearch();
                        })
                });
            })
        });

    })
}
