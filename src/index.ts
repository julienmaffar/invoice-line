import inquirer from "inquirer";
import moment from "moment";
import { questions } from "./questions";
moment.locale("fr");
import { generatePDF } from "./helpers/Invoice";

inquirer.prompt(questions).then(async (answers) => {
  await generatePDF(answers);
});
