<h1 align="center">PeopleHub Frontend 🌐</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-19-red?style=for-the-badge&logo=angular" />
  <img src="https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/SCSS-CSS3-ff69b4?style=for-the-badge&logo=sass" />
  <img src="https://img.shields.io/badge/Responsive-Design-brightgreen?style=for-the-badge&logo=responsive-design" />
</p>

---
<h1 align="center">PeopleHub Frontend 🌐</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-19-red?style=for-the-badge&logo=angular" />
  <img src="https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/SCSS-CSS3-ff69b4?style=for-the-badge&logo=sass" />
  <img src="https://img.shields.io/badge/Responsive-Design-brightgreen?style=for-the-badge&logo=responsive-design" />
</p>

---

## 📌 Problem Statement

Managing employee information, authentication, and communication efficiently is a common challenge for organizations. Many existing tools are either too complex or lack seamless integration between frontend and backend systems. PeopleHub aims to solve this by providing a unified, scalable, and user-friendly Employee Management System that streamlines user interaction, authentication, session handling, and notifications — all integrated through a modern web application stack.

---

## 📚 Overview

**PeopleHub Frontend** is the front-facing web application built using **Angular 16+**, designed for efficient user interaction and seamless integration with the [PeopleHub Backend](https://github.com/abhisek247767/PeopleHub-Backend). This project features a responsive UI, clean architecture, and scalable component structure to support various features of PeopleHub.

---

## 🔗 Backend Repository

The backend for this project is available at:
👉 [PeopleHub-Backend (Node.js)](https://github.com/abhisek247767/PeopleHub-Backend)

---

## ✅ Prerequisites

Make sure you have the following installed on your machine:

* [Node.js](https://nodejs.org/) (v16 or higher)
* [Angular CLI](https://angular.io/cli) (v16 or higher)
* [Git](https://git-scm.com/)

---

## GSSOC-2025

<img width="1280" height="720" alt="image" src="https://github.com/user-attachments/assets/25f9f6e3-07e0-49bc-91f7-25d1ea11f6d3" />

## Hacktoberfest-2025

<img width="1382" height="682" alt="image" src="https://github.com/user-attachments/assets/a98704db-7458-4c62-b124-7c220e05550f" />

## 🚀 Project Setup

Follow the steps below to set up the project locally:

```bash
# 1. Clone the repository
git clone https://github.com/abhisek247767/PeopleHub-Frontend.git
cd PeopleHub-Frontend

# 2. Install dependencies
npm install --force

# 3. Run the development server
ng serve

# 4. Open the app in your browser
http://localhost:4200/
```

> ✅ Congratulations! You have successfully set up the frontend.

---

## 📁 Project Structure

```bash
PeopleHub-Frontend/
├── .vscode/
├── public/
├── src/
├── .dockerignore
├── .editorconfig
├── .gitignore
├── angular.json
├── dockerfile
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.spec.json

```

---

## 🔗 Frontend + Backend Integration Guide

To run the complete **PeopleHub System**, follow these steps.

### 1) Clone both repositories

```bash
# frontend
git clone https://github.com/abhisek247767/PeopleHub-Frontend.git

# backend (in a separate folder)
git clone https://github.com/abhisek247767/PeopleHub-Backend.git
```

---

### 2) Install dependencies

```bash
# Frontend
cd PeopleHub-Frontend
npm install --force

# Backend
cd ../PeopleHub-Backend
npm install
```

---

### 3) Configure environment variables

**Backend** (create a `.env` file inside `PeopleHub-Backend`):

```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
# Add any other env vars the backend requires (stripe keys, mailer config, etc.)
```

**Frontend (Angular)**: Angular doesn't read `.env` files by default — set the API base URL in `src/environments`.

Create / update `src/environments/environment.ts` (development):

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5000/api'
};
```

And `src/environments/environment.prod.ts` (production):

```ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://your-production-api.example.com/api'
};
```

> ⚠️ Important: If your frontend code expects a different key name (for example `API_BASE_URL`), adapt accordingly. Grep for `environment` or `apiBaseUrl` in the codebase to confirm.

---

### 4) Start the backend server

```bash
cd PeopleHub-Backend
# if package.json has start script
npm start
# OR, if there is a dev script (nodemon)
npm run dev
```

You should see logs like:

```
Server running on http://localhost:5000
Database connected successfully
```

If you get a MongoDB connection error, check your `MONGO_URI` and that MongoDB is running / accessible.

---

### 5) Start the frontend

```bash
cd PeopleHub-Frontend
ng serve --open
```

Open: `http://localhost:4200`

---

### 6) Verify integration

* Perform a signup/login flow in the frontend and open **Developer Tools → Network** to confirm requests are sent to `http://localhost:5000/api/...`.
* Check backend console to see incoming requests.
* Test a protected route (that requires JWT) to ensure auth flow works end-to-end.

---

## 🛠 Troubleshooting (common issues)

* **CORS errors**: Ensure backend allows `http://localhost:4200`. In Express, use `cors()` or configure allowed origins.
* **Wrong API URL**: Double-check `environment.apiBaseUrl` — a common mistake is missing `/api` prefix or wrong port.
* **Mongo connection fails**: Verify `MONGO_URI` and network access (Atlas whitelist or local Mongo running).
* **JWT / Auth errors**: Ensure `JWT_SECRET` matches what backend expects and tokens are stored/sent by frontend correctly.

---

## 📸 Screenshots (recommended)

Add screenshots to the repo (suggested folder: `docs/assets/`) and reference them here in README. Example images to include:

* `docs/assets/backend-running.png` → backend terminal showing server + DB connected
* `docs/assets/frontend-login-success.png` → browser showing successful login or user dashboard

How to add in README:

```md
![Backend running](docs/assets/backend-running.png)
![Frontend login success](docs/assets/frontend-login-success.png)
```

---

## ✅ Contribution Guidelines

* Create branches off of `origin/development`.
* Pull requests should target the `development` branch.
* Follow Angular best practices and project coding style.
* Add screenshots and update README when your change needs setup instructions.

---

## 📝 Suggested PR (when you submit this README update)

**Title:** `docs: Add backend integration steps & screenshots to README (#142)`

**Description:**

* Added step-by-step instructions to run the frontend + backend locally.
* Included environment variable examples for backend (`.env`) and frontend (`src/environments/environment.ts`).
* Added verification steps and common troubleshooting tips (CORS, MongoDB, JWT).
* Suggested screenshot locations and Markdown snippets to embed images.

**Notes:**

* Please replace placeholder values (`MONGO_URI`, `JWT_SECRET`, production API URL) with actual values before deploying.
* This PR addresses issue #142 (Improve README with backend integration steps and screenshots).

---

## ❤️ Support

If you like this project, **please give it a ⭐ and follow the author** — your support is highly appreciated and motivates further development!

---

## 📫 Author

**Abhisek Mahapatra**
📎 GitHub: [abhisek247767](https://github.com/abhisek247767)

---
👉 Now, go to backend repo for set up backend repository [PeopleHub-Backend (Node.js)](https://github.com/abhisek247767/PeopleHub-Backend)
