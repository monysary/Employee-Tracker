require("dotenv").config();
const db = require("../config/connections.js");

const mainPrompt = {
    type: "list",
    message: "What would you like to do?",
    name: "mainChoice",
    choices: [ 
        {
            name: "View All Employee",
            value: "view_employee"
        },
        {
            name: "Add Employee",
            value: "add_employee"
        },
        {
            name: "Update Employee Role",
            value: "update_role"
        },
        {
            name: "View All Roles",
            value: "view_role"
        },
        {
            name: "Add Role",
            value: "add_role"
        },
        {
            name: "View all Departments",
            value: "view_department"
        },
        {
            name: "Add Department",
            value: "add_department"
        },
        {
            name: "Quit",
            value: "quit"
        }
    ]
};

// Function to return array of roles
const rolesArr = () => db.query("SELECT role.title FROM role;", (err, data) => {
    if (err) throw err;
    data.map((obj) => {return obj.title});
})

// Function to return array of managers
const managerArr = () => db.query("SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS name, manager_id FROM employee", (err, data) => {
    if (err) throw err;
    const filterData = data.filter((obj) => {return obj.manager_id === null});
    console.log(filterData.map((obj) => {return obj.name}));
})

const addingEmployee = [
    {
        type: "input",
        message: "What is the new employee's first name?",
        name: "first_name",
    },
    {
        type: "input",
        message: "What is the new employee's last name?",
        name: "last_name",
    },
    {
        type: "list",
        message: "What is the new employee's role?",
        name: "new_role",
        choices: rolesArr()
    },
    {
        type: "list",
        message: "Who is this new employee's manager?",
        name: "new_manager",
        choices: managerArr()
    }
]

module.exports = {
    mainPrompt,
    addingEmployee
}

managerArr();