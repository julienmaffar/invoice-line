const moment = require("moment");
const momentBusinessDays = require("moment-business-days");
const config = require("./../config.json");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const { PDFOptions } = require("./PDF");

/**
 * Retourne le numéro de la facture
 */
const getNumberOfInvoice = () => {
  const count = config.invoice.count;
  const number =
    count < 10
      ? `0000${count}`
      : count >= 10 && count < 100
      ? `000${count}`
      : count >= 100 && count < 1000
      ? `00${count}`
      : `0${count}`;
  //TODO: réécrire le fichier config.json pour ajouter 1 au compteur de invoice
  return `F${moment().format("YY")}${number}`;
};

/**
 * Retourne les informations du client depuis le fichier de configuration
 * @param {string} name
 */
const getCustomer = (name) => {
  return config.customers.find((customer) => customer.name === name);
};

/**
 * Retourne le nombre de jours ouvrés dans le mois en cours
 */
const getWorkDaysInActualMonth = () => {
  momentBusinessDays.updateLocale("fr");
  return momentBusinessDays(moment().endOf("month")).businessDaysIntoMonth();
};

/**
 * Génère la facture en PDF et la sauvegarde sur le serveur
 */
const generatePDF = async (answers) => {
  const customer = getCustomer(answers.customer);
  const workDays = answers.isWorkAllMonth
    ? getWorkDaysInActualMonth()
    : getWorkDaysInActualMonth() - Number(answers.nbrDaysNotWorksInMonth);

  const data = {
    nbrInvoice: getNumberOfInvoice(),
    dateInvoice: moment().format("DD/MM/YYYY"),
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
    customerCompany: customer.name,
    customerAddress: customer.address,
    customerSiret: customer.siret,
    customerTva: customer.tva,
    customerWebsite: customer.website,
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
    fs.readFileSync(path.join(process.cwd(), "/templates/invoice.html"), "utf8")
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

module.exports = {
  generatePDF,
};
