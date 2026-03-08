# 🎓 EduRisk MIS — Learning Equity & Student Risk Platform
### AI-Driven Management Information System | UN SDG-4 Aligned

---

## 🚀 Deploy to Vercel in 5 Minutes (Free)

### Step 1 — Upload to GitHub
1. Go to **github.com** → Sign in (or create free account)
2. Click **"New repository"** → name it `edurisk-mis` → click **Create**
3. Upload ALL these files by dragging them into GitHub's upload area
4. Click **"Commit changes"**

### Step 2 — Deploy on Vercel
1. Go to **vercel.com** → Sign in with GitHub (free)
2. Click **"Add New Project"**
3. Select your `edurisk-mis` repository
4. Vercel auto-detects Vite — just click **"Deploy"**
5. Wait ~60 seconds → 🎉 Your live link is ready!

### Step 3 — Add Claude API Key (for real AI plans)
1. In Vercel dashboard → go to your project → **Settings → Environment Variables**
2. Add: `VITE_ANTHROPIC_API_KEY` = your Claude API key
3. Redeploy (Vercel dashboard → Deployments → Redeploy)

> **Get a free API key:** console.anthropic.com → API Keys → Create Key
> Free tier gives you $5 credit — enough for hundreds of demo plans

---

## 💻 Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Create .env file with your API key
echo "VITE_ANTHROPIC_API_KEY=your_key_here" > .env

# 3. Start development server
npm run dev

# 4. Open browser at http://localhost:3000
```

---

## 📁 Project Structure

```
edurisk-mis/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          ← Main application (all components)
│   ├── main.jsx         ← React entry point
│   └── index.css        ← Tailwind + custom styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── vercel.json          ← SPA routing for Vercel
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏠 Landing Page | Professional hero page for judges/stakeholders |
| 🔐 Login System | Demo auth (any credentials work) |
| 📊 Dashboard | 4 KPI cards, Risk pie chart, Attendance scatter plot |
| 🔍 Smart Filters | Filter by Status, Grade Level, SES group |
| 📋 Student Table | Sortable risk heatmap with progress bars |
| 👤 Student Drawer | Radar chart, trendline, AI intervention plan |
| 🤖 Claude AI | Real-time streaming intervention plans per student |
| ⚖️ Equity Tab | Low vs High SES gap analysis + NGO recommendations |
| 📥 CSV Export | Download all student data instantly |

---

## 🧮 Risk Algorithm

```
Risk Score = 100 - (0.5 × Attendance + 0.3 × AvgGrade + 0.2 × Engagement)

Critical  → Risk Score > 75   (red)
Warning   → Risk Score 50–75  (amber)
Stable    → Risk Score < 50   (green)
```

---

## 🌍 SDG-4 Alignment

This platform directly supports **UN Sustainable Development Goal 4: Quality Education** by:
- Identifying at-risk students before they drop out
- Surfacing systemic socioeconomic inequities in education
- Generating AI-powered personalized intervention plans
- Providing NGOs with data-driven decision support

---

## 🏆 For Judges / Evaluators

**Demo login:** Any email + any password works  
**Key feature to demo:** Click any Critical student → watch Claude AI generate a live intervention plan  
**Equity story:** Switch to "Equity Insights" tab → show the SES performance gap data

---

Built with React 18 · Vite · Tailwind CSS · Recharts · Claude AI
