# EduRisk MIS

A web-based Management Information System for tracking student dropout risk and surfacing learning equity gaps across socioeconomic groups. Built for schools and NGOs working toward UN SDG-4.

Live demo: [https://edurisk-mis.vercel.app](https://edurisk-mis-sharvil.vercel.app/)

---

## What it does

Schools often don't know a student is at risk of dropping out until it's too late. EduRisk MIS monitors attendance, grades, and engagement in real time, scores each student's dropout risk, and generates a personalized AI intervention plan — before the student falls through the cracks.

Beyond individual risk, the platform surfaces the bigger picture: how much worse Low SES students perform compared to their High SES peers, and what NGOs can do about it.

---

## Features

- **Risk Dashboard** — KPI cards, risk distribution chart, and attendance vs. grade scatter plot across the full cohort
- **Student Profiles** — Individual drawer with skill radar, 8-week trendline, subject grade breakdown, and 12-month attendance heatmap
- **AI Intervention Plans** — Personalized 6-section support plans generated in real time for each at-risk student
- **Equity Insights** — Side-by-side SES comparison with gap analysis and NGO intervention recommendations
- **Leaderboard** — Top performers ranked by grade, attendance, engagement, and risk score
- **CSV Import** — Upload student data directly from any school ERP export
- **Report Export** — Download a full student report for offline sharing with parents or field teams
- **Role-Based Access** — Admin, Teacher, NGO Analyst, and Student views with Supabase authentication
- **Dark / Light Mode** — Toggle from the sidebar

---

## Risk Algorithm

```
Risk Score = 100 − (0.5 × Attendance + 0.3 × AvgGrade + 0.2 × Engagement)
```

Attendance carries the most weight because it is the strongest single predictor of dropout in the literature. The score runs from 0 (no risk) to 100 (critical).

| Score | Status |
|---|---|
| Above 75 | Critical — immediate intervention |
| 50 to 75 | Warning — monitor and support |
| Below 50 | Stable — enrich and develop |

---

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Recharts
- Supabase (auth + PostgreSQL)
- Vercel (deployment)

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Sharvil1509/edurisk-mis.git
cd edurisk-mis

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your Supabase and Anthropic API keys in .env

# Start dev server
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Environment Variables

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
```

Never commit your `.env` file. It is already listed in `.gitignore`.

---

## Project Structure

```
src/
└── App.jsx        # All components and application logic
    main.jsx       # React entry point
    index.css      # Tailwind base styles
```

---

## SDG-4 Alignment

This project was built with UN Sustainable Development Goal 4 in mind — quality, inclusive, and equitable education for all. The equity gap analysis in particular is designed to give NGOs concrete data on where and how socioeconomic disadvantage is affecting student outcomes, so resources can be directed where they matter most.

---

## Research

An IEEE-format research paper documenting the system's methodology, risk algorithm, equity analysis, and experimental results is included in the repository.

---

Built by Sharvil Nikam · Pune, Maharashtra, India · 2025
