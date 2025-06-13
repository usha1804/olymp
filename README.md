# 🏆 Olympiad Web Application (Full Stack Project)

A dynamic vendor-style full stack web application built using **React + Tailwind CSS (Frontend)** and **Spring Boot + MySQL (Backend)**. It includes **Admin/User role-based login**, a **responsive UI**, and a **RESTful secured API layer** — perfect for showcasing modern full stack development skills.

---

## 🔗 Live Preview

🌐 [Frontend Hosted on Vercel]https://vercel.com/surapally-ushas-projects/olymp      

## 🎯 Core Features

- 🔐 Role-Based Authentication (Admin & User)
- 🧑 Admin Dashboard with Approval and Analytics
- 👤 User Dashboard with Role-Specific Functionalities
- 🎨 Responsive UI with Tailwind CSS and shadcn-ui
- ⚙️ Secure REST APIs with Spring Boot + JWT
- 🗄️ Integrated with MySQL for persistent data storage

---
## 🛠️ Tech Stack

| Layer        | Technology                                      |
|--------------|--------------------------------------------------|
| Frontend     | React, Vite, TypeScript, Tailwind CSS, shadcn-ui|
| Backend      | Java 17, Spring Boot, Spring Security, JWT       |
| Database     | MySQL (can be switched to MongoDB)               |
| Tools        | Maven, Git, GitHub, Lovable.dev                  |

---

## 🧪 Demo Credentials

| Role   | Email                | Password   |
|--------|----------------------|------------|
| Admin  | admin@example.com    | admin123   |
| User   | user@example.com     | user123    |

Use these for testing role-based access control and dashboards.

---

## 📂 How to Run the Full Stack Project Locally

### 🖥️ 1. Clone Repository

```bash
git clone https://github.com/usha1804/olymp.git
cd olymp
# Navigate to frontend root (if not already)
cd olymp

# Install dependencies
npm install

# Start dev server
npm run dev

# Navigate to backend
cd olymp/olymp/Olympiad/backend

# Build and run Spring Boot backend
mvn clean install
mvn spring-boot:run
