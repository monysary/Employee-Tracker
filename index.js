// Requiring necessary tools
const inquirer = require("inquirer");
const questions = require("./src/questions");
const cTable = require("console.table");

// Function to start application
const startTracker = () => {
    console.log("WELCOME TO THE EMPLOYEE TRACKER!");
    inquirer.prompt(questions.mainPrompt);
}

startTracker();