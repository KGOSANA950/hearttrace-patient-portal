# 💙 HeartTrace - Remote Patient Monitoring System

A fully functional, responsive health monitoring web application built entirely with **Vanilla JavaScript, HTML5, and CSS3** (No frameworks, no backend required). 

This project was built to demonstrate core frontend engineering skills, including DOM manipulation, state management, client-side routing, and data visualization.

## 🚀 Live Demo
👉 **[Click here to view the Live Demo](https://kgosana950.github.io/hearttrace-patient-portal/)**

## ✨ Features
- **User Authentication:** Simulated Login, Account Creation, and Forgot Password flows.
- **Data Entry & Persistence:** Patients can input their Heart Rate (BPM), which is saved to the browser's `localStorage` (acts as a database).
- **Live Data Visualization:** Dynamic line charts using **Chart.js** to track BPM history.
- **CSV Export:** One-click button to download the patient's entire test history as a `.csv` file for their doctor.
- **Responsive UI:** Clean, modern dashboard with functional tab navigation (Dashboard, History, Profile).

## 🛠️ Tech Stack
- **HTML5:** Semantic structure.
- **CSS3:** Custom properties (variables), Flexbox, CSS Grid, and media queries.
- **Vanilla JavaScript (ES6):** Modular JS files for logic (`auth.js`, `app.js`).
- **Chart.js:** For rendering the dynamic heart rate graph.
- **LocalStorage API:** Used as a mock database for users and test records.

## 📂 Project Structure
```text
/HeartTrace
│── index.html       # Main HTML structure
│── css/
│   └── style.css    # All styling and responsive design
│── js/
│   ├── auth.js      # Login, Register, Forgot Password logic
│   └── app.js       # Dashboard, Data Entry, CSV Export, Chart.js logic
