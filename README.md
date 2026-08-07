# 🚀 AI Resume Analyzer & Rewriter

An end-to-end full-stack web application powered by **Java 21, Spring Boot 3, Google Gemini AI, and React 18**.

---

## 🌟 Features

- 📄 **Resume PDF Upload**: Parses text using Apache PDFBox.
- 🎯 **ATS & Skill Match Scoring**: Real-time evaluation against target Job Description.
- ✍️ **AI Resume Rewriter**: Automatically rewrites your resume into an ATS-optimized, high-impact version.
- 📊 **Interactive Breakdown**: Scores for ATS, Skills, Experience, Formatting + Missing Skills report.
- 📜 **Analysis History**: Persisted in PostgreSQL.
- 🔐 **JWT Auth**: Secure user registration & authentication.

---

## 🛠️ Project Structure

```
D:\AI Resume Analyser\
├── backend/            # Spring Boot 3 + Java 21 REST API
│   ├── src/
│   ├── pom.xml
│   ├── Dockerfile
│   └── render.yaml     # Render free deployment config
└── frontend/           # React 18 + Vite + Tailwind CSS UI
    ├── src/
    ├── package.json
    └── vercel.json     # Vercel free deployment config
```

---

## 🚀 How to Run Locally

### 1. Backend Setup (Spring Boot)
1. Navigate to backend:
   ```bash
   cd "D:\AI Resume Analyser\backend"
   ```
2. Set your environment variables (or edit `src/main/resources/application.properties`):
   ```properties
   GEMINI_API_KEY=your-gemini-api-key
   DATABASE_URL=jdbc:postgresql://localhost:5432/resumeai
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=password
   ```
3. Run with Maven:
   ```bash
   mvn spring-boot:run
   ```
   Backend will run on `http://localhost:8080` (Swagger UI at `http://localhost:8080/swagger-ui.html`).

---

### 2. Frontend Setup (React)
1. Navigate to frontend:
   ```bash
   cd "D:\AI Resume Analyser\frontend"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`.

---

## ☁️ Deployment Guide (100% Free Tier)

### 1. Database — Neon.tech
1. Create a free account on [Neon.tech](https://neon.tech).
2. Create a database named `resumeai`.
3. Copy your connection URL (`jdbc:postgresql://...`).

### 2. Backend — Render.com
1. Create a free account on [Render.com](https://render.com).
2. Connect your GitHub repository containing the `/backend` folder.
3. Add environment variables:
   - `GEMINI_API_KEY`
   - `DATABASE_URL`
   - `DATABASE_USERNAME`
   - `DATABASE_PASSWORD`
   - `JWT_SECRET`

### 3. Frontend — Vercel.com
1. Import your `/frontend` directory to [Vercel.com](https://vercel.com).
2. Set Environment Variable: `VITE_API_URL=https://your-render-backend-url.onrender.com`
3. Deploy!
