// Requiring necessary tools
require("dotenv").config();
const inquirer = require("inquirer");
const { mainPrompt, addingEmployee } = require("./src/questions");
const cTable = require("console.table");
const db = require("./config/connections");

// Function to start application
const startTracker = () => {
    console.log("-----WELCOME TO THE EMPLOYEE TRACKER!-----");
    askMainPrompt();
}

// Function to ask mainPrompt
const askMainPrompt = () => {
    inquirer.prompt(mainPrompt)
        .then((res) => {
            switch (res.mainChoice) {
                // When user selects Quit
                case "quit":
                    console.log("-----EMPLOYEE TRACKER APPLICATION ENDED. GOODBYE!-----");
                    break;

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
                        LEFT JOIN employee AS manager
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
                        SELECT role.id AS ID,
                        role.title AS Title,
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
                    break;

                // When user selects View All Departments
                case "view_department":
                    console.log(" ");
                    db.query(`
                        SELECT department.id AS ID,
                        department.name AS Departments
                        FROM department;
                    `, (err, data) => {
                        if (err) throw err;
                        console.table(data);
                        askMainPrompt();
                    })
                    break;

                // When user selects Add Employee
                case "add_employee":
                    console.log(" ");
                    inquirer.prompt(addingEmployee)
                        .then((res) => {
                            const newFirstName = res.first_name;
                            const newLastName = res.last_name;

                            // Adding employee prompting to add role
                            db.query(`
                                SELECT role.title FROM role;
                            `, (err, data) => {
                                if (err) throw err;
                                const mapData = data.map((obj) => obj.title);
                                inquirer.prompt({
                                    type: "list",
                                    message: "What is the new employee's role?",
                                    name: "new_role",
                                    choices: mapData
                                })
                                    .then((res) => {
                                        const newRole = res.new_role;
                                        db.query(`
                                            SELECT role.id FROM role WHERE role.title = "${newRole}";
                                        `, (err, data) => {
                                            if (err) throw err;
                                            const newRoleID = data[0].id;

                                            // Adding employee prompting to add manager
                                            db.query(`
                                                SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS name
                                                FROM employee
                                                WHERE employee.manager_id IS NULL;
                                            `, (err, data) => {
                                                if (err) throw err;
                                                const mapData = data.map((obj) => {return obj.name});
                                                const concatData = mapData.concat("None");
                                                inquirer.prompt({
                                                    type: "list",
                                                    message: "Who is the new employee's manager?",
                                                    name: "new_manager",
                                                    choices: concatData
                                                })
                                                    .then((res) => {
                                                        const newManager = res.new_manager;
                                                        db.query(`
                                                            SELECT employee.id FROM employee WHERE CONCAT(employee.first_name, ' ', employee.last_name) = "${newManager}";
                                                        `, (err, data) => {
                                                            if (err) throw err;
                                                            const newManagerID = data[0].id;

                                                            // Adding new employee into database
                                                            db.query(`
                                                                INSERT INTO employee(first_name, last_name, role_id, manager_id)
                                                                VALUES("${newFirstName}", "${newLastName}", ${newRoleID}, ${newManagerID});
                                                            `, (err, data) => {
                                                                if (err) throw err;
                                                                console.log("-----NEW EMPLOYEE ADDED TO DATABASE!-----");
                                                                askMainPrompt();
                                                            })
                                                        })

                                                    })
                                            })
                                        })

                                    })
                            })
                        })
                    break;
            }
        })
}

startTracker();

