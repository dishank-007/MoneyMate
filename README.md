# MoneyMate — Personal Finance Management System

> **Tagline:** *Master Your Money. Simplify Your Life.*

MoneyMate is a modern, full-stack personal finance web application built for seamless expense tracking, category budgeting, financial goal progression, and deep analytical reporting.

---

## 🌟 Architecture Overview

```text
React Frontend (Vite, React Router, Recharts)
        ↓  HTTPS REST APIs (JWT Authentication)
Java Spring Boot 3 Backend (Spring Security, Spring Data JPA)
        ↓  JDBC Connection
MySQL 8.0 Relational Database
```

---

## 🚀 Key Features

- **Public Landing Page:** Interactive product showcase, feature cards, and "How It Works" workflow.
- **Stateless Authentication:** Secure JWT-based signup and login with BCrypt password hashing.
- **Dynamic Dashboard:** Real-time net worth balance, monthly income, expense metrics, active goals count, cashflow charts, and recent activity.
- **Transactions Management:** Filter transactions by type (income/expense), category, description search, and date.
- **Budget Tracking:** Set category-wise monthly spending caps with warning thresholds and over-budget indicators.
- **Savings Goals:** Visual milestone trackers with confetti celebrations upon achieving savings targets.
- **Analytics & Reports:** Interactive category pie charts, daily spending trends, and month-over-month summaries.
- **Admin Portal (`/admin`):** Protected administrative portal to manage users, toggle account statuses, and view platform metrics.

---

## 📂 Project Structure

```text
MoneyMate/
├── frontend/             # React 18 + Vite frontend
│   ├── src/
│   │   ├── components/   # Modals, Navbar, Sidebar, KpiCards
│   │   ├── context/      # AuthContext, currency formatting
│   │   ├── pages/        # Landing, Login, Signup, Dashboard, etc.
│   │   ├── services/     # Axios API service layer (VITE_API_URL configured)
│   │   └── styles/       # Design tokens & responsive CSS
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json       # SPA routing fallback configuration
│
├── backend/              # Spring Boot 3 Java backend
│   ├── src/main/java/com/moneymate/
│   │   ├── config/       # SecurityConfig, CORS, DataInitializer
│   │   ├── controller/   # REST Controllers
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── entity/       # JPA Entities (User, Transaction, Budget, Goal, Notification)
│   │   ├── repository/   # Spring Data JPA Repositories
│   │   ├── security/     # JwtTokenProvider, JwtAuthenticationFilter
│   │   └── service/      # Business logic services
│   ├── src/main/resources/
│   │   └── application.properties # Environment-driven DB & JWT config
│   └── pom.xml           # Maven build & dependencies
│
├── database/             # Relational Database scripts
│   └── schema.sql        # MySQL DDL schema and seed data
│
└── README.md
```

---

## 🛠️ Local Development Quickstart

### 1. Database Setup
Create and initialize the MySQL database:
```sql
CREATE DATABASE IF NOT EXISTS moneymate;
```

### 2. Backend Setup
```bash
cd backend
mvn clean package -DskipTests
java -jar target/moneymate-backend-1.0.0.jar
```
*Backend runs at:* `http://localhost:8080` (Health check: `http://localhost:8080/api/health`)

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at:* `http://localhost:3000`

---

## 🔐 Environment Variables

### Backend (`application.properties`):
| Variable | Description | Default |
| :--- | :--- | :--- |
| `DB_URL` | JDBC Connection URL | `jdbc:mysql://localhost:3307/moneymate` |
| `DB_USERNAME` | MySQL Username | `root` |
| `DB_PASSWORD` | MySQL Password | `""` |
| `JWT_SECRET` | 256/512-bit Secret Key | Configured securely in production |
| `JWT_EXPIRATION` | Token validity in ms | `86400000` (24 hours) |
| `PORT` | Server HTTP Port | `8080` |

### Frontend (`frontend/.env`):
| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Base URL of deployed Spring Boot API |
