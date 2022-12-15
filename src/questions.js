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

module.exports = {
    mainPrompt
}