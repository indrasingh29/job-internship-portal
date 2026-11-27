# JobPortal — Jobs & Internships Discovery Platform

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application for discovering full-time tech jobs and internships, managing hiring pipelines, and tracking applications.

---

## Key Features

- **Public Discovery & Search:** Browse active jobs and internships with debounced keyword/company/skill search, location filtering, workplace mode (`Remote`, `Hybrid`, `Onsite`), job type, category, fresher eligibility, minimum salary/stipend filters, sorting, and pagination.
- **Company Directory:** Explore company profiles with active opening counts and industry filtering.
- **Role-Based Portals:**
  - **Student / Candidate:** Dashboard overview with live opportunities, application tracking, saved-job bookmarks, full profile & education editor, and account password management.
  - **Recruiter / Employer:** Create, edit, close/reopen, and delete job or internship postings, manage company profiles, review candidate profiles & resumes, update application statuses (`Applied`, `Shortlisted`, `Selected`, `Rejected`), and view pipeline analytics.
  - **Administrator:** Manage users (activate/deactivate/delete with cascade cleanup), moderate job postings, and inspect live API & database telemetry.
- **Authentication & Password Recovery:**
  - JWT authentication with `bcryptjs` password hashing and environment-configured secrets (`JWT_SECRET` required in production).
  - Complete **Forgot Password** and **Reset Password** flow using cryptographically random, SHA-256 hashed, single-use, time-limited tokens delivered via SMTP (`nodemailer`).
  - Authenticated **Change Password** flow verifying current password before updating.

---

## Repository Structure

```text
job-internship-portal/
├── client/                  # React + Vite + Tailwind CSS v4 frontend
│   ├── public/
│   │   └── _redirects       # Static SPA rewrite rule
│   └── src/
│       ├── components/      # Navbar, Footer, OpportunityCard, OpportunityDiscovery, CompanyCard, AccountSettingsPanel
│       ├── context/         # AuthContext (session, saved jobs synchronization, auth actions)
│       ├── pages/           # Home, Jobs, Internships, Companies, Auth, Forgot/Reset Password, Dashboards
│       └── services/        # Axios client with Bearer token injection and 401 handling
├── server/                  # Node.js + Express + Mongoose REST API
│   ├── src/
│   │   ├── config/          # MongoDB connection & JWT helpers
│   │   ├── controllers/     # Auth, Jobs, Companies, Applications, SavedJobs, Stats, Admin
│   │   ├── middleware/      # JWT protect, RBAC authorize, rate limiters, global error handler
│   │   ├── models/          # User, Company, Job, Application, SavedJob
│   │   ├── routes/          # Express route modules
│   │   ├── seed/            # Idempotent database seeder
│   │   └── utils/           # Email service, helpers, automated API verification suite
│   └── .env.example         # Backend environment variable reference
└── render.yaml              # Render infrastructure blueprint
```

---

## Environment Variables

### Backend (`server/.env`)

| Variable | Required | Description |
| :--- | :--- | :--- |
| `PORT` | No (default `5000`) | HTTP port for the Express server |
| `NODE_ENV` | Yes | `development`, `test`, or `production` |
| `MONGODB_URI` | Yes (production) | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes (production) | Secret used to sign and verify JWTs (no fallback in production) |
| `JWT_EXPIRES_IN` | No (default `7d`) | JWT expiration window |
| `CLIENT_URL` | Yes (production) | Frontend origin for CORS and password reset links |
| `ALLOW_IN_MEMORY_DB` | No | Set `false` in production; `true` allows local in-memory MongoDB for dev/test |
| `SMTP_HOST` | Yes (production) | SMTP server hostname for password reset emails |
| `SMTP_PORT` | No (default `587`) | SMTP port |
| `SMTP_SECURE` | No (default `false`) | Set `true` for TLS on port `465` |
| `SMTP_USER` | Yes (production) | SMTP username |
| `SMTP_PASS` | Yes (production) | SMTP password or app password |
| `EMAIL_FROM` | No | Sender address for transactional emails |

### Frontend (`client/.env`)

| Variable | Required | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | Yes | Backend API base URL (e.g. `http://localhost:5000/api` or `https://<api-service>.onrender.com/api`) |

---

## Local Development Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env   # On Windows PowerShell: copy .env.example .env
npm run seed           # Seeds initial companies, jobs, and demo accounts
npm test               # Runs automated API verification suite
npm run dev            # Starts API on http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env   # On Windows PowerShell: copy .env.example .env
npm run dev            # Starts Vite dev server on http://localhost:5173
```

---

## Render Deployment Notes

1. **Backend Web Service (`job-portal-api`):**
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Ensure `NODE_ENV=production`, `ALLOW_IN_MEMORY_DB=false`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, and SMTP variables are configured in Render Dashboard.
2. **Frontend Static Site (`job-portal-web`):**
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Set `VITE_API_URL` to your deployed backend `/api` URL.
   - **Important SPA Rewrite Rule:** In Render Dashboard -> Static Site -> **Redirects/Rewrites**, add a rule with Source `/*`, Destination `/index.html`, Action `Rewrite` (also defined in `render.yaml`) so direct page reloads on `/jobs`, `/login`, `/forgot-password`, and `/reset-password/:token` resolve properly.
