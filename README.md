# 💰 Finance Tracker App

A simple and responsive web application to track income and expenses. Built with **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, and **Recharts**. Features user authentication, transaction management, and visual charts.

---

## 🛠 Features

- **User Authentication**
  - Login
  - Logout
  - Reset Password
  - Forgot Password

- **Transactions**
  - Add, Edit, Delete transactions
  - Track both income and expenses

- **Visual Dashboard**
  - Monthly income vs expense chart
  - Summary of balance, income, and expenses

- **Responsive UI**
  - Mobile, tablet, and desktop-friendly design

---

## 🧰 Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS  
- **Charts:** Recharts  
- **Backend / API:** Next.js API routes  
- **Authentication:** JWT  
- **Notifications:** Sonner  

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/steno1/finance-tracker 
cd finance-tracker
2. Install dependencies

npm install
# or
yarn install
3. Create .env file
env

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
4. Run the development server

npm run dev
# or
yarn dev
Visit http://localhost:3000 to see the app in action.

📝 Project Structure

finance-tracker/
├─ components/      # Reusable components (TransactionForm, TransactionList, TransactionChart)
├─ models/          # Mongoose models
├─ pages/api/        # API routes for transactions and auth
├─ types/           # TypeScript types
├─ public/          # Static assets
├─ styles/          # Global CSS / Tailwind
└─ README.md



🎯 Future Enhancements
Categories for transactions

Multiple currency support

Transaction filters and search

Export data (CSV / PDF)



🙏 Author
Onu Princeley Toochukwu
