type PDFOptionsType = {
  width: string;
  height: string;
  displayHeaderFooter: boolean;
  margin: {
    top: string;
    left: string;
    right: string;
    bottom: string;
  };
  printBackground: boolean;
};

export const PDFOptions: PDFOptionsType = {
  width: "1125px",
  height: "1591px",
  displayHeaderFooter: false,
  margin: {
    top: "125px",
    left: "60px",
    right: "60px",
    bottom: "30px",
  },
  printBackground: true,
};
