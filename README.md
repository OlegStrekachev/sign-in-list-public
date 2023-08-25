# Daycare sign in list printing automatization system

A web-based platform designed to manage a list of kids in a daycare setting, offering CRUD operations, and automated sign-in sheet generation with printing capabilities.

| <img src="https://drive.google.com/uc?export=view&id=11Rl3u4qQ8gMo0rXjQ0Gvr6fhEGNh0B5H" width="300"> | <img src="https://drive.google.com/uc?export=view&id=17UD9V2XnQCL3_PCCHxx4Uj90N_-9iHop" width="300"> |
|:---:|:---:|

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation and Setup](#installation-and-setup)
    - [Frontend](#frontend)
    - [Backend](#backend)
- [Usage](#usage)
- [Continuous Deployment](#continuous-deployment)
- [Contribute](#contribute)
- [License](#license)

## Features

- **Frontend Dashboard:** Interactive web page to view and manage a list of kids.
- **CRUD Operations:** Allows users to Create, Read, Update, and Delete kid's data entries.
- **PDF Generation:** On-demand generation of weekly sign-in sheets in PDF format.
- **Remote Printing:** Sends generated PDFs to a remote printer.

## Technologies Used

- **Frontend:** Bootstrap
- **Backend:** NodeJS, Express
- **Database:** MongoDB
- **Libraries & Packages:** pdfMaker, Nodemailer

## Installation and Setup

### Frontend

1. **Copy Static Website Folder**
   Transfer the static website folder "front-end-table" to your desired server location.

2. **Ensure JS Fetch API Paths are Correct in the fetch.js Script**
   The frontend table sends API requests to the backend, activating specific route handler functions. It's crucial to confirm that the frontend API calls align with your backend routes. Modify as necessary.

3. **Serve the Website**
   Use a web server tool of your choice to serve the static website to the client. Examples include Apache, Nginx, or any static site hosting service.



### Backend

1. **Clone the Repository**
   ```
   git clone [YOUR REPO LINK]
   ```

2. **Navigate to Project Directory**
   ```
   cd [YOUR PROJECT NAME]
   ```

3. **Install Required Dependencies**
   ```
   npm install
   ```

4. **Setup Environment Variables**
   Create a `.env` file in the root directory and provide values for:
   ```env
   # Port expressApp running on
   PORT=your_express_port

   # Address mongoDB is running on
   MONGODB_URI=your_connection_URI

   # Root folder for the Project
   ROOT_FOLDER=your_root_folder

   # Nodemailer login and pass for the email
   NODEMAILER_USER=your_email_login
   NODEMAILER_PASS=your_email_password

   # Nodemailer email
   NODEMAILER_EMAIL_FROM=email_you_sending_from
   NODEMAILER_EMAIL_TO=email_you_sending_to
   ```


5. **Initialize and Run the MongoDB Server**
  

6. **Start the Application**
   ```
   npm start
   ```

## Usage

All the functionality is accessible from the front end web page table. Clients can perform the following actions:
- Create a new record.
- Edit an existing record.
- Delete an existing record.
- Send to print Monday to Friday PDF pages with the sign-in list for the current or next week.

## Continuous Deployment

This project uses GitHub Webhooks to achieve continuous deployment. Any pushes to the master branch automatically trigger a Bash script, pulling the latest changes and restarting the application using PM2.

To set up the webhook:
1. Navigate to your GitHub repository.
2. Click on 'Settings', then 'Webhooks'.
3. Add a new webhook with the Payload URL pointing to your deployment server route: `[YOUR_SERVER_URL]/deploy`.
4. Choose content type as `application/x-www-form-urlencoded`.
5. Set the secret and use the same in your deployment script for validation.
6. Select "Just the push event."

7. Create a bash script on your server:
   ```bash
   #!/bin/bash
   cd /opt/path-to-your-project
   git pull origin name-of-your-branch
   npm install
   pm2 restart name-of-your-process
   ```

8. Ensure the webhook is active.

Adjust the deployment route, script path, and other configurations as deemed necessary.

## Contribute

Contributions are always welcome! Please read the [contribution guidelines](CONTRIBUTING.md) first.

## License

[MIT License](LICENSE)
