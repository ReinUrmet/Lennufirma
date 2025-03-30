# ✈️ Flight Planner Project

This Flight Planner project is a full-stack web application with a **Spring Boot** backend and a **modern JavaScript** frontend. Follow the instructions below to set up and run the application on any computer.

## 📚 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Troubleshooting Missing Dependencies](#troubleshooting-missing-dependencies)

---

## 🧭 Overview

The Flight Planner app enables users to search, plan, and manage flights with the help of a powerful backend and a responsive, interactive frontend. This guide walks you through setting up both components locally.

---

## 🛠️ Prerequisites

Make sure the following software is installed on your machine before proceeding:

### Backend Requirements
- **Java Development Kit (JDK) 21**
- **Maven** (or you can use the included Maven Wrapper)

### Frontend Requirements
- **Node.js** (version 18 or later recommended)
- **npm** (comes with Node.js)

---

## 📦 Installation

First, clone the repository and enter the project folder:
```bash
git clone https://github.com/ReinUrmet/Lennufirma.git
cd Lennufirma
```

---

## 📁 Directory Structure

The project is divided into two main parts:

- `backend/` – contains the backend Spring Boot code
- `frontend/` – contains the frontend JavaScript code

---

## ▶️ Running the Application

### ✅ Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Start the backend server using the Maven Wrapper:

   **On Linux/macOS:**
   ```bash
   ./mvnw spring-boot:run
   ```

   **On Windows:**
   ```bash
   mvnw.cmd spring-boot:run
   ```

3. The backend server will start and listen on:  
   [http://localhost:8080](http://localhost:8080)

---

### ✅ Frontend

1. Open a **new terminal window or tab**.

2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

3. Install frontend dependencies:
   ```bash
   npm install
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

5. The frontend will be available at:  
   [http://localhost:5137](http://localhost:5137)

---

## 🛠️ Troubleshooting Missing Dependencies

If you encounter an error when running the frontend (e.g., missing libraries like `jspdf` or `html2canvas`), you can fix it by installing them manually:

```bash
npm install jspdf html2canvas
```

This command will add both libraries to your project’s `node_modules` and update `package.json` accordingly.
