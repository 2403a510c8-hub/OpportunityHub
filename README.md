# 🚀 Opportunity Hub — Full-Stack Web Platform

**Opportunity Hub** is a modern, responsive web application connecting students, early-career developers, and researchers with top-tier internships, global hackathons, diversity scholarships, fellowships, and full-time entry roles.

---

## 🌟 Key Features & Modules

### 1. 🔍 Opportunity Discovery & Smart Filtering
- **Multi-Faceted Search**: Real-time keyword filtering across title, organization, tags, and description.
- **Categorical Filters**: Filter by Type (`Internship`, `Hackathon`, `Scholarship`, `Full-Time`, `Fellowship`), Category (`Engineering`, `Data & AI`, `Design`, `Business`), and Work Mode (`Remote`, `Hybrid`, `On-site`).
- **Flexible Sorting**: Sort by *Newest*, *Approaching Deadlines*, or *Popularity*.
- **View Modes**: Switch effortlessly between responsive **Grid View** and compact **List View**.

### 2. 📝 In-App Application Flow
- **Multi-Step Application Modal**: Submit applications with pre-filled candidate profile details, phone numbers, resume links (PDF/Drive), and custom statements of interest.
- **Duplicate Prevention**: Prevents duplicate applications for the same listing.
- **Instant Feedback**: Toast notifications and real-time applicant counter increments.

### 3. 🎯 Candidate Pipeline & Status Tracker
- **Stage Progression**: Track progress through `Submitted` ➔ `Under Review` ➔ `Interviewing` ➔ `Accepted` ➔ `Rejected`.
- **Saved Bookmarks**: 1-click bookmarking to save opportunities for later.

### 4. 🏢 Employer & Recruiter Dashboard
- **Publish Opportunities**: Create new listings with compensation, requirements, benefits, tags, and deadlines.
- **Candidate Review Board**: Review candidate profiles, resumes, and cover notes.
- **Real-Time Status Updater**: Update candidate stages with instant feedback.
- **Listing Management**: View applicant count, edit, or delete listings.

### 5. ⚡ 1-Click Fast Demo Role Switcher
- Seamlessly toggle between:
  - **Student View**: `Alex Rivera` (Stanford Senior, Full-Stack & ML)
  - **Recruiter View**: `Elena Vance` (University Talent Lead @ Stripe)

---

## 🏗️ Project Architecture

```
opportunity-hub/
├── README.md                      # Complete documentation & setup instructions
├── package.json                   # Root orchestrator scripts
├── start.bat                      # 1-Click Windows launch script
├── start.sh                       # 1-Click macOS / Linux launch script
│
├── backend/                       # REST API (Node.js & Express)
│   ├── .env.example               # Environment template
│   ├── server.js                  # Main server entry & route mounting
│   ├── package.json               # Backend dependencies
│   └── src/
│       ├── controllers/           # auth, opportunity, application, bookmark, stats
│       ├── db/
│       │   ├── database.js        # Self-contained zero-config JSON database engine
│       │   └── seedData.js        # 25+ realistic pre-seeded opportunities & profiles
│       ├── middleware/            # JWT auth, role validation & global error handlers
│       └── routes/                # Express API endpoints
│
└── frontend/                      # Client Web App (React 18 + Vite + Tailwind CSS)
    ├── index.html                 # HTML shell with Google Fonts
    ├── package.json               # Frontend dependencies
    ├── vite.config.js             # Vite config & API reverse proxy
    ├── tailwind.config.js         # Custom branding & typography
    └── src/
        ├── App.jsx                # Router & Global Context Provider wrapper
        ├── context/               # AuthContext & ToastContext
        ├── components/
        │   ├── common/            # Badge, Toast
        │   ├── layout/            # Navbar with notification drawer & Footer
        │   ├── opportunities/     # OpportunityCard, FilterSidebar, ApplyModal
        │   └── recruiter/         # PostOpportunityModal
        ├── pages/
        │   ├── HomePage.jsx       # Hero, stats, featured carousel & value props
        │   ├── OpportunitiesPage.jsx # Search & multi-filter dashboard
        │   ├── OpportunityDetailPage.jsx # Comprehensive listing view & similar picks
        │   ├── MyApplicationsPage.jsx # Candidate tracker & saved bookmarks
        │   ├── DashboardPage.jsx  # Recruiter postings & candidate reviewer
        │   ├── ProfilePage.jsx    # Candidate resume & skills profile editor
        │   └── LoginPage.jsx      # Login, registration & demo account switcher
        └── services/
            └── api.js             # API client with token injection & error handling
```

---

## 🚀 Quick Start (Ready to Run)

### Option A: 1-Click Scripts (Easiest)

- **On Windows**: Double-click `start.bat`
- **On macOS / Linux**: Run `./start.sh`

The script will automatically install dependencies (if not already installed) and launch both the backend API and frontend dev server.

---

### Option B: Manual Setup via Terminal

#### Step 1: Start the Backend API
```bash
cd backend
npm install
npm run dev
```
> The API will be live at `http://localhost:5000` (Health check: `http://localhost:5000/api/health`)

#### Step 2: Start the Frontend UI
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
> The web interface will open at `http://localhost:5173`

---

## 🔑 Pre-Configured Demo Accounts

You can log in instantly using the **Quick 1-Click Demo Evaluation** buttons on the login page or in the top navigation bar, or use these credentials:

| Role | Email | Password | Pre-seeded Content |
|---|---|---|---|
| **Student / Applicant** | `alex@example.com` | `password123` | 2 submitted applications, 2 saved bookmarks |
| **Recruiter / Employer** | `elena@stripe.com` | `password123` | Active Stripe postings with candidate applicants |

---

## 📡 REST API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new applicant or recruiter | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | No |
| `GET` | `/api/auth/me` | Fetch active user profile | Yes |
| `PUT` | `/api/auth/profile` | Update profile, bio, skills, resume URL | Yes |
| `GET` | `/api/opportunities` | Search & filter opportunities | No |
| `GET` | `/api/opportunities/featured` | Fetch top-picked opportunities | No |
| `GET` | `/api/opportunities/:id` | Fetch single opportunity + related | Optional |
| `POST` | `/api/opportunities` | Post a new opportunity listing | Recruiter / Admin |
| `PUT` | `/api/opportunities/:id` | Update opportunity listing | Recruiter / Admin |
| `DELETE` | `/api/opportunities/:id` | Delete opportunity listing | Recruiter / Admin |
| `POST` | `/api/applications` | Submit application to an opportunity | Applicant |
| `GET` | `/api/applications/my` | View my submitted applications | Applicant |
| `GET` | `/api/applications/opportunity/:id`| View applicants for a posting | Recruiter / Admin |
| `PATCH`| `/api/applications/:id/status`| Update candidate hiring status | Recruiter / Admin |
| `GET` | `/api/bookmarks` | Get saved opportunities | Applicant |
| `POST` | `/api/bookmarks/:id` | Toggle save/unsave bookmark | Applicant |
| `GET` | `/api/stats` | Platform analytics & metrics | No |

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, React Router v6
- **Backend**: Node.js, Express, JSON Database Engine with atomic persistence, JWT, BcryptJS, CORS
- **Typography & Styling**: Plus Jakarta Sans, Inter, Glassmorphism, Tailwind UI Design Tokens

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
