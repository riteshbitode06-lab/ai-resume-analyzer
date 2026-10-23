# CareerLens — AI Resume Analyzer Frontend

## Requirements
- Install Node.js LTS from https://nodejs.org/
- Install VS Code

## Run the project
1. Extract this ZIP.
2. In VS Code, open the `ai-resume-analyzer-frontend` folder.
3. Open **Terminal → New Terminal**.
4. Run these commands one by one:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL printed in the terminal (usually http://localhost:5173).

## What works now
- Responsive landing page and navigation
- Scroll-to-upload buttons
- PDF file picker and drag/drop
- PDF-only validation and 10 MB size limit
- Target job-role dropdown
- Error and confirmation messages

## Not connected yet
The PDF is not sent to a server and is not analyzed yet. This is intentional for the first frontend milestone. Next we will create a Python + Flask backend and connect it to this UI.

If `npm` is not recognized, install Node.js LTS, restart VS Code, then check `node -v` and `npm -v`.
