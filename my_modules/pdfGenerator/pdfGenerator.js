"use strict";

const fonts = {
  Roboto: {
    normal: "my_modules/pdfGenerator/fonts/Roboto-Italic.ttf",
    bold: "my_modules/pdfGenerator/fonts/Roboto-Medium.ttf",
    italics: "my_modules/pdfGenerator/fonts/Roboto-MediumItalic.ttf",
    bolditalics: "my_modules/pdfGenerator/fonts/Roboto-Regular.ttf",
  },
};

import PdfPrinter from "pdfmake";
import fs from "fs";
import generateDocumentDefinition from "./pdfContent.js";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const printer = new PdfPrinter(fonts);

async function generatePDF(weektype) {
  console.log("GENERATE PDF", weektype)
  try {
    const docDefinition = await generateDocumentDefinition(weektype);
    const options = {
      // your options here...
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    const absolutePDFPath = path.join(__dirname, "..", "..", "document.pdf");
    pdfDoc.pipe(fs.createWriteStream(absolutePDFPath));
    pdfDoc.end();

    // Note: I've removed the fs.watch block for now as recommended.
    // If you have a specific use-case for it, you'd want to handle it in a more robust way.
  } catch (err) {
    console.log("Error:", err);
  }
}

export default generatePDF;
