require("dotenv").config
const inquirer = require("inquirer");
const db = require("../config/connections");
const cTable = require("console.table");
const { addingEmployee, addingRole } = require("./questions");

const addEmployeeFunc = () => {
    inquirer.prompt(addingEmployee)
        .then((res) => {
            const newFirstName = res.first_name;
            const newLastName = res.last_name;

            // Adding employee - prompting to add role
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

                            // Adding employee - prompting to add manager
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
                                                INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                                VALUES ("${newFirstName}", "${newLastName}", ${newRoleID}, ${newManagerID});
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
}

const addRoleFunc = () => {
    inquirer.prompt(addingRole)
        .then((res) => {
            const newRole = res.new_role;
            const newRoleSalary = res.new_role_salary;
            
            // Adding role - prompting to add department
            db.query(`
                SELECT department.name FROM department;
            `, (err, data) => {
                if (err) throw err;
                const department = data.map((obj) => {return obj.name});
                inquirer.prompt({
                    type: "list",
                    message: "What department does the new role belong to?",
                    name: "new_role_department",
                    choices: department
                })
                    .then((res) => {
                        const newRoleDepartment = res.new_role_department;
                        db.query(`
                            SELECT department.id FROM department WHERE department.name = "${newRoleDepartment}";
                        `, (err, data) => {
                            if (err) throw err;
                            const newRoleDepartmentID = data[0].id;

                            // Adding new role into database
                            db.query(`
                                INSERT INTO role (title, salary, department_id)
                                VALUES ("${newRole}", "${newRoleSalary}", ${newRoleDepartmentID});
                            `, (err, data) => {
                                if (err) throw err;
                                console.log("-----NEW ROLE ADDED TO DATABASE!-----");
                                askMainPrompt();
                            })
                        })
                    })
            })
        })
}

module.exports = {
    addEmployeeFunc,
    addRoleFunc
}