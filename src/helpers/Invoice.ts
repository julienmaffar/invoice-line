import moment from "moment";
import momentBusinessDays from "moment-business-days";
import config from "./../../config.json";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import handlebars from "handlebars";
import { PDFOptions } from "./PDF";
import { Answers } from "inquirer";

/**
 * Retourne le numéro de la facture
 */
const getNumberOfInvoice = (): string => {
  const count = config.invoice.count;
  const number =
    count < 10
      ? `0000${count}`
      : count >= 10 && count < 100
      ? `000${count}`
      : count >= 100 && count < 1000
      ? `00${count}`
      : `0${count}`;

  const data = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "config.json"), "utf8")
  );
  const newData = { ...data, invoice: { count: data.invoice.count + 1 } };
  fs.writeFileSync(
    path.join(process.cwd(), "config.json"),
    JSON.stringify(newData)
  );
  return `F${moment().format("YY")}${number}`;
};

/**
 * Retourne les informations du client depuis le fichier de configuration
 */
const getCustomer = (name: string) => {
  return config.customers.find((customer) => customer.name === name);
};

/**
 * Retourne le nombre de jours ouvrés dans le mois en cours
 */
const getWorkDaysInActualMonth = () => {
  momentBusinessDays.updateLocale("fr", {});
  return momentBusinessDays(moment().endOf("month")).businessDaysIntoMonth();
};

/**
 * Génère la facture en PDF et la sauvegarde sur le serveur
 */
export const generatePDF = async (answers: Answers) => {
  const customer = getCustomer(answers.customer);
  const workDays = answers.isWorkAllMonth
    ? getWorkDaysInActualMonth()
    : getWorkDaysInActualMonth() - Number(answers.nbrDaysNotWorksInMonth);

  const data = {
    nbrInvoice: getNumberOfInvoice(),
    dateInvoice: answers.isCustomDate ? answers.customDate : moment().format("DD/MM/YYYY"),
    // user
    company: config.company,
    contact: config.contact,
    address: config.address,
    siret: config.siret,
    tva: config.tva,
    phone: config.phone,
    email: config.mail,
    website: config.website,
    // customer
    customerCompany: customer!.name,
    customerAddress: customer!.address,
    customerSiret: customer!.siret,
    customerTva: customer!.tva,
    customerWebsite: customer!.website,
    // invoice
    dateInWords: moment().format("MMMM YYYY"),
    daysOfWorks: workDays,
    tjm: config.tjm,
    totalHt: Number(config.tjm) * workDays,
    totalTtc: Number(config.tjm) * workDays * 1.2,
    totalTva: Number(config.tjm) * workDays * 0.2,
    iban: config.iban,
    bic: config.bic,
  };

  const template = handlebars.compile(
    fs.readFileSync(
      path.join(process.cwd(), "/src/templates/invoice.html"),
      "utf8"
    )
  );
  const html = template(data);
  const pdfPath = path.join("pdf", `Facture-${new Date().getTime()}.pdf`);
  const options = { ...PDFOptions, path: pdfPath };

  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(`data:text/html;charset=UTF-8,${html}`, {
    waitUntil: "networkidle0",
  });
  await page.pdf(options);
  await browser.close();
};
