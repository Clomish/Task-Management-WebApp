# 🚀 Task Management Web Application

A full-stack project developed using the **PERN Stack** (PostgreSQL, Express, React, Node.js). This application features a secure authentication system and a comprehensive task management dashboard.

## 📁 Project Structure
- **/frontend**: React.js client interface.
- **/backend**: Node.js & Express server with PostgreSQL integration.

## 🛠️ Features
- **User Auth:** JWT-based login and registration.
- **Task CRUD:** Create, Read, Update, and Delete tasks.
- **Priority Levels:** Assign tasks as High, Medium, or Low priority.
- **Responsive UI:** Built with React for a seamless user experience.

## 🚀 Setup & Installation

### 1. Database Configuration (PostgreSQL)
Create a database named `task_manager` and run the SQL commands found in `backend/database.sql` (or use the schema below):
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending'
);