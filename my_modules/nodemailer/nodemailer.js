import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import generatePDF from '../pdfGenerator/pdfGenerator.js';

// Your code here

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const emailGenerator = async (weektype) => {
  console.log('NODEMAILER', weektype)
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    // Generate PDF File
    await generatePDF(weektype);
    console.log('pdf is generated')

    // Wait until the PDF file is physically created
    const pdfFilePath = path.join(__dirname, '..', '..', 'document.pdf');
    const timeout = 5000; // Maximum wait time in milliseconds
    const interval = 100; // Interval between checks in milliseconds
    let elapsedTime = 0;

    while (!fs.existsSync(pdfFilePath) && elapsedTime < timeout) {
      await new Promise((resolve) => setTimeout(resolve, interval));
      elapsedTime += interval;
    }

    if (fs.existsSync(pdfFilePath)) {
      // Read the PDF file
      const pdfAttachment = await fs.promises.readFile(pdfFilePath);

      // Define mail options
      const mailOptions = {
        from: process.env.NODEMAILER_EMAIL_FROM,
        to: process.env.DEVELOPMENT_EMAIL,
        subject: "Sending Email with PDF Attachment using Node.js",
        text: "Check out the attached PDF!",
        attachments: [
          {
            filename: "document.pdf",
            content: pdfAttachment,
          },
        ],
      };

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);

      // Delete the existing PDF file
     
    } else {
      console.error(
        "PDF file not found or not created within the specified timeout."
      );
    }

    await fs.promises.unlink(pdfFilePath);

  } catch (error) {
    console.error("Error sending email:", error);
  }
};



export default emailGenerator;