# Expense Tracker

A full-stack MERN expense tracker with secure cookie authentication, transaction management, dashboards, charts, CSV export, custom categories, budgets, and dark mode.

## Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, HTTP-only cookies, bcryptjs, Zod
- Frontend: React 18, Vite, TypeScript, Tailwind CSS
- UI/data: Context API + useReducer, Recharts, date-fns, React Hook Form, React Hot Toast, Lucide React

## Features

- Register, login, logout, and protected routes
- JWT stored in HTTP-only cookies
- Password hashing with bcryptjs
- Dashboard cards for balance, income, expenses, and monthly summary
- Pie chart for expense categories and line chart for six-month spending trends
- Income and expense overview charts
- Add, edit, delete, filter, and export transactions
- Predefined income and expense categories
- Custom categories and per-category budget setting
- Mobile-first responsive layout
- Light and dark modes

## Project Structure

```txt
expense-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## Setup

1. Install backend dependencies:

```bash
cd backend
npm install
cp .env.example .env
```

2. Install frontend dependencies:

```bash
cd ../frontend
npm install
cp .env.example .env
```

3. Start MongoDB locally, then run both apps:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173` and the API runs on `http://localhost:5000`.

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/dashboard`
- `GET /api/transactions`
- `POST /api/transactions`
- `PATCH /api/transactions/:id`
- `DELETE /api/transactions/:id`
- `GET /api/transactions/export`
- `GET /api/categories`
- `POST /api/categories`
- `PATCH /api/categories/budget`

## Notes

- Set `JWT_SECRET` to a long random value before deploying.
- In production, use HTTPS so secure cross-site cookies work correctly.
- Configure `CLIENT_URL` and `VITE_API_URL` to match your deployed frontend and API URLs.
