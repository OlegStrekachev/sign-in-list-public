import Kid from './../models/newKidModel.js';
import emailGenerator from './../nodemailer/nodemailer.js';
import crypto from 'crypto';
import { exec } from 'child_process';


export const sendMail = async (req, res) => {
  try {
    // Call the sendMail function
    await emailGenerator(req.body.weekType);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email", error);
    res.status(500).send("Failed to send email");
  }
};

export const postNewKid = async (req, res) => {
  console.log(req.method);
  console.log("HELLO", req.body);
  try {
    // const newTour = new Tour({})
    // newTour.save()

    const newKid = await Kid.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        Kid: newKid,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const updateKidInfo = async (req, res) => {
  console.log(req);
  try {
    console.log(req.body);

    const newKidInfo = await Kid.findOneAndUpdate(
      { _id: req.query.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        newKidInfo: newKidInfo,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const deleteKidInfo = async (req, res) => {
  console.log(req);
  try {
    
    await Kid.findOneAndDelete({_id: req.query.id});

    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const getFullList = async (req, res) => {
  try {
    console.log(req.query);

    const Kids = await Kid.find();

    res.status(200).json({
      status: "success",
      results: Kid.length,
      data: {
        Kids,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

export const webHookDeploy = async (req, res) => {
  const githubSignature256 = req.headers['x-hub-signature-256'];
  const payload = JSON.stringify(req.body);
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  const computedSignature256 = 'sha256=' + crypto.createHmac('sha256', secret).update(payload, 'utf-8').digest('hex');

  if (githubSignature256 !== computedSignature256) {
      return res.status(403).send('Mismatched signatures');
  }

  // Execute the deployment script
  exec('/opt/deploy.sh', (error, stdout, stderr) => {
      if (error) {
          console.error(`exec error: ${error}`);
          return res.status(500).send('Deployment failed');
      }
      console.log(stdout);
      return res.status(200).send('Deployed successfully');
  });
};