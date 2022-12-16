// Requiring necessary tools
require("dotenv").config();
const inquirer = require("inquirer");
const questions = require("./src/questions");
const cTable = require("console.table");
const db = require("./config/connections")

// Function to start application
const startTracker = () => {
    console.log("WELCOME TO THE EMPLOYEE TRACKER!");
    askMainPrompt();
}

// Function to ask mainPrompt
const askMainPrompt = () => {
    inquirer.prompt(questions.mainPrompt)
    .then((res) => {
        switch (res.mainChoice) {
            // When user selects View All Employee
            case "view_employee":
                console.log(" ");
                db.query(`
                    SELECT employee.id AS ID, 
                    CONCAT(employee.first_name, " ", employee.last_name) AS Name, 
                    role.title AS Title,
                    department.name AS Department, 
                    role.salary AS Salary,
                    CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
                    FROM employee
                    LEFT JOIN role
                    ON employee.role_id = role.id
                    LEFT JOIN department
                    ON role.department_id = department.id
                    LEFT JOIN employee manager
                    ON manager.id = employee.manager_id;
                    `, (err, data) => {
                    if (err) throw err;
                    console.table(data);
                    askMainPrompt();
                })
                break;
            // When user selects View All Roles
            case "view_role":
                console.log(" ");
                db.query(`
                SELECT role.title AS Title,
                role.salary AS Salary,
                department.name AS Department
                FROM role
                LEFT JOIN department
                ON role.department_id = department.id;
                `, (err, data) => {
                    if (err) throw err;
                    console.table(data);
                    askMainPrompt();
                })
        }
    })
}

startTracker();