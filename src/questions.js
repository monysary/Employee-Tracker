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
    }
];

const addingRole = [
    {
        type: "input",
        message: "What is the title of the new role?",
        name: "new_role"
    },
    {
        type: "input",
        message: "What is salary of the new role?",
        name: "new_role_salary"
    }
];

module.exports = {
    mainPrompt,
    addingEmployee,
    addingRole
};

