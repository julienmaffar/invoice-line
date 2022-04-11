const inquirer = require("inquirer");
const moment = require("moment");
moment.locale("fr");
const config = require("./config.json");
const { generatePDF } = require("./helpers/Invoice");

const questions = [
  {
    type: "confirm",
    name: "isWorkAllMonth",
    message: `Avez vous travaillez tout le mois de ${moment().format("MMMM")}`,
    default: true,
  },
  {
    type: "input",
    name: "nbrDaysNotWorksInMonth",
    message: `Combien de jours avez vous manqué en ${moment().format("MMMM")}`,
    when: (answers) => answers.isWorkAllMonth === false,
  },
  {
    type: "confirm",
    name: "isWorkAllMonth",
    message: `Avez vous travaillez tout le mois de ${moment().format("MMMM")}`,
    default: true,
  },
  {
    type: "list",
    name: "customer",
    message: "Selectionner le client",
    choices: config.customers.map((customer) => customer.name),
  },
];

inquirer.prompt(questions).then(async (answers) => {
  await generatePDF(answers);
});
