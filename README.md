# Description

### Task:

Create a script, without using Google API, in Node.js, that will log in to https://mail.google.com/ (Gmail) with Puppeteer and display the number of unread emails.

### What has been done:

I created a script (program, application) that goes to Google Mail and extracts the number of unread emails.

The program was divided into parts for readability, which is reflected in the file system. If the program is to be run as serverless-lambda-function, everything can always be returned to one file.

For demonstration purposes, the program can be interacted via the CLI.

# How to Run Locally

### Requirements:

- Node.js v.18.15.0 or above

---

1. Install dependencies

   `npm i`

2. Build application

   `npm run build`

3. Run command to fetch unread messages count

   `node build/index get-unread-count -l "your_gmail_login" -p "your_gmail_password"`

   OR

   `node build/index get-unread-count --password "your_gmail_password" --login "your_gmail_login"`
