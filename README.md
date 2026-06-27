# Graduation Invitation Website & Google Sheets RSVP System

This is a premium, high-end graduation invitation website for **Alex Mercer, Class of 2026**. It features smooth animations, a countdown timer, a dynamic congratulations wishes wall, and a serverless RSVP submission form connected to **Google Sheets** using **Google Apps Script**.

---

## Architecture Overview

1. **Frontend**: HTML5, CSS3, and JavaScript hosted on **GitHub Pages** (free, fast, and secure).
2. **Backend**: A **Google Apps Script Web App** acting as an independent API server.
3. **Database**: A **Google Sheet** to save and organize RSVP submissions.

---

## Step-by-Step Deployment Guide

### Phase 1: Configure Google Sheets & Apps Script (The Backend)

1. **Create a Google Sheet**:
   - Go to [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
   - Name it something like `Alex Mercer Graduation RSVPs`.

2. **Open Apps Script Editor**:
   - In the spreadsheet menu, click on **Extensions** > **Apps Script**.

3. **Paste the Script**:
   - Delete any default code in the editor (`Code.gs`).
   - Open the file `google-apps-script.js` from this project, copy its entire contents, and paste it into the Apps Script editor.
   - Click the **Save** (disk) icon in the editor toolbar.

4. **Deploy as a Web App**:
   - Click the **Deploy** button at the top right and select **New deployment**.
   - Click the **Gear icon (Select type)** and choose **Web app**.
   - Fill in the configuration fields:
     - **Description**: `Graduation RSVP API`
     - **Execute as**: `Me (your-email@gmail.com)`
     - **Who has access**: `Anyone` *(Note: This is crucial so the website can submit data without authentication)*.
   - Click **Deploy**.

5. **Authorize Permissions**:
   - A prompt will ask you to authorize access. Click **Authorize access**.
   - Choose your Google Account.
   - You might see an "Advanced" warning screen. Click **Advanced** at the bottom, then click **Go to Untitled project (unsafe)** or **Go to Graduation RSVP API**.
   - Click **Allow**.

6. **Copy the Web App URL**:
   - Once successfully deployed, copy the **Web app URL** from the dialog (it starts with `https://script.google.com/macros/s/...`).

---

### Phase 2: Link the Backend to the Frontend

1. Open `script.js` in your editor.
2. Locate the configuration variable on line 9:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL';
   ```
3. Replace `'YOUR_GOOGLE_SCRIPT_WEB_APP_URL'` with the **Web app URL** you copied in the previous step. It should look something like:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz.../exec';
   ```
4. Save the file.

---

### Phase 3: Deploy to GitHub Pages (The Frontend)

1. **Create a GitHub Repository**:
   - Go to [GitHub](https://github.com) and log in.
   - Click **New** to create a public repository.
   - Name it `graduation-invitation` (or any name you prefer). Keep it **Public**.
   - Do **NOT** initialize it with a README, `.gitignore`, or license.

2. **Push your Code to GitHub**:
   - Open your terminal (PowerShell, Command Prompt, or Git Bash) in your project directory (`d:\wed`).
   - Run the following commands (replace `YOUR_GITHUB_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub details):
     ```bash
     git init
     git add .
     git commit -m "Initial commit: Graduation invitation website"
     git branch -M main
     git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
     git push -u origin main
     ```

3. **Enable GitHub Pages**:
   - Go to your repository page on GitHub.
   - Click **Settings** (tab at the top right).
   - In the left sidebar, scroll down to the **Code and automation** section and click **Pages**.
   - Under **Build and deployment** > **Source**, ensure **Deploy from a branch** is selected.
   - Under **Branch**, select **main** (or `master`) and folder **/ (root)**. Click **Save**.
   - Wait about 1-2 minutes. Refresh the page, and you will see a banner at the top of the Pages settings showing your live URL:
     *`Your site is live at: https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME/`*

---

## Local Development & Mock Mode

To test your invitation website locally before deploying it to GitHub or setting up the Google Sheet:
- Keep the `GOOGLE_SCRIPT_URL` as `'YOUR_GOOGLE_SCRIPT_WEB_APP_URL'` in `script.js`.
- Double-click `index.html` to open it in your browser.
- Submitting the RSVP form will trigger **Mock Mode**: it simulates a successful server response and saves your wishes to `localStorage`, rendering them on the Wishes Wall dynamically.
