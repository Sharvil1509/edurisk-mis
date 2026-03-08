import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Users, AlertTriangle, Activity, Target, X, ChevronDown, Search,
  BarChart2, Shield, Brain, Zap, ArrowUpRight, ArrowDownRight,
  Minus, GraduationCap, Heart, Star, Eye, Download, LogOut,
  TrendingUp, TrendingDown, Sparkles, Globe, Award, ChevronRight,
  UserPlus, Trash2, Check, BookOpen, Sun, Moon, Upload,
  FileText, Trophy, Calendar, Bell, Camera
} from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, ReferenceLine, BarChart, Bar
} from "recharts";

// ─── SUPABASE ──────────────────────────────────────────────────────────────────
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ─── FONT LOADER ───────────────────────────────────────────────────────────────
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
  return null;
};

// ─── MOCK DATA ENGINE ──────────────────────────────────────────────────────────
const NAMES = [
  "Aisha Patel","Marcus Johnson","Priya Sharma","Diego Hernandez","Zara Ahmed",
  "Liam O'Brien","Fatima Al-Hassan","Noah Williams","Mei Chen","Carlos Rivera",
  "Sofia Okonkwo","James Nakamura","Amara Diallo","Ethan Park","Leila Moradi",
  "Samuel Asante","Isabella Cruz","Tariq Hassan","Yuna Kim","Benjamin Adeyemi",
  "Nadia Petrov","Omar Abdullah","Grace Kimani","Felix Wagner","Ananya Reddy",
  "Kwame Mensah","Valentina Rossi","Ravi Krishnan","Aaliyah Brown","Mateo Gomez",
  "Sasha Ivanova","Kofi Acheampong","Luna Martinez","Arjun Singh","Chloe Dupont",
  "Emmanuel Osei","Mia Tanaka","Darius Jefferson","Layla Mahmoud","Hugo Silva",
  "Amina Touré","Nico Andersson","Sana Mirza","Tobias Müller","Zoe Nkrumah",
  "Rafael Castillo","Hana Yamamoto","Elijah Thompson","Inés Vargas","Cyrus Farahani"
];
const GRADES = ["Grade 6","Grade 7","Grade 8","Grade 9","Grade 10"];
const SES_OPTS = ["Low","Medium","High"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

function useStudentData(importedStudents = null) {
  const mockStudents = useMemo(() => NAMES.map((name, i) => {
    const rand = seededRand(i * 997 + 42);
    const ses = SES_OPTS[Math.floor(rand() * 3)];
    const bias = ses === "High" ? 15 : ses === "Medium" ? 3 : -12;
    const attendance = Math.min(100, Math.max(28, 55 + bias + rand() * 40));
    const avgGrade = Math.min(100, Math.max(18, 50 + bias + rand() * 45));
    const engagement = Math.min(100, Math.max(18, 45 + bias + rand() * 50));
    const math = Math.min(100, Math.max(18, 48 + bias + rand() * 45));
    const science = Math.min(100, Math.max(18, 44 + bias + rand() * 48));
    const english = Math.min(100, Math.max(18, 46 + bias + rand() * 47));
    const history = Math.min(100, Math.max(18, 43 + bias + rand() * 46));
    const riskScore = Math.min(100, Math.max(0, 100 - (0.5 * attendance + 0.3 * avgGrade + 0.2 * engagement)));
    const status = riskScore > 75 ? "Critical" : riskScore > 50 ? "Warning" : "Stable";
    const grade = GRADES[Math.floor(rand() * GRADES.length)];
    const trend = rand() > 0.55 ? "improving" : rand() > 0.3 ? "declining" : "stable";
    const trendData = Array.from({ length: 8 }, (_, w) => ({
      week: `W${w + 1}`,
      score: Math.min(100, Math.max(0, riskScore + (trend === "improving" ? (7 - w) * 2.5 : trend === "declining" ? -(7 - w) * 2.5 : 0) + (rand() - 0.5) * 8))
    }));
    // Attendance calendar - 12 months
    const attendanceCalendar = MONTHS.map(month => ({
      month,
      rate: Math.min(100, Math.max(0, attendance + (rand() - 0.5) * 20))
    }));
    // Subject grades
    const subjectGrades = [
      { subject: "Math", grade: Math.round(math) },
      { subject: "Science", grade: Math.round(science) },
      { subject: "English", grade: Math.round(english) },
      { subject: "History", grade: Math.round(history) },
      { subject: "Avg Grade", grade: Math.round(avgGrade) },
    ];
    // Avatar color
    const avatarColors = ["from-indigo-500 to-purple-600","from-pink-500 to-rose-600","from-emerald-500 to-teal-600","from-amber-500 to-orange-600","from-blue-500 to-cyan-600"];
    const avatarColor = avatarColors[i % avatarColors.length];
    return {
      id: i + 1, name, grade, ses,
      attendance: Math.round(attendance), avgGrade: Math.round(avgGrade),
      engagement: Math.round(engagement), math: Math.round(math),
      science: Math.round(science), english: Math.round(english),
      history: Math.round(history), riskScore: Math.round(riskScore),
      status, trend, trendData, attendanceCalendar, subjectGrades, avatarColor,
      avatar: null
    };
  }), []);
  return importedStudents || mockStudents;
}

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────
const SC = {
  Critical: { color: "#ef4444", bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30", dot: "bg-red-400" },
  Warning: { color: "#f59e0b", bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30", dot: "bg-amber-400" },
  Stable: { color: "#22c55e", bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", dot: "bg-emerald-400" },
};
const PIE_COLORS = ["#ef4444", "#f59e0b", "#22c55e"];
const ROLE_CONFIG = {
  admin: { label: "Admin", color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/30" },
  teacher: { label: "Teacher", color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/30" },
  ngo: { label: "NGO Analyst", color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/30" },
  student: { label: "Student", color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/30" },
};

// ─── THEME CONTEXT ─────────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(true);
  const toggle = () => setDark(d => !d);
  return { dark, toggle };
}

// ─── AI PLAN ──────────────────────────────────────────────────────────────────
function generateDetailedPlan(name, s) {
  const weak = s.math < s.science ? "Math" : "Science";
  const strong = s.math >= s.science ? "Math" : "Science";
  const ses = s.ses; const status = s.status;
  return `**1. RISK ASSESSMENT SUMMARY**\n${name} is classified as ${status} with a risk score of ${s.riskScore}/100. ${status === "Critical" ? `Immediate intervention required. Attendance at ${s.attendance}% and grade average of ${s.avgGrade}% indicate serious academic distress.` : status === "Warning" ? `Proactive support needed. ${name} is struggling in consistency and engagement.` : `${name} is performing well. Focus on sustaining and enriching the academic journey.`}\n\n**2. ROOT CAUSE ANALYSIS**\n${s.attendance < 70 ? `• Critical attendance gap (${s.attendance}%) — likely due to ${ses === "Low" ? "economic pressure or transport barriers" : "disengagement"}\n` : ""}${s.avgGrade < 55 ? `• Below-average grades (${s.avgGrade}%) — needs support in ${weak}\n` : ""}${s.engagement < 50 ? `• Low engagement (${s.engagement}%) — student may feel disconnected\n` : ""}${ses === "Low" ? "• Low SES background adds systemic barriers\n" : ""}\n**3. IMMEDIATE ACTIONS (Week 1–2)**\n${status === "Critical" ? `• Emergency counselor meeting within 48 hours\n• Guardian notification\n• Assign peer mentor\n• Daily attendance monitoring` : status === "Warning" ? `• Bi-weekly teacher check-ins\n• After-school study group enrollment\n• Progress report to family` : `• Nominate for advanced learning track\n• Assign as peer mentor\n• Explore scholarships`}\n\n**4. ACADEMIC RECOVERY PLAN**\n• Focus: ${weak} (score: ${s.math < s.science ? s.math : s.science}%)\n• Leverage strength: ${strong} (score: ${s.math >= s.science ? s.math : s.science}%)\n• ${status === "Critical" ? "3x weekly remedial tutoring" : "2x weekly enrichment sessions"}\n\n**5. SUCCESS TARGETS**\n• Attendance: ${Math.min(100, s.attendance + 15)}% in 60 days\n• Grade: ${Math.min(100, s.avgGrade + 10)}% in 90 days\n• Risk score below ${Math.max(0, s.riskScore - 20)} in 3 months\n\n**6. EQUITY NOTE**\n${ses === "Low" ? `${name} faces systemic barriers. Priority candidate for NGO support programs and scholarships.` : `${name} has access to resources. Focus on maximizing potential.`}`;
}

function useAIPlan() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const generate = useCallback((student) => {
    setText(""); setLoading(true);
    const plan = generateDetailedPlan(student.name.split(" ")[0], student);
    let i = 0;
    const interval = setInterval(() => {
      if (i < plan.length) { setText(plan.slice(0, i + 2)); i += 2; }
      else { clearInterval(interval); setLoading(false); }
    }, 8);
  }, []);
  return { text, loading, generate, reset: () => setText("") };
}

// ─── SMALL COMPONENTS ──────────────────────────────────────────────────────────
function RiskBadge({ status }) {
  const c = SC[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
      {status}
    </span>
  );
}

function ProgressBar({ value, color = "bg-indigo-500" }) {
  return (
    <div className="w-full bg-slate-700/60 rounded-full h-1.5">
      <div className={`${color} h-1.5 rounded-full transition-all duration-700`} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

function TrendIcon({ trend }) {
  if (trend === "improving") return <span className="flex items-center gap-1 text-emerald-400 text-xs"><TrendingUp size={12} /> Improving</span>;
  if (trend === "declining") return <span className="flex items-center gap-1 text-red-400 text-xs"><TrendingDown size={12} /> Declining</span>;
  return <span className="flex items-center gap-1 text-slate-400 text-xs"><Minus size={12} /> Stable</span>;
}

function KPICard({ icon: Icon, label, value, sub, color, trend, dark }) {
  return (
    <div className={`relative overflow-hidden rounded-xl border p-5 flex flex-col gap-3 hover:border-white/20 transition-all duration-300 ${dark ? "border-white/8 bg-slate-800/60" : "border-slate-200 bg-white shadow-sm"}`}>
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg ${color}`}><Icon size={17} className="text-white" /></div>
        {trend !== undefined && (
          <span className={`text-xs font-medium flex items-center gap-1 ${trend >= 0 ? "text-emerald-500" : "text-red-500"}`}>
            {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <div className={`text-2xl font-bold tracking-tight ${dark ? "text-white" : "text-slate-800"}`}>{value}</div>
        <div className={`text-xs mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>{label}</div>
      </div>
      {sub && <div className={`text-xs border-t pt-2 ${dark ? "text-slate-500 border-white/8" : "text-slate-400 border-slate-100"}`}>{sub}</div>}
      <div className={`absolute inset-x-0 bottom-0 h-0.5 ${color} opacity-70`} />
    </div>
  );
}

// ─── AVATAR COMPONENT ──────────────────────────────────────────────────────────
function Avatar({ student, size = "sm" }) {
  const dims = size === "sm" ? "w-7 h-7 text-xs" : size === "md" ? "w-10 h-10 text-sm" : "w-14 h-14 text-base";
  if (student.avatar) {
    return <img src={student.avatar} className={`${dims} rounded-full object-cover border-2 border-indigo-500/30`} alt={student.name} />;
  }
  return (
    <div className={`${dims} rounded-full bg-gradient-to-br ${student.avatarColor} flex items-center justify-center font-bold text-white border border-white/10`}>
      {student.name.split(" ").map(n => n[0]).join("")}
    </div>
  );
}

// ─── PDF EXPORT ────────────────────────────────────────────────────────────────
function exportStudentPDF(student) {
  const plan = generateDetailedPlan(student.name.split(" ")[0], student);
  const content = `
EduRisk MIS — Student Risk Report
=====================================
Generated: ${new Date().toLocaleDateString()}
Platform: EduRisk MIS | SDG-4 Aligned

STUDENT PROFILE
---------------
Name: ${student.name}
Grade: ${student.grade}
SES: ${student.ses}
Risk Status: ${student.status}
Risk Score: ${student.riskScore}/100
Trend: ${student.trend}

ACADEMIC METRICS
----------------
Attendance:  ${student.attendance}%
Avg Grade:   ${student.avgGrade}%
Engagement:  ${student.engagement}%
Math:        ${student.math}%
Science:     ${student.science}%
English:     ${student.english}%
History:     ${student.history}%

AI INTERVENTION PLAN
--------------------
${plan.replace(/\*\*/g, "").replace(/•/g, "  •")}

=====================================
© 2025 EduRisk MIS | AI-Powered Education Analytics
  `;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `EduRisk_${student.name.replace(/ /g, "_")}_Report.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportCSV(students) {
  const headers = ["Name", "Grade", "SES", "Attendance", "AvgGrade", "Engagement", "Math", "Science", "English", "History", "RiskScore", "Status", "Trend"];
  const rows = students.map(s => [s.name, s.grade, s.ses, s.attendance, s.avgGrade, s.engagement, s.math, s.science, s.english, s.history, s.riskScore, s.status, s.trend]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "EduRisk_Students.csv"; a.click();
  URL.revokeObjectURL(url);
}

// ─── CSV IMPORT ────────────────────────────────────────────────────────────────
function CSVImportModal({ onImport, onClose, dark }) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const lines = ev.target.result.split("\n").filter(l => l.trim());
        const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
        const students = lines.slice(1).map((line, i) => {
          const vals = line.split(",");
          const get = (key, fallback) => {
            const idx = headers.indexOf(key);
            return idx >= 0 ? vals[idx]?.trim() : fallback;
          };
          const attendance = parseFloat(get("attendance", 70));
          const avgGrade = parseFloat(get("avggrade", 65));
          const engagement = parseFloat(get("engagement", 60));
          const math = parseFloat(get("math", 65));
          const science = parseFloat(get("science", 65));
          const english = parseFloat(get("english", 65));
          const history = parseFloat(get("history", 65));
          const riskScore = Math.min(100, Math.max(0, 100 - (0.5 * attendance + 0.3 * avgGrade + 0.2 * engagement)));
          const status = riskScore > 75 ? "Critical" : riskScore > 50 ? "Warning" : "Stable";
          const trend = "stable";
          const trendData = Array.from({ length: 8 }, (_, w) => ({ week: `W${w + 1}`, score: riskScore }));
          const attendanceCalendar = MONTHS.map(month => ({ month, rate: attendance }));
          const subjectGrades = [
            { subject: "Math", grade: Math.round(math) },
            { subject: "Science", grade: Math.round(science) },
            { subject: "English", grade: Math.round(english) },
            { subject: "History", grade: Math.round(history) },
            { subject: "Avg Grade", grade: Math.round(avgGrade) },
          ];
          const avatarColors = ["from-indigo-500 to-purple-600", "from-pink-500 to-rose-600", "from-emerald-500 to-teal-600", "from-amber-500 to-orange-600"];
          return {
            id: i + 1,
            name: get("name", `Student ${i + 1}`),
            grade: get("grade", "Grade 6"),
            ses: get("ses", "Medium"),
            attendance: Math.round(attendance), avgGrade: Math.round(avgGrade),
            engagement: Math.round(engagement), math: Math.round(math),
            science: Math.round(science), english: Math.round(english),
            history: Math.round(history), riskScore: Math.round(riskScore),
            status, trend, trendData, attendanceCalendar, subjectGrades,
            avatarColor: avatarColors[i % avatarColors.length], avatar: null
          };
        });
        setPreview(students);
        setError("");
      } catch (e) { setError("Could not parse CSV. Check format."); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${dark ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-bold text-base ${dark ? "text-white" : "text-slate-800"}`}>Import Students from CSV</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg"><X size={15} className="text-slate-400" /></button>
        </div>
        <div className={`border-2 border-dashed rounded-xl p-6 text-center mb-4 ${dark ? "border-white/10 hover:border-indigo-500/50" : "border-slate-200 hover:border-indigo-300"} transition-colors`}>
          <Upload size={24} className="text-indigo-400 mx-auto mb-2" />
          <p className={`text-sm mb-2 ${dark ? "text-slate-300" : "text-slate-600"}`}>Drop your CSV file here or click to browse</p>
          <p className={`text-xs mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>Required columns: name, grade, ses, attendance, avggrade, engagement</p>
          <input type="file" accept=".csv" onChange={handleFile} className="hidden" id="csv-upload" />
          <label htmlFor="csv-upload" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors">Choose File</label>
        </div>
        {error && <div className="bg-red-500/15 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg mb-3">{error}</div>}
        {preview && (
          <div>
            <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-lg mb-3">
              ✅ {preview.length} students parsed successfully!
            </div>
            <div className={`text-xs rounded-lg p-3 mb-4 max-h-32 overflow-y-auto ${dark ? "bg-slate-800 text-slate-300" : "bg-slate-50 text-slate-600"}`}>
              {preview.slice(0, 5).map(s => <div key={s.id}>{s.name} — {s.grade} — Risk: {s.riskScore} ({s.status})</div>)}
              {preview.length > 5 && <div className="text-slate-500">...and {preview.length - 5} more</div>}
            </div>
            <button onClick={() => { onImport(preview); onClose(); }} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
              Import {preview.length} Students
            </button>
          </div>
        )}
        <div className={`mt-3 text-xs ${dark ? "text-slate-600" : "text-slate-400"}`}>
          💡 Tip: Export the current data as CSV, edit it in Excel, then re-import!
        </div>
      </div>
    </div>
  );
}

// ─── ATTENDANCE HEATMAP ────────────────────────────────────────────────────────
function AttendanceHeatmap({ data, dark }) {
  return (
    <div className={`rounded-xl border p-4 ${dark ? "bg-slate-800/40 border-white/8" : "bg-white border-slate-200"}`}>
      <h3 className={`text-xs font-semibold mb-3 flex items-center gap-2 ${dark ? "text-white" : "text-slate-700"}`}>
        <Calendar size={13} className="text-indigo-400" /> Attendance Heatmap (12 Months)
      </h3>
      <div className="grid grid-cols-12 gap-1.5">
        {data.map((d, i) => {
          const rate = d.rate;
          const bg = rate >= 90 ? "bg-emerald-500" : rate >= 75 ? "bg-emerald-400/70" : rate >= 60 ? "bg-amber-500/70" : "bg-red-500/70";
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-full h-8 rounded ${bg} flex items-center justify-center text-white font-bold text-xs`} title={`${d.month}: ${Math.round(d.rate)}%`}>
                {Math.round(d.rate)}
              </div>
              <span className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>{d.month}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-3 justify-end">
        {[{ color: "bg-emerald-500", label: "≥90%" }, { color: "bg-amber-500/70", label: "60-75%" }, { color: "bg-red-500/70", label: "<60%" }].map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded ${l.color}`} />
            <span className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── GRADE TREND CHART ─────────────────────────────────────────────────────────
function GradeTrendChart({ data, dark }) {
  const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ec4899", "#06b6d4"];
  return (
    <div className={`rounded-xl border p-4 ${dark ? "bg-slate-800/40 border-white/8" : "bg-white border-slate-200"}`}>
      <h3 className={`text-xs font-semibold mb-3 flex items-center gap-2 ${dark ? "text-white" : "text-slate-700"}`}>
        <BarChart2 size={13} className="text-indigo-400" /> Grade by Subject
      </h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e293b" : "#f1f5f9"} />
          <XAxis dataKey="subject" tick={{ fill: dark ? "#64748b" : "#94a3b8", fontSize: 10 }} />
          <YAxis domain={[0, 100]} tick={{ fill: dark ? "#64748b" : "#94a3b8", fontSize: 10 }} />
          <Tooltip contentStyle={{ background: dark ? "#0f172a" : "#fff", border: `1px solid ${dark ? "#1e293b" : "#e2e8f0"}`, borderRadius: 8, color: dark ? "#e2e8f0" : "#1e293b", fontSize: 11 }} />
          {data.map((entry, i) => (
            <Bar key={entry.subject} dataKey="grade" fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── LEADERBOARD TAB ───────────────────────────────────────────────────────────
function LeaderboardTab({ students, dark }) {
  const [category, setCategory] = useState("avgGrade");
  const categories = [
    { key: "avgGrade", label: "Top Grades" },
    { key: "attendance", label: "Best Attendance" },
    { key: "engagement", label: "Most Engaged" },
    { key: "riskScore", label: "Lowest Risk", reverse: true },
  ];
  const cat = categories.find(c => c.key === category);
  const sorted = [...students].sort((a, b) => cat.reverse ? a[category] - b[category] : b[category] - a[category]).slice(0, 10);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 flex-wrap">
        <Trophy size={18} className="text-amber-400" />
        <h2 className={`font-bold text-base ${dark ? "text-white" : "text-slate-800"}`}>Student Leaderboard</h2>
        <div className="flex gap-2 ml-auto flex-wrap">
          {categories.map(c => (
            <button key={c.key} onClick={() => setCategory(c.key)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${category === c.key ? "bg-indigo-600 border-indigo-500 text-white" : dark ? "border-white/10 text-slate-400 hover:border-white/20" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <div className={`rounded-xl border overflow-hidden ${dark ? "bg-slate-800/30 border-white/8" : "bg-white border-slate-200"}`}>
        {sorted.map((s, i) => (
          <div key={s.id} className={`flex items-center gap-4 px-5 py-4 border-b transition-colors ${dark ? "border-white/5 hover:bg-white/5" : "border-slate-100 hover:bg-slate-50"}`}>
            <div className="w-8 text-center text-lg font-bold">
              {i < 3 ? medals[i] : <span className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>#{i + 1}</span>}
            </div>
            <Avatar student={s} size="md" />
            <div className="flex-1">
              <div className={`font-semibold text-sm ${dark ? "text-white" : "text-slate-800"}`}>{s.name}</div>
              <div className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{s.grade} · {s.ses} SES</div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-black ${i === 0 ? "text-amber-400" : i === 1 ? "text-slate-300" : i === 2 ? "text-amber-600" : dark ? "text-slate-300" : "text-slate-600"}`}>
                {cat.reverse ? s[category] : s[category]}
                <span className="text-xs font-normal text-slate-500 ml-0.5">{cat.reverse ? "" : "%"}</span>
              </div>
              <div className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>{cat.label.replace("Top ", "").replace("Best ", "").replace("Most ", "").replace("Lowest ", "")}</div>
            </div>
            <RiskBadge status={s.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STUDENT DRAWER ────────────────────────────────────────────────────────────
function StudentDrawer({ student, onClose, dark, onAvatarUpdate }) {
  const { text, loading, generate, reset } = useAIPlan();
  const c = SC[student.status];
  const fileRef = useRef();
  useEffect(() => { generate(student); return () => reset(); }, [student.id]);

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onAvatarUpdate(student.id, ev.target.result);
    reader.readAsDataURL(file);
  };

  const radarData = [
    { subject: "Math", A: student.math },
    { subject: "Science", A: student.science },
    { subject: "Attendance", A: student.attendance },
    { subject: "Engagement", A: student.engagement },
    { subject: "Grade", A: student.avgGrade },
  ];

  const formatPlan = (raw) => raw.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) return <div key={i} className="text-indigo-300 font-bold text-xs mt-3 mb-1 uppercase tracking-wider">{line.replace(/\*\*/g, "")}</div>;
    if (line.match(/\*\*(.*?)\*\*/)) { const parts = line.split(/\*\*(.*?)\*\*/); return <div key={i} className="text-slate-300 text-xs leading-relaxed">{parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-white">{p}</strong> : p)}</div>; }
    if (line.startsWith("• ")) return <div key={i} className="text-slate-300 text-xs leading-relaxed pl-2">{line}</div>;
    if (line.trim() === "") return <div key={i} className="h-1" />;
    return <div key={i} className="text-slate-300 text-xs leading-relaxed">{line}</div>;
  });

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`w-full max-w-xl flex flex-col overflow-y-auto shadow-2xl ${dark ? "bg-slate-900 border-l border-white/10" : "bg-white border-l border-slate-200"}`}>
        {/* Header */}
        <div className={`flex items-start justify-between p-5 border-b sticky top-0 z-10 ${dark ? "bg-slate-900 border-white/10" : "bg-white border-slate-100"}`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar student={student} size="md" />
              <button onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-500 transition-colors">
                <Camera size={9} className="text-white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </div>
            <div>
              <h2 className={`text-base font-bold ${dark ? "text-white" : "text-slate-800"}`}>{student.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{student.grade}</span>
                <span className="text-slate-400">·</span>
                <span className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>SES: {student.ses}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RiskBadge status={student.status} />
            <button onClick={() => exportStudentPDF(student)} className="p-2 hover:bg-indigo-500/20 rounded-lg transition-colors" title="Export Report">
              <Download size={14} className="text-indigo-400" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X size={14} className={dark ? "text-slate-400" : "text-slate-500"} /></button>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Risk Score */}
          <div className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-700"}`}>Risk Score</span>
              <span className={`text-2xl font-black ${c.text}`}>{student.riskScore}</span>
            </div>
            <ProgressBar value={student.riskScore} color={student.status === "Critical" ? "bg-red-500" : student.status === "Warning" ? "bg-amber-500" : "bg-emerald-500"} />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-500">0 — Safe</span>
              <TrendIcon trend={student.trend} />
              <span className="text-xs text-slate-500">100 — Critical</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3">
            {[{ label: "Attendance", value: student.attendance, icon: Activity }, { label: "Avg Grade", value: student.avgGrade, icon: GraduationCap }, { label: "Engagement", value: student.engagement, icon: Heart }].map(m => (
              <div key={m.label} className={`rounded-xl p-3 text-center border ${dark ? "bg-slate-800/60 border-white/8" : "bg-slate-50 border-slate-200"}`}>
                <m.icon size={13} className="text-indigo-400 mx-auto mb-1.5" />
                <div className={`text-xl font-bold ${dark ? "text-white" : "text-slate-800"}`}>{m.value}%</div>
                <div className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Radar */}
          <div className={`rounded-xl border p-4 ${dark ? "bg-slate-800/40 border-white/8" : "bg-white border-slate-200"}`}>
            <h3 className={`text-xs font-semibold mb-3 flex items-center gap-2 ${dark ? "text-white" : "text-slate-700"}`}><Brain size={13} className="text-indigo-400" /> Skill Radar</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={dark ? "#334155" : "#e2e8f0"} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: dark ? "#94a3b8" : "#64748b", fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.22} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Grade by Subject */}
          <GradeTrendChart data={student.subjectGrades} dark={dark} />

          {/* Attendance Heatmap */}
          <AttendanceHeatmap data={student.attendanceCalendar} dark={dark} />

          {/* Trendline */}
          <div className={`rounded-xl border p-4 ${dark ? "bg-slate-800/40 border-white/8" : "bg-white border-slate-200"}`}>
            <h3 className={`text-xs font-semibold mb-3 flex items-center gap-2 ${dark ? "text-white" : "text-slate-700"}`}><TrendingUp size={13} className="text-indigo-400" /> 8-Week Risk Trendline</h3>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={student.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e293b" : "#f1f5f9"} />
                <XAxis dataKey="week" tick={{ fill: dark ? "#64748b" : "#94a3b8", fontSize: 9 }} />
                <YAxis domain={[0, 100]} tick={{ fill: dark ? "#64748b" : "#94a3b8", fontSize: 9 }} />
                <Tooltip contentStyle={{ background: dark ? "#0f172a" : "#fff", border: `1px solid ${dark ? "#1e293b" : "#e2e8f0"}`, borderRadius: 8, fontSize: 11 }} />
                <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="4 2" strokeOpacity={0.5} />
                <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="4 2" strokeOpacity={0.5} />
                <Line type="monotone" dataKey="score" stroke={c.color} strokeWidth={2.5} dot={{ r: 3, fill: c.color }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AI Plan */}
          <div className={`rounded-xl border border-indigo-500/30 p-4 ${dark ? "bg-slate-800/40" : "bg-indigo-50/50"}`}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={13} className="text-indigo-400" />
              <h3 className={`text-xs font-semibold ${dark ? "text-white" : "text-slate-700"}`}>AI Intervention Plan</h3>
              <span className="ml-auto text-xs text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded-full border border-indigo-500/30 flex items-center gap-1">
                <Zap size={9} /> AI {loading && <span className="animate-pulse">· generating...</span>}
              </span>
            </div>
            <div className={`rounded-lg p-3 max-h-72 overflow-y-auto ${dark ? "bg-slate-900/60" : "bg-white"}`}>
              {loading && !text && <div className="flex items-center gap-2 text-indigo-400 text-xs"><div className="flex gap-1">{[0,1,2].map(i=><div key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}</div>Generating...</div>}
              {text ? formatPlan(text) : null}
              {loading && text && <span className="inline-block w-1.5 h-3.5 bg-indigo-400 animate-pulse ml-0.5 align-middle" />}
            </div>
            {!loading && <button onClick={() => generate(student)} className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><Zap size={11} /> Regenerate</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EQUITY TAB ────────────────────────────────────────────────────────────────
function EquityTab({ students, dark }) {
  const data = useMemo(() => {
    const groups = { Low: [], Medium: [], High: [] };
    students.forEach(s => groups[s.ses].push(s));
    return Object.entries(groups).map(([ses, group]) => ({
      ses, count: group.length,
      avgGrade: Math.round(group.reduce((a, s) => a + s.avgGrade, 0) / group.length),
      avgAttendance: Math.round(group.reduce((a, s) => a + s.attendance, 0) / group.length),
      avgEngagement: Math.round(group.reduce((a, s) => a + s.engagement, 0) / group.length),
      avgRisk: Math.round(group.reduce((a, s) => a + s.riskScore, 0) / group.length),
      criticalPct: Math.round(group.filter(s => s.status === "Critical").length / group.length * 100),
    }));
  }, [students]);
  const low = data.find(d => d.ses === "Low") || {};
  const high = data.find(d => d.ses === "High") || {};
  const med = data.find(d => d.ses === "Medium") || {};

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-semibold text-amber-300">Systemic Equity Gap Detected</div>
          <div className="text-xs text-amber-400/70 mt-1">Low SES students score <strong>{high.avgGrade - low.avgGrade} points below</strong> High SES peers. Critical-risk rate is <strong>{low.criticalPct}%</strong> vs <strong>{high.criticalPct}%</strong> for High SES.</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {data.map(d => (
          <div key={d.ses} className={`rounded-xl border p-5 ${d.ses === "Low" ? "border-red-500/30 bg-red-500/5" : d.ses === "High" ? "border-emerald-500/30 bg-emerald-500/5" : dark ? "border-white/8 bg-slate-800/30" : "border-slate-200 bg-white"}`}>
            <div className="flex items-center justify-between mb-4">
              <div><div className={`font-bold ${dark ? "text-white" : "text-slate-800"}`}>{d.ses} SES</div><div className="text-xs text-slate-500">{d.count} students</div></div>
              <div className={`text-2xl font-black ${d.ses === "Low" ? "text-red-400" : d.ses === "High" ? "text-emerald-400" : "text-slate-300"}`}>{d.avgRisk}</div>
            </div>
            {[{ label: "Avg Grade", value: d.avgGrade, color: "bg-indigo-500" }, { label: "Attendance", value: d.avgAttendance, color: "bg-blue-500" }, { label: "Engagement", value: d.avgEngagement, color: "bg-purple-500" }].map(m => (
              <div key={m.label} className="mb-3">
                <div className="flex justify-between text-xs mb-1"><span className={dark ? "text-slate-400" : "text-slate-500"}>{m.label}</span><span className={dark ? "text-white" : "text-slate-700"} >{m.value}%</span></div>
                <ProgressBar value={m.value} color={m.color} />
              </div>
            ))}
            <div className={`mt-3 pt-3 border-t flex justify-between text-xs ${dark ? "border-white/8" : "border-slate-100"}`}>
              <span className={dark ? "text-slate-500" : "text-slate-400"}>Critical Rate</span>
              <span className={`font-bold ${d.ses === "Low" ? "text-red-400" : "text-emerald-400"}`}>{d.criticalPct}%</span>
            </div>
          </div>
        ))}
      </div>
      <div className={`rounded-xl border p-5 ${dark ? "bg-slate-800/40 border-white/8" : "bg-white border-slate-200"}`}>
        <h2 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${dark ? "text-white" : "text-slate-700"}`}><Shield size={13} className="text-indigo-400" /> Performance Gap</h2>
        <div className="grid grid-cols-3 gap-6">
          {[{ metric: "Avg Grade", High: high.avgGrade, Medium: med.avgGrade, Low: low.avgGrade }, { metric: "Attendance", High: high.avgAttendance, Medium: med.avgAttendance, Low: low.avgAttendance }, { metric: "Engagement", High: high.avgEngagement, Medium: med.avgEngagement, Low: low.avgEngagement }].map(item => (
            <div key={item.metric}>
              <div className={`text-xs mb-3 font-semibold ${dark ? "text-slate-400" : "text-slate-600"}`}>{item.metric}</div>
              {[{ label: "High", value: item.High, color: "bg-emerald-500" }, { label: "Medium", value: item.Medium, color: "bg-blue-500" }, { label: "Low", value: item.Low, color: "bg-red-500" }].map(g => (
                <div key={g.label} className="mb-2.5">
                  <div className="flex justify-between text-xs mb-1"><span className={dark ? "text-slate-500" : "text-slate-400"}>{g.label}</span><span className={dark ? "text-slate-300" : "text-slate-600"}>{g.value}%</span></div>
                  <ProgressBar value={g.value} color={g.color} />
                </div>
              ))}
              <div className="text-xs text-amber-400 mt-2 border-t border-white/8 pt-2">Gap: {item.High - item.Low} pts</div>
            </div>
          ))}
        </div>
      </div>
      <div className={`rounded-xl border p-5 ${dark ? "bg-slate-800/40 border-white/8" : "bg-white border-slate-200"}`}>
        <h2 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${dark ? "text-white" : "text-slate-700"}`}><Star size={13} className="text-indigo-400" /> NGO Recommendations</h2>
        <div className="grid grid-cols-2 gap-3">
          {[{ icon: "💰", title: "Conditional Cash Transfers", desc: "Attendance-linked financial support for Low SES families.", priority: "High" }, { icon: "📱", title: "Digital Inclusion", desc: "Devices and internet connectivity for Low SES students.", priority: "High" }, { icon: "🤝", title: "Peer Tutoring Network", desc: "Match Stable students with Critical/Warning peers.", priority: "Medium" }, { icon: "🥗", title: "School Nutrition Program", desc: "Proven to improve attendance by up to 22%.", priority: "High" }].map(r => (
            <div key={r.title} className={`rounded-lg p-4 border ${dark ? "bg-slate-900/60 border-white/8" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex items-start gap-3">
                <span className="text-xl">{r.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className={`text-xs font-semibold ${dark ? "text-white" : "text-slate-700"}`}>{r.title}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${r.priority === "High" ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20"}`}>{r.priority}</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}>{r.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ───────────────────────────────────────────────────────────────
function AdminPanel({ dark }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", name: "", role: "teacher", password: "" });
  const [msg, setMsg] = useState(""); const [error, setError] = useState("");

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setUsers(data || []); setLoading(false);
  }

  async function addUser() {
    setMsg(""); setError("");
    if (!newUser.email || !newUser.name || !newUser.password) { setError("All fields required."); return; }
    const { data: authData, error: authError } = await supabase.auth.signUp({ email: newUser.email, password: newUser.password });
    if (authError) { setError(authError.message); return; }
    await supabase.from("profiles").insert({ id: authData.user.id, email: newUser.email, name: newUser.name, role: newUser.role });
    setMsg(`✅ ${newUser.email} added as ${newUser.role}!`);
    setNewUser({ email: "", name: "", role: "teacher", password: "" });
    setShowAdd(false); fetchUsers();
  }

  async function deleteUser(id) { await supabase.from("profiles").delete().eq("id", id); fetchUsers(); }
  async function updateRole(id, role) { await supabase.from("profiles").update({ role }).eq("id", id); fetchUsers(); }

  const input = `w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500/50 transition-colors ${dark ? "bg-slate-900/60 border border-white/10 text-slate-200 placeholder-slate-600" : "bg-white border border-slate-200 text-slate-700 placeholder-slate-400"}`;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div><h2 className={`font-bold ${dark ? "text-white" : "text-slate-800"}`}>User Management</h2><p className={`text-xs mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>Add users and assign roles</p></div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"><UserPlus size={13} /> Add User</button>
      </div>
      {msg && <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-lg">{msg}</div>}
      {error && <div className="bg-red-500/15 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg">{error}</div>}
      {showAdd && (
        <div className={`rounded-xl border p-5 flex flex-col gap-4 ${dark ? "bg-slate-800/60 border-white/10" : "bg-white border-slate-200"}`}>
          <h3 className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-700"}`}>Add New User</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={`text-xs mb-1.5 block ${dark ? "text-slate-400" : "text-slate-500"}`}>Full Name</label><input value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="e.g. Priya Sharma" className={input} /></div>
            <div><label className={`text-xs mb-1.5 block ${dark ? "text-slate-400" : "text-slate-500"}`}>Email</label><input value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="email@school.com" type="email" className={input} /></div>
            <div><label className={`text-xs mb-1.5 block ${dark ? "text-slate-400" : "text-slate-500"}`}>Password</label><input value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} placeholder="Min 6 characters" type="password" className={input} /></div>
            <div><label className={`text-xs mb-1.5 block ${dark ? "text-slate-400" : "text-slate-500"}`}>Role</label>
              <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className={input + " cursor-pointer"}>
                <option value="admin">Admin</option><option value="teacher">Teacher</option><option value="ngo">NGO Analyst</option><option value="student">Student</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addUser} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5"><Check size={12} /> Create User</button>
            <button onClick={() => setShowAdd(false)} className={`border text-xs px-4 py-2 rounded-lg transition-colors ${dark ? "border-white/10 text-slate-300 hover:border-white/20" : "border-slate-200 text-slate-500"}`}>Cancel</button>
          </div>
        </div>
      )}
      <div className={`rounded-xl border overflow-hidden ${dark ? "bg-slate-800/30 border-white/8" : "bg-white border-slate-200"}`}>
        <table className="w-full text-xs">
          <thead><tr className={`border-b ${dark ? "border-white/8 bg-slate-800/60" : "border-slate-100 bg-slate-50"}`}>
            {["User","Email","Role","Joined","Actions"].map(h => <th key={h} className={`px-4 py-3 text-left font-semibold uppercase tracking-wider ${dark ? "text-slate-400" : "text-slate-500"}`}>{h}</th>)}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Loading...</td></tr>
              : users.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No users yet.</td></tr>
              : users.map((u, i) => {
                const rc = ROLE_CONFIG[u.role] || ROLE_CONFIG.teacher;
                return (
                  <tr key={u.id} className={`border-b transition-colors ${dark ? "border-white/5 hover:bg-white/5" : "border-slate-50 hover:bg-slate-50"} ${i % 2 === 0 ? "" : dark ? "bg-slate-800/20" : "bg-slate-50/50"}`}>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500/40 to-purple-600/40 flex items-center justify-center text-xs font-bold text-indigo-300">{(u.name||u.email)[0].toUpperCase()}</div><span className={`font-medium ${dark ? "text-slate-200" : "text-slate-700"}`}>{u.name||"—"}</span></div></td>
                    <td className={`px-4 py-3 ${dark ? "text-slate-400" : "text-slate-500"}`}>{u.email}</td>
                    <td className="px-4 py-3">
                      <select value={u.role} onChange={e => updateRole(u.id, e.target.value)} className={`appearance-none text-xs px-2 py-1 rounded-full border cursor-pointer bg-transparent ${rc.bg} ${rc.text} ${rc.border}`}>
                        <option value="admin">Admin</option><option value="teacher">Teacher</option><option value="ngo">NGO</option><option value="student">Student</option>
                      </select>
                    </td>
                    <td className={`px-4 py-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><button onClick={() => deleteUser(u.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={13} /></button></td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ────────────────────────────────────────────────────────────
function Dashboard({ user, role, onLogout }) {
  const { dark, toggle } = useTheme();
  const [importedStudents, setImportedStudents] = useState(null);
  const baseStudents = useStudentData();
  const allStudents = importedStudents || baseStudents;
  const [students, setStudents] = useState(allStudents);

  useEffect(() => { setStudents(importedStudents || baseStudents); }, [importedStudents]);

  const [tab, setTab] = useState(role === "ngo" ? "equity" : "dashboard");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [sesFilter, setSesFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [sortField, setSortField] = useState("riskScore");
  const [sortDir, setSortDir] = useState("desc");
  const [showCSV, setShowCSV] = useState(false);

  const rc = ROLE_CONFIG[role] || ROLE_CONFIG.teacher;

  const handleAvatarUpdate = (id, avatarData) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, avatar: avatarData } : s));
    if (selected?.id === id) setSelected(prev => ({ ...prev, avatar: avatarData }));
  };

  const filtered = useMemo(() => students
    .filter(s => (search === "" || s.name.toLowerCase().includes(search.toLowerCase())) && (statusFilter === "All" || s.status === statusFilter) && (gradeFilter === "All" || s.grade === gradeFilter) && (sesFilter === "All" || s.ses === sesFilter))
    .sort((a, b) => (sortDir === "desc" ? -1 : 1) * (a[sortField] - b[sortField])),
    [students, search, statusFilter, gradeFilter, sesFilter, sortField, sortDir]);

  const kpis = useMemo(() => {
    const atRisk = students.filter(s => s.status === "Critical").length;
    const avgAtt = Math.round(students.reduce((a, s) => a + s.attendance, 0) / students.length);
    const low = students.filter(s => s.ses === "Low"), high = students.filter(s => s.ses === "High");
    const gap = high.length && low.length ? Math.round(high.reduce((a, s) => a + s.avgGrade, 0) / high.length - low.reduce((a, s) => a + s.avgGrade, 0) / low.length) : 0;
    return { atRisk, avgAtt, gap };
  }, [students]);

  const pieData = useMemo(() => { const c = { Critical: 0, Warning: 0, Stable: 0 }; students.forEach(s => c[s.status]++); return Object.entries(c).map(([name, value]) => ({ name, value })); }, [students]);
  const handleSort = f => { if (sortField === f) setSortDir(d => d === "desc" ? "asc" : "desc"); else { setSortField(f); setSortDir("desc"); } };

  const TABS = [
    ...(role !== "ngo" ? [{ id: "dashboard", label: "Dashboard", icon: BarChart2 }] : []),
    { id: "equity", label: "Equity Insights", icon: Shield },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    ...(role === "admin" ? [{ id: "users", label: "Users", icon: Users }] : []),
  ];

  const bg = dark ? "bg-zinc-950" : "bg-slate-50";
  const sidebar = dark ? "bg-slate-900 border-white/8" : "bg-white border-slate-200";
  const header = dark ? "bg-slate-900/60 border-white/8" : "bg-white/80 border-slate-200";

  return (
    <div className={`min-h-screen ${bg} flex`} style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      {/* Sidebar */}
      <aside className={`w-56 ${sidebar} border-r flex flex-col flex-shrink-0 min-h-screen`}>
        <div className={`p-4 border-b ${dark ? "border-white/8" : "border-slate-100"}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><GraduationCap size={15} className="text-white" /></div>
            <div><div className={`text-xs font-bold ${dark ? "text-white" : "text-slate-800"}`}>EduRisk MIS</div><div className={`text-xs ${dark ? "text-slate-600" : "text-slate-400"}`}>SDG-4 Platform</div></div>
          </div>
        </div>
        <nav className="p-3 flex-1">
          <div className={`text-xs px-3 py-2 uppercase tracking-widest ${dark ? "text-slate-600" : "text-slate-400"}`}>Navigation</div>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs mb-0.5 transition-all ${tab === t.id ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" : dark ? "text-slate-400 hover:text-slate-200 hover:bg-white/5" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}>
              <t.icon size={13} />{t.label}
            </button>
          ))}
          {role !== "ngo" && (
            <>
              <div className={`text-xs px-3 py-2 uppercase tracking-widest mt-4 ${dark ? "text-slate-600" : "text-slate-400"}`}>Risk Status</div>
              {["Critical", "Warning", "Stable"].map(s => {
                const c = SC[s]; const count = students.filter(st => st.status === s).length;
                return <div key={s} className="flex items-center justify-between px-3 py-1.5 text-xs"><span className={`flex items-center gap-1.5 ${c.text}`}><span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />{s}</span><span className={dark ? "text-slate-500" : "text-slate-400"}>{count}</span></div>;
              })}
            </>
          )}
        </nav>
        <div className={`p-3 border-t ${dark ? "border-white/8" : "border-slate-100"}`}>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-6 h-6 rounded-full bg-indigo-600/40 flex items-center justify-center text-xs text-indigo-300 font-bold">{(user.email||"U")[0].toUpperCase()}</div>
            <div className="flex-1 min-w-0"><div className={`text-xs truncate ${dark ? "text-slate-300" : "text-slate-600"}`}>{user.email}</div><span className={`text-xs ${rc.text}`}>{rc.label}</span></div>
            <button onClick={toggle} className={`p-1 rounded transition-colors ${dark ? "text-slate-400 hover:text-yellow-400" : "text-slate-400 hover:text-indigo-600"}`}>{dark ? <Sun size={13}/> : <Moon size={13}/>}</button>
            <button onClick={onLogout} className="text-slate-400 hover:text-red-400 transition-colors"><LogOut size={12}/></button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className={`h-13 border-b flex items-center justify-between px-5 backdrop-blur sticky top-0 z-20 py-3 ${header}`}>
          <div className="flex items-center gap-3">
            <h1 className={`font-bold text-sm ${dark ? "text-white" : "text-slate-800"}`}>
              {tab === "dashboard" ? "Learning Equity Dashboard" : tab === "equity" ? "Equity Insights" : tab === "leaderboard" ? "Leaderboard" : "User Management"}
            </h1>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${rc.bg} ${rc.text} ${rc.border}`}>{rc.label}</span>
            {importedStudents && <span className="text-xs text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">📊 Custom Data</span>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowCSV(true)} className={`flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded-lg transition-all ${dark ? "text-slate-400 hover:text-white border-white/10 hover:border-white/20" : "text-slate-500 border-slate-200 hover:border-slate-300"}`}><Upload size={12}/> Import CSV</button>
            <button onClick={() => exportCSV(students)} className={`flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded-lg transition-all ${dark ? "text-slate-400 hover:text-white border-white/10 hover:border-white/20" : "text-slate-500 border-slate-200 hover:border-slate-300"}`}><Download size={12}/> Export CSV</button>
            <div className={`flex items-center gap-1.5 text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>Live</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "users" && role === "admin" && <AdminPanel dark={dark} />}
          {tab === "equity" && <EquityTab students={students} dark={dark} />}
          {tab === "leaderboard" && <LeaderboardTab students={students} dark={dark} />}
          {tab === "dashboard" && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-4 gap-4">
                <KPICard icon={Users} label="Total Students" value={students.length} color="bg-indigo-600" sub="Across 5 grade levels" trend={2.3} dark={dark} />
                <KPICard icon={AlertTriangle} label="At-Risk Critical" value={kpis.atRisk} color="bg-red-600" sub={`${Math.round(kpis.atRisk/students.length*100)}% of cohort`} trend={-4.1} dark={dark} />
                <KPICard icon={Activity} label="Avg Attendance" value={`${kpis.avgAtt}%`} color="bg-amber-600" sub="Target: ≥ 85%" trend={1.7} dark={dark} />
                <KPICard icon={Target} label="Equity Gap Index" value={`${kpis.gap} pts`} color="bg-purple-600" sub="High vs Low SES" trend={-2.5} dark={dark} />
              </div>
              <div className="grid grid-cols-5 gap-4">
                <div className={`col-span-2 rounded-xl border p-4 ${dark ? "bg-slate-800/40 border-white/8" : "bg-white border-slate-200"}`}>
                  <h2 className={`text-xs font-semibold mb-3 flex items-center gap-2 ${dark ? "text-white" : "text-slate-700"}`}><BarChart2 size={12} className="text-indigo-400"/> Risk Distribution</h2>
                  <ResponsiveContainer width="100%" height={190}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={80} dataKey="value" paddingAngle={3}>
                        {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} stroke="none" />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: dark ? "#0f172a" : "#fff", border: `1px solid ${dark ? "#1e293b" : "#e2e8f0"}`, borderRadius: 8, fontSize: 11 }} />
                      <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: dark ? "#94a3b8" : "#64748b" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className={`col-span-3 rounded-xl border p-4 ${dark ? "bg-slate-800/40 border-white/8" : "bg-white border-slate-200"}`}>
                  <h2 className={`text-xs font-semibold mb-3 flex items-center gap-2 ${dark ? "text-white" : "text-slate-700"}`}><Activity size={12} className="text-indigo-400"/> Attendance vs. Avg Grade</h2>
                  <ResponsiveContainer width="100%" height={190}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e293b" : "#f1f5f9"} />
                      <XAxis dataKey="x" name="Attendance" unit="%" tick={{ fill: dark ? "#64748b" : "#94a3b8", fontSize: 9 }} />
                      <YAxis dataKey="y" name="Grade" unit="%" tick={{ fill: dark ? "#64748b" : "#94a3b8", fontSize: 9 }} />
                      <Tooltip contentStyle={{ background: dark ? "#0f172a" : "#fff", border: `1px solid ${dark ? "#1e293b" : "#e2e8f0"}`, borderRadius: 8, fontSize: 11 }} />
                      {["Critical","Warning","Stable"].map((st, i) => <Scatter key={st} name={st} data={students.filter(s => s.status === st).map(s => ({ x: s.attendance, y: s.avgGrade }))} fill={PIE_COLORS[i]} fillOpacity={0.7} r={3.5} />)}
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-48">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..." className={`w-full rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-indigo-500/50 transition-colors ${dark ? "bg-slate-800/60 border border-white/10 text-slate-200 placeholder-slate-600" : "bg-white border border-slate-200 text-slate-700 placeholder-slate-400"}`} />
                </div>
                {[{ label: "Status", value: statusFilter, set: setStatusFilter, opts: ["All","Critical","Warning","Stable"] }, { label: "Grade", value: gradeFilter, set: setGradeFilter, opts: ["All",...GRADES] }, { label: "SES", value: sesFilter, set: setSesFilter, opts: ["All","Low","Medium","High"] }].map(f => (
                  <div key={f.label} className="relative">
                    <select value={f.value} onChange={e => f.set(e.target.value)} className={`appearance-none rounded-lg pl-3 pr-7 py-2 text-xs focus:outline-none focus:border-indigo-500/50 cursor-pointer ${dark ? "bg-slate-800/60 border border-white/10 text-slate-300" : "bg-white border border-slate-200 text-slate-600"}`}>
                      {f.opts.map(o => <option key={o} value={o}>{f.label}: {o}</option>)}
                    </select>
                    <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                ))}
                <span className={`text-xs ml-auto ${dark ? "text-slate-500" : "text-slate-400"}`}>{filtered.length} results</span>
              </div>
              <div className={`rounded-xl border overflow-hidden ${dark ? "bg-slate-800/30 border-white/8" : "bg-white border-slate-200"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className={`border-b ${dark ? "border-white/8 bg-slate-800/60" : "border-slate-100 bg-slate-50"}`}>
                        {[{k:"name",l:"Student"},{k:"grade",l:"Grade"},{k:"ses",l:"SES"},{k:"attendance",l:"Attendance"},{k:"avgGrade",l:"Avg Grade"},{k:"engagement",l:"Engagement"},{k:"riskScore",l:"Risk"},{k:"status",l:"Status"},{k:"trend",l:"Trend"}].map(col => (
                          <th key={col.k} onClick={() => ["attendance","avgGrade","engagement","riskScore"].includes(col.k) && handleSort(col.k)} className={`px-4 py-3 text-left font-semibold uppercase tracking-wider whitespace-nowrap ${dark ? "text-slate-400" : "text-slate-500"} ${["attendance","avgGrade","engagement","riskScore"].includes(col.k) ? "cursor-pointer hover:text-indigo-400" : ""}`}>
                            {col.l} {sortField === col.k ? (sortDir === "desc" ? "↓" : "↑") : ""}
                          </th>
                        ))}
                        <th className={`px-4 py-3 text-left font-semibold uppercase tracking-wider ${dark ? "text-slate-400" : "text-slate-500"}`}>View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((s, i) => {
                        const c = SC[s.status];
                        return (
                          <tr key={s.id} onClick={() => setSelected(s)} className={`border-b transition-colors cursor-pointer ${dark ? "border-white/5 hover:bg-white/5" : "border-slate-50 hover:bg-slate-50"} ${i%2===0?"":dark?"bg-slate-800/20":"bg-slate-50/50"}`}>
                            <td className="px-4 py-3"><div className="flex items-center gap-2"><Avatar student={s} size="sm"/><span className={`font-medium ${dark ? "text-slate-200" : "text-slate-700"}`}>{s.name}</span></div></td>
                            <td className={`px-4 py-3 ${dark ? "text-slate-400" : "text-slate-500"}`}>{s.grade}</td>
                            <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full border text-xs ${s.ses==="Low"?"text-red-400 bg-red-500/10 border-red-500/20":s.ses==="High"?"text-emerald-400 bg-emerald-500/10 border-emerald-500/20":"text-slate-400 bg-slate-500/10 border-slate-500/20"}`}>{s.ses}</span></td>
                            <td className="px-4 py-3"><div className="flex items-center gap-2 min-w-16"><ProgressBar value={s.attendance} color={s.attendance<60?"bg-red-500":s.attendance<75?"bg-amber-500":"bg-emerald-500"}/><span className={`w-7 text-right ${dark?"text-slate-400":"text-slate-500"}`}>{s.attendance}%</span></div></td>
                            <td className="px-4 py-3"><div className="flex items-center gap-2 min-w-16"><ProgressBar value={s.avgGrade} color="bg-indigo-500"/><span className={`w-7 text-right ${dark?"text-slate-400":"text-slate-500"}`}>{s.avgGrade}%</span></div></td>
                            <td className="px-4 py-3"><div className="flex items-center gap-2 min-w-16"><ProgressBar value={s.engagement} color="bg-purple-500"/><span className={`w-7 text-right ${dark?"text-slate-400":"text-slate-500"}`}>{s.engagement}%</span></div></td>
                            <td className="px-4 py-3"><span className={`font-bold ${c.text}`}>{s.riskScore}</span></td>
                            <td className="px-4 py-3"><RiskBadge status={s.status}/></td>
                            <td className="px-4 py-3"><TrendIcon trend={s.trend}/></td>
                            <td className="px-4 py-3"><button className="p-1.5 hover:bg-indigo-500/20 rounded-lg transition-colors text-slate-400 hover:text-indigo-300"><Eye size={13}/></button></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {selected && <StudentDrawer student={selected} onClose={() => setSelected(null)} dark={dark} onAvatarUpdate={handleAvatarUpdate} />}
      {showCSV && <CSVImportModal onImport={setImportedStudents} onClose={() => setShowCSV(false)} dark={dark} />}
    </div>
  );
}

// ─── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError("Please enter email and password."); return; }
    setLoading(true); setError("");
    const { data, error: e } = await supabase.auth.signInWithPassword({ email, password });
    if (e) { setError(e.message); setLoading(false); return; }
    const { data: profile } = await supabase.from("profiles").select("role,name").eq("id", data.user.id).single();
    onLogin(data.user, profile?.role || "teacher");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(#6366f1 1px,transparent 1px),linear-gradient(90deg,#6366f1 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4"><GraduationCap size={22} className="text-white" /></div>
          <h1 className="text-2xl font-bold text-white">EduRisk MIS</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>
        <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
          {error && <div className="bg-red-500/15 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg">{error}</div>}
          <div><label className="text-xs text-slate-400 mb-1.5 block">Email</label><input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="your@email.com" type="email" className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"/></div>
          <div><label className="text-xs text-slate-400 mb-1.5 block">Password</label><input value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="••••••••" type="password" className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"/></div>
          <button onClick={handleLogin} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2">
            {loading ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Signing in...</> : "Sign In"}
          </button>
          <div className="border-t border-white/8 pt-3 text-xs text-slate-600 text-center">Contact your admin to get access</div>
        </div>
      </div>
    </div>
  );
}

// ─── LANDING ───────────────────────────────────────────────────────────────────
function LandingPage({ onEnter }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <nav className="border-b border-white/8 px-8 py-4 flex items-center justify-between sticky top-0 bg-zinc-950/90 backdrop-blur z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><GraduationCap size={15} className="text-white"/></div>
          <span className="text-white font-bold text-sm">EduRisk <span className="text-indigo-400">MIS</span></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 flex items-center gap-1.5"><Globe size={12}/> SDG-4 Aligned</span>
          <button onClick={onEnter} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5">Launch Dashboard <ChevronRight size={13}/></button>
        </div>
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(#6366f1 1px,transparent 1px),linear-gradient(90deg,#6366f1 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-950" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/15 border border-indigo-500/30 rounded-full px-4 py-1.5 text-xs text-indigo-300 mb-6"><Sparkles size={11}/> AI-Powered · SDG-4 · Learning Equity</div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-4">Identify Student Risk.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Close the Equity Gap.</span></h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">An AI-driven MIS helping schools and NGOs predict dropout risk, surface systemic inequities, and auto-generate personalized intervention plans.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button onClick={onEnter} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-indigo-500/25">Launch Dashboard <ChevronRight size={15}/></button>
            <button className="border border-white/15 hover:border-white/30 text-slate-300 font-semibold px-6 py-3 rounded-xl flex items-center gap-2 text-sm"><BookOpen size={14}/> Documentation</button>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-4 gap-4 mt-16 w-full max-w-2xl">
          {[{label:"Students",value:"50+",icon:Users},{label:"Risk Factors",value:"6",icon:AlertTriangle},{label:"AI Plans",value:"Real-time",icon:Brain},{label:"SDG Goal",value:"4",icon:Award}].map(s=>(
            <div key={s.label} className="bg-slate-800/40 border border-white/8 rounded-xl p-4 text-center">
              <s.icon size={16} className="text-indigo-400 mx-auto mb-2"/>
              <div className="text-white font-bold text-lg">{s.value}</div>
              <div className="text-slate-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/8 py-4 text-center text-xs text-slate-600">© 2025 EduRisk MIS · UN SDG-4 · Powered by AI</div>
    </div>
  );
}

// ─── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("teacher");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase.from("profiles").select("role").eq("id", session.user.id).single()
          .then(({ data }) => { setUser(session.user); setRole(data?.role || "teacher"); setPage("dashboard"); });
      }
    });
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setPage("landing"); };

  return (
    <>
      <FontLoader />
      {page === "landing" && <LandingPage onEnter={() => setPage("login")} />}
      {page === "login" && <LoginPage onLogin={(u, r) => { setUser(u); setRole(r); setPage("dashboard"); }} />}
      {page === "dashboard" && user && <Dashboard user={user} role={role} onLogout={handleLogout} />}
    </>
  );
}
