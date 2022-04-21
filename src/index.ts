import inquirer from "inquirer";
import moment from "moment";
import { questions } from "./questions";
import { generatePDF } from "./helpers/Invoice";
moment.locale("fr");

inquirer.prompt(questions).then(async (answers) => {
  await generatePDF(answers);
});
