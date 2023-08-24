# Daycare sign in list printing automatization system

A web-based platform designed to manage a list of kids in a daycare setting, offering CRUD operations, and automated sign-in sheet generation with printing capabilities.

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

2. **Serve the Website**

   Use a web server tool of your choice to serve the static website to the client. Examples include Apache, Nginx, or any static site hosting service.

### Backend

1. **Clone the Repository**

   ```bash
   git clone [YOUR REPO LINK]
   ```

2. **Navigate to Project Directory**

   ```bash
   cd [YOUR PROJECT NAME]
   ```

3. **Install Required Dependencies**

   ```bash
   npm install
   ```

4. **Setup Environment Variables**

   Create a `.env` file in the root directory and provide values for:

   ```env
   MONGO_URI=your_mongodb_uri
   MAIL_USER=your_email@example.com
   MAIL_PASS=your_email_password
   ```

5. **Start the Application**

   ```bash
   npm start
   ```

## Usage

- Navigate to `http://localhost:[YOUR PORT]` in your web browser for the backend.
- Use the web interface to perform CRUD operations on the kids' list.
- To generate and print the weekly sign-in sheets, click the `Print` button.

## Continuous Deployment

This project uses GitHub Webhooks to achieve continuous deployment. Any pushes to the master branch automatically trigger a Bash script, pulling the latest changes and restarting the application using PM2.

To set up the webhook:

1. Navigate to your GitHub repository.
2. Click on 'Settings', then 'Webhooks'.
3. Add a new webhook with the Payload URL pointing to your deployment server.
4. Choose content type as `application/json`.
5. Set the secret and use the same in your deployment script for validation.
6. Select "Just the push event."
7. Create a bash script on your server:
   
```
#!/bin/bash
cd /opt/path-to-your-project
git pull origin name-of-your-branch
npm install
pm2 restart name-of-your-process
```

8. Ensure the webhook is active.


## Contribute

Contributions are always welcome! Please read the [contribution guidelines](CONTRIBUTING.md) first.

## License

[MIT License](LICENSE)
