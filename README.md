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


## Directory Structure:

The backend code is located in the backend folder.
The frontend code is located  to the backend folder:
```
cd backend
```

Run the backend service using the Maven Wrapper:

On Linux/macOS
```
./mvnw spring-boot:run
```
On Windows
```
mvnw.cmd spring-boot:run
```
The backend server will start and listen on http://localhost:8080.

### Frontend
Open a new terminal window or tab and navigate to the frontend folder:
```
cd frontend
```

Install project dependencies
```
npm install
```

Start the frontend development server:
```
npm run dev
```
The frontend will run on http://localhost:5137.is located in the frontend folder.

## Running the Application

### Backend
Open a terminal and nav

##Problems
If you have problems getting the front end to work, run npm install jspdf html2canvas