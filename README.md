# MoneyMate - Personal Finance Tracker

MoneyMate is a full-stack personal finance tracking web application built as an ALX Portfolio Project. It allows users to take control of their money by tracking income, expenses, and savings goals in a clear and simple interface.

This app was created to solve the real-world problem of managing money effectively — especially in regions like Africa where financial tools are often inaccessible, expensive, or not locally contextualized.

---

## 🚀 Features

### ✅ MVP Features

* **User Registration & Authentication** (JWT)
* **Income & Expense Tracking**
* **Categorization of Transactions**
* **Budget Creation & Tracking**
* **Savings Goals**
* **Financial Dashboards and Monthly Reports**

### 🎯 Optional Features (Stretch Goals)

* Recurring Transactions and Bill Reminders
* Export Reports (CSV/PDF)
* Currency Conversion API
* Dark Mode UI Toggle
* Mobile Optimization (PWA-ready)

---

## 🧠 Learning Objectives

* Build and deploy a full-stack web application
* Implement JWT-based authentication
* Design relational database schemas
* Create RESTful APIs using Flask or Express.js
* Integrate data visualization tools (Chart.js, Recharts)
* Manage project workflow using Kanban (Trello)

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Chart.js or Recharts

### Backend

* Flask (Python) *(or Node.js + Express.js alternative)*
* RESTful API architecture

### Database

* PostgreSQL (production)
* SQLite (local development/testing)

### Dev Tools

* VS Code
* Git & GitHub
* Postman
* Trello
* Render / Netlify / Vercel

---

## 🌐 External Services

* **Render / Vercel / Netlify** – App hosting and deployment
* **ExchangeRate API** – (optional) for real-time currency conversion
* **Chart.js / Recharts** – Data visualization
* **Trello** – Project management using Kanban methodology

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/Byte-Master63/moneymate.git
cd moneymate
```

### 2. Backend Setup (Flask version)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

> Or if using Node.js

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

### 4. Environment Variables

Create a `.env` file for backend:

```
PORT=5000
DB_URL=postgresql://localhost/moneymate
JWT_SECRET=your_secret_key
```

---

## 🗂️ Project Structure

```bash
finance-tracker/
├── backend/
│   ├── app.py / server.js
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── config/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── assets/
├── README.md
└── .env
```

---

## 📅 Project Timeline and Planning

Managed via Trello board: [https://trello.com/b/8ioLwptk/alx-portfolio-project-webstack]()

| Week | Milestone                                      |
| ---- | ---------------------------------------------- |
| 1    | Planning, Repo Setup, Backend Init             |
| 2    | API & DB Dev, Auth Implementation              |
| 3    | Frontend Build & Integration                   |
| 4    | UI/UX Polish, Testing, Deployment, Pitch Video |

---

## 📊 Mockups

Preview mockups created in Figma: [Mockup Link (Coming Soon)]()

* Login Page
* Dashboard
* Budget Tracking UI
* Add/Edit Transaction Modal
* Reports Graph Page

---

## 🎥 Video Pitch Presentation

**Watch here:** \[Google Drive/YouTube Link - Coming Soon]

---

## 🤝 Contributing

While this is a solo project for ALX, contributions are welcome post-submission. If you'd like to suggest features, improvements, or localization ideas, feel free to fork the repo and open a PR.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

* ALX SE Program for mentorship and project structure
* Open Source libraries like Flask, React, Tailwind
* African developers inspiring localized financial tech

---

> “Let’s build a smarter money habit, one line of code at a time.”

---

