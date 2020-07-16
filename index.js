var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "password",
  database: "employee_trackerDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
//   runSearch();
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
      .then(function(answer) {
        switch (answer.action) {
        case "View Departments?":
          viewDepartment();
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
  
        case "exit":
          connection.end();
          console.log("Thank You For Using Employee Tracker!");
          break;
        }
      });
  }