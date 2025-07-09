# 🚀 Chapa Frontend Interview Assignment

[![Live Demo](https://img.shields.io/badge/Live%20Demo-%F0%9F%94%B4%20View%20Here-blueviolet?style=for-the-badge&logo=vercel)](https://chapa-frontend-interview-assignment.vercel.app/)

---

## About This Project

This is a role-based dashboard SPA built with **Next.js (App Router)** for the Chapa Frontend Developer (React) test. The app simulates a Payment Service Provider platform, with different dashboards and features for **User**, **Admin**, and **Super Admin** roles. All data and API calls are mocked for demonstration purposes.

👉 **You can try the app instantly here: [Live Demo](https://chapa-frontend-interview-assignment.vercel.app/)**

### ✨ Key Features
- **Role-based Dashboards**: UI and features change based on login role (User, Admin, Super Admin)
- **User**: View wallet balance, recent transactions, and initiate new transactions
- **Admin**: Manage users (activate/deactivate), view user payment summaries
- **Super Admin**: All admin features plus add/remove admins or regular user and view system-wide stats
- **Mocked API Calls**: All backend logic is simulated with mock data and async delays
- **Redux**: Used for robust global state management
- **Clean Component Structure**: Organized for clarity and scalability

### 🛡️ Security & Best Practices
- **Route Handlers & Middleware**: Used to protect API endpoints and restrict access based on user role
- **HttpOnly Cookies**: Authentication tokens are stored in HttpOnly cookies to mitigate XSS and CSRF attacks
- **No Real Backend**: All sensitive logic is simulated, but the structure mirrors real-world secure practices

---

## Getting Started

You can also explore the app directly in your browser via the [Live Demo](https://chapa-frontend-interview-assignment.vercel.app/).

To run locally:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---
