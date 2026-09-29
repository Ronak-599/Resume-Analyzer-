=======

# Smart Job Portal & ATS Resume Analyzer

An Enterprise-grade Full Stack Web Application featuring automated ATS resume parsing, intelligent skill extraction, weighted match scoring, candidate tracking, and recruiter analytics.

---

## 🌟 Tech Stack

### Backend

- **Java 21** / Spring Boot 3.3.4
- **Spring Security 6** with Stateless JWT (`io.jsonwebtoken 0.12.5`)
- **BCrypt** Password Hashing
- **Spring Data JPA** & **Hibernate ORM**
- **Apache PDFBox 3.0.3** (PDF Resume Text & Metadata Parsing)
- **Apache POI 5.3.0** (DOCX Resume Text & Metadata Parsing)
- **H2 Persistent Database** (Default zero-config out of the box)
- **MySQL Support** (Pre-configured via `application-mysql.properties`)

### Frontend

- **React 18** + **Vite**
- **React Router 6** (Role-guarded routes)
- **Axios** (Centralized JWT bearer interceptor)
- **Lucide React** (Modern clean iconography)
- **Canvas Confetti** (Celebration animations on high ATS matches)
- **Vanilla CSS Design System** (Glassmorphism, dark slate aesthetic, glowing badges, responsive layout)

---

## 🚀 Live Services & Endpoints

- **Frontend Application**: [http://localhost:5173/](http://localhost:5173/)
- **Backend REST API**: [http://localhost:8080/api](http://localhost:8080/api)
- **H2 Database Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
  - JDBC URL: `jdbc:h2:file:./data/jobportaldb;DB_CLOSE_DELAY=-1`
  - User: `sa` | Password: `password`

---

## 👤 Pre-Seeded Demo Accounts (Quick Demo Mode)

The frontend features a top bar with **1-Click Quick Demo Switching** to test all roles immediately:

| Role          | Name          | Email                    | Password       | Pre-seeded Data                                                          |
| ------------- | ------------- | ------------------------ | -------------- | ------------------------------------------------------------------------ |
| **Candidate** | Ronak Pawar   | `ronak@example.com`      | `candidate123` | Uploaded resume, skills parsed, active application with 83.3% ATS match  |
| **Recruiter** | Sarah Jenkins | `recruiter@techcorp.com` | `recruiter123` | 4 active job postings, applicant review pipeline, hiring analytics       |
| **Admin**     | System Admin  | `admin@jobportal.com`    | `admin123`     | User account management (enable/disable), job moderation, portal metrics |

---

## 🧠 ATS Scoring Formula & Engine (Module 4)

Formula:

```text
ATS Score = (Matched Skills / Required Skills) * 100
```

### Classification Hierarchy:

- **Score > 80%**: `Excellent Match` (High probability of shortlisting)
- **Score 60% - 80%**: `Good Match` (Solid alignment, minor skill gaps)
- **Score 40% - 60%**: `Average Match` (Moderate match, highlights project gaps)
- **Score < 40%**: `Poor Match` (Low skill alignment, advises acquiring prerequisites)

### Features:

1. **Multi-format extraction**: Parses `.pdf` and `.docx` using PDFBox and Apache POI.
2. **Taxonomy & Synonym Matching**: Recognizes 100+ industry skills (e.g. `Spring Boot`, `React`, `Docker`, `Kubernetes`, `Microservices`, `MySQL`, etc.) and normalizes variations (e.g. `SpringBoot` -> `Spring Boot`, `ReactJS` -> `React`).
3. **Skill Gap Analysis**: Separates matched keywords from missing keywords and provides actionable suggestions.

---

## 🛠️ How to Run Locally

### Prerequisites

- JDK 21+ installed
- Node.js 18+ and npm installed

### 1. Run Backend

```powershell
cd "d:\Java Fullstack\backend"
.\mvnw.cmd spring-boot:run
```

_(To switch to MySQL, start your MySQL instance and run with: `.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=mysql`)_

### 2. Run Frontend

```powershell
cd "d:\Java Fullstack\frontend"
npm install
npm run dev
```

Visit **http://localhost:5173/** in your browser.
