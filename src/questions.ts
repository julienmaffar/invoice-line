import { Answers, QuestionCollection } from "inquirer";
import moment from "moment";
import config from "../config.json";

export const questions: QuestionCollection<Answers> = [
  {
    type: "confirm",
    name: "isCustomDate",
    message: `Voulez-vous choisir une date personnalisée à inscrire sur la facture ?`,
    default: false,
  },
  {
    type: "input",
    name: "customDate",
    message: `Entrer une date de votre choix au format JJ/MM/AAAA`,
    when: (answers: Answers) => answers.isCustomDate === true,
  },
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
    when: (answers: Answers) => answers.isWorkAllMonth === false,
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
