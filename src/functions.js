require("dotenv").config
const inquirer = require("inquirer");
const db = require("../config/connections");
const cTable = require("console.table");
const { addingEmployee } = require("./questions");

const addEmployeeFunc = () => {
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
}

module.exports = {
    addEmployeeFunc
}