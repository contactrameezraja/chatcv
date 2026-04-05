import { useState, useRef, useEffect } from "react";

import { PHOTOS } from "./photos.js";


const CV_DATA = `
RAMEEZ RAJA - Senior Data Associate
Email: data.rameez.raja@gmail.com | Phone: +44 7830 533573
Website: https://contactrameezraja.github.io/

=== AVAILABILITY & RIGHT TO WORK ===
Rameez is open to work and actively looking for new opportunities. He is a British citizen with full right to work in the UK. He is also an Irish citizen. He is open to hybrid roles (3 days a week in office) in London, Edinburgh, Belfast, and Dublin. He is also open to fully remote roles.

=== KEY ACHIEVEMENTS ===

1. First Enterprise Data Catalogue (Abcam, 2025)
- Led rollout of first data catalogue: implemented OpenMetadata for 1,500+ users, ingested 50+ tables from Oracle and Redshift alongside 100+ Tableau dashboards via API integration, reducing documentation time by 80%.
- Eliminated tribal knowledge dependencies using AI Copilot for glossary definitions.

2. Cloud Data Warehouse Migration (Abcam, 2025)
- Assisted Oracle to DAP migration: rebuilt tables and schemas into dbt models across Source Aligned, Transformed, and Consumer Aligned layers.
- Owned BI migration end-to-end: created data models in dbt, validated fields in DataGrip, migrated all Abcam Approved Dashboards.

3. BI Centre of Excellence (Abcam/Danaher, 2024)
- Founded analytics help hub, grew into full Centre of Excellence. Reduced analytics backlog by 70%.

4. Snowflake Data Lake Migration (Citi, 2023)
- Designed medallion architecture (Bronze/Silver/Gold) for Snowflake data lake. Eliminated 15+ reporting silos.

5. Innovation Award (Citi, 2022)
- Built end-to-end pipeline from scratch. Reduced 40+ hours weekly effort to single scheduled job, SLA breach times down 40%. Adopted across Global Markets.

6. 3x Citi Gold Gratitude Awards (2019-2021)

=== TECHNICAL SKILLS ===
- Data Engineering: Python, SQL, ETL/ELT Pipelines, Data Modelling (10+ years)
- Cloud Platforms: AWS (Redshift, S3, Glue, Athena), Azure (Data Factory, Data Lake, SQL Database), GCP (5+ years)
- Modern Data Stack: dbt, Apache Airflow, Snowflake, Apache Kafka, Apache Spark, Docker (3+ years)
- BI & Visualisation: Power BI, Tableau, OpenMetadata, Alteryx, SnapLogic (8+ years)
- ML & Analytics: Scikit-learn, XGBoost, PyTorch, TensorFlow, NLP, GPT-3.5, BART, MLflow (2+ years)
- Other: Git, Docker, Terraform, CI/CD (5+ years)

=== EXPERIENCE ===
Data Engineer | Abcam (Danaher Corporation) | Jan 2024 - Feb 2026 | Cambridge, UK (Hybrid)
Data Analytics Engineer | Danaher Corporation (via Abcam) | Jun 2024 - Jan 2025
Business Intelligence Engineer | Citi, Global People Analytics | Oct 2021 - Sep 2023 | Belfast, UK (Remote)
Senior Data Analyst | Citi, Legal Markets | Sep 2019 - Jul 2021 | Belfast, UK
Data Analyst | Citi Private Banking | New York | 2018-2019
Senior Business Analyst | DLL Group / Rabobank | 2014-2018 (Employee of the Year 2015)

=== POSITIONS OF RESPONSIBILITY ===
- ML Researcher (Part-Time), University of Warwick (Sep 2025 - Jan 2026)
- ML Engineer (NLP), Integrity Institute, San Francisco Remote (Feb 2025 - Jul 2025)

=== EDUCATION ===
- MSc Predictive Modelling & Scientific Computing, University of Warwick (2024-2025). Predicted Distinction.
- BSc Business Analysis, Queen Mary University of London (2010-2013). 2:1 Upper Second Class Honours.

=== CERTIFICATIONS ===
AWS Data Analytics (Specialty), AWS Cloud Practitioner, GCP Professional Data Engineer, Microsoft Power BI Data Analyst, Tableau Desktop Specialist, Alteryx Designer Core

=== BEYOND THE CV ===
Rameez enjoys spending time with his friends and family, going on holidays, and reading. From Stephen King to Ilya Prigogine (Order Out of Chaos). Anything that brings physics and data into questions of philosophy. Tennis, badminton, and learning for his PPL license (flying).

=== CONTACT ===
- Website: https://contactrameezraja.github.io/
- Email: data.rameez.raja@gmail.com
- Phone: +44 7830 533573
`;

const CHAT_SYSTEM_PROMPT = `You are Rameez Raja's interactive CV assistant. Answer questions about his professional background, experience, skills, qualifications, and personal interests in a warm but professional tone.

RULES:
- Only answer questions related to Rameez's CV, career, personal interests, and contact info.
- Be concise but informative. Use specific numbers and achievements when relevant.
- Speak in third person (e.g., "Rameez has..." or "He led...").
- Be enthusiastic but honest. Do not exaggerate.
- NEVER use em dashes. Use commas, full stops, or semicolons instead.
- When asked about right to work, confirm Rameez is a British citizen with full right to work in the UK. He is also an Irish citizen.
- When asked about locations or availability, confirm he is open to hybrid roles (3 days a week in office) in London, Edinburgh, Belfast, and Dublin. Also open to fully remote roles. Actively looking.
- When asked about hobbies/fun/spare time, mention: friends and family, holidays, reading (from Stephen King to Ilya Prigogine's Order Out of Chaos), physics-philosophy-data intersection, tennis, badminton, and learning to fly (PPL).
- When asked about contact, include website (https://contactrameezraja.github.io/), email (data.rameez.raja@gmail.com), and phone (+44 7830 533573).

Here is Rameez's full CV:
${CV_DATA}`;

const JOB_FIT_SYSTEM_PROMPT = `You are an expert recruiter AI analysing the fit between Rameez Raja's CV and a job description.

INSTRUCTIONS:
- Analyse the job description against Rameez's CV below.
- Provide a match percentage (0-100%).
- NEVER use em dashes. Use commas, full stops, or semicolons instead.
- Structure your response EXACTLY as follows (use these exact headers):

MATCH: [number]%

SUMMARY
[2-3 sentence overview of the fit]

KEY STRENGTHS
[3-5 bullet points of where Rameez strongly matches]

GAPS TO ADDRESS
[1-3 bullet points of areas where experience is lighter, or "None identified" if strong match]

VERDICT
[1-2 sentence final recommendation]

Here is Rameez's full CV:
${CV_DATA}`;

const SUGGESTED_QUESTIONS = [
  { text: "What is Rameez's most impactful project?", icon: "\u2726" },
  { text: "Can Rameez work in the UK?", icon: "\u2713" },
  { text: "What locations can he work from?", icon: "\u25C8" },
  { text: "What makes him a strong data engineer?", icon: "\u2B21" },
  { text: "What does Rameez do for fun?", icon: "\u2600" },
  { text: "How can I contact Rameez?", icon: "\u2709" },
];

const FUN_KEYWORDS = ["fun", "spare time", "hobbies", "hobby", "free time", "outside of work", "for fun", "do for fun", "interests", "personal"];
function isFunQuestion(text) { return FUN_KEYWORDS.some(k => text.toLowerCase().includes(k)); }

function FloatingBlobs() {
  return (
    <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.45 }} viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="b1" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f4845f" stopOpacity="0.3" /><stop offset="100%" stopColor="#f4845f" stopOpacity="0" /></radialGradient>
        <radialGradient id="b2" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#7ec4cf" stopOpacity="0.25" /><stop offset="100%" stopColor="#7ec4cf" stopOpacity="0" /></radialGradient>
        <radialGradient id="b3" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f7b267" stopOpacity="0.2" /><stop offset="100%" stopColor="#f7b267" stopOpacity="0" /></radialGradient>
        <radialGradient id="b4" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#c3aed6" stopOpacity="0.18" /><stop offset="100%" stopColor="#c3aed6" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="150" cy="120" rx="280" ry="220" fill="url(#b1)"><animateTransform attributeName="transform" type="translate" values="0,0;20,15;0,0" dur="18s" repeatCount="indefinite" /></ellipse>
      <ellipse cx="1050" cy="200" rx="240" ry="200" fill="url(#b2)"><animateTransform attributeName="transform" type="translate" values="0,0;-15,20;0,0" dur="22s" repeatCount="indefinite" /></ellipse>
      <ellipse cx="600" cy="650" rx="300" ry="180" fill="url(#b3)"><animateTransform attributeName="transform" type="translate" values="0,0;25,-10;0,0" dur="20s" repeatCount="indefinite" /></ellipse>
      <ellipse cx="900" cy="700" rx="200" ry="160" fill="url(#b4)"><animateTransform attributeName="transform" type="translate" values="0,0;-10,18;0,0" dur="16s" repeatCount="indefinite" /></ellipse>
      {[[180,500,3,"#f4845f"],[400,150,2.5,"#7ec4cf"],[750,100,2,"#f7b267"],[950,450,3,"#c3aed6"],[300,700,2,"#f4845f"],[1100,600,2.5,"#7ec4cf"]].map(([cx,cy,r,fill],i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={fill} opacity="0.5"><animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${3+i*0.7}s`} repeatCount="indefinite" /></circle>
      ))}
    </svg>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 6, padding: "4px 0", alignItems: "center" }}>
      {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "linear-gradient(135deg, #f4845f, #f7b267)", animation: `dotPulse 1.4s ease-in-out ${i*0.18}s infinite` }} />)}
    </div>
  );
}

function MatchGauge({ percentage }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;
  const color = percentage >= 80 ? "#34d399" : percentage >= 60 ? "#f7b267" : "#f4845f";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16, animation: "msgIn 0.5s ease-out" }}>
      <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#f0ebe5" strokeWidth="8" />
          <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)" }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#2d2926", fontFamily: "'Fraunces', serif" }}>{percentage}%</span>
          <span style={{ fontSize: 10, color: "#8a7e74", fontWeight: 500, letterSpacing: 1, textTransform: "uppercase" }}>Match</span>
        </div>
      </div>
    </div>
  );
}

function InlinePhotoStrip() {
  return (
    <div style={{ marginTop: 14, animation: "msgIn 0.5s cubic-bezier(0.22, 1, 0.36, 1)" }}>
      <p style={{ fontSize: 11.5, color: "#b8a99a", fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10, fontFamily: "'Outfit', sans-serif" }}>
        Beyond the Data
      </p>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}>
        {PHOTOS.map((src, i) => (
          <div key={i} style={{
            flexShrink: 0, scrollSnapAlign: "start", width: 150, height: 120, borderRadius: 12,
            overflow: "hidden", boxShadow: "0 3px 12px rgba(0,0,0,0.08)", border: "2px solid rgba(255,255,255,0.9)",
            animation: `msgIn 0.4s ease-out ${i * 0.05}s both`,
          }}>
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message, showPhotos, showGauge }) {
  const isUser = message.role === "user";
  const matchNum = showGauge ? parseInt((message.content.match(/MATCH:\s*(\d+)%/) || [])[1]) || 0 : 0;

  // Format job fit response nicely
  let displayContent = message.content;
  if (showGauge && !isUser) {
    displayContent = displayContent.replace(/MATCH:\s*\d+%\n?/, "").trim();
  }

  return (
    <div style={{ marginBottom: 18, animation: "msgIn 0.35s cubic-bezier(0.22, 1, 0.36, 1)" }}>
      <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", gap: 12 }}>
        {!isUser && (
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #f4845f, #f7b267)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, marginTop: 2, fontSize: 15, fontWeight: 700, color: "#fff",
            fontFamily: "'Outfit', sans-serif", boxShadow: "0 3px 12px rgba(244,132,95,0.3)",
          }}>R</div>
        )}
        <div style={{ maxWidth: isUser ? "76%" : "82%" }}>
          {showGauge && !isUser && matchNum > 0 && <MatchGauge percentage={matchNum} />}
          <div style={{
            padding: isUser ? "14px 18px" : "14px 18px",
            borderRadius: isUser ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
            background: isUser ? "linear-gradient(135deg, #f4845f, #e86f5a)" : "rgba(255,255,255,0.85)",
            color: isUser ? "#fff" : "#3d3a38",
            fontSize: isUser ? 14.5 : 14, lineHeight: 1.65,
            fontFamily: "'Outfit', sans-serif", fontWeight: 400,
            boxShadow: isUser ? "0 4px 16px rgba(244,132,95,0.25)" : "0 2px 12px rgba(0,0,0,0.06)",
            backdropFilter: isUser ? "none" : "blur(12px)",
            border: isUser ? "none" : "1px solid rgba(244,132,95,0.1)",
            whiteSpace: "pre-wrap",
            maxHeight: isUser ? 120 : "none", overflow: isUser ? "hidden" : "visible",
          }}>
            {isUser && message.isJobFit
              ? "Job description submitted for analysis..."
              : displayContent}
          </div>
          {showPhotos && !isUser && <InlinePhotoStrip />}
        </div>
      </div>
    </div>
  );
}

export default function ChatCV() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [funAskedIndex, setFunAskedIndex] = useState(-1);
  const [jobFitIndices, setJobFitIndices] = useState(new Set());
  const [jobMode, setJobMode] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (jobMode && textareaRef.current) textareaRef.current.focus();
  }, [jobMode]);

  const sendMessage = async (text, isJobFit = false) => {
    const userMsg = { role: "user", content: text, isJobFit };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setStarted(true);
    setLoading(true);
    if (isJobFit) setJobMode(false);

    const askedFun = !isJobFit && isFunQuestion(text);

    try {
      const systemPrompt = isJobFit
        ? JOB_FIT_SYSTEM_PROMPT
        : CHAT_SYSTEM_PROMPT;

      const apiMessages = isJobFit
        ? [{ role: "user", content: `Please analyse this job description against Rameez's CV:\n\n${text}` }]
        : newMessages.map(m => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: systemPrompt,
          messages: apiMessages,
        }),
      });
      const data = await response.json();

      // Handle rate limit
      if (response.status === 429 || data.error === "daily_limit_reached") {
        setMessages(prev => [...prev, { role: "assistant", content: "Thanks for your interest in Rameez's profile! The daily message limit has been reached. Please try again tomorrow, or reach out directly at data.rameez.raja@gmail.com" }]);
        setLoading(false);
        return;
      }

      const assistantText = data.content?.filter(b => b.type === "text").map(b => b.text).join("\n") || "Sorry, I could not process that.";
      setMessages(prev => {
        const updated = [...prev, { role: "assistant", content: assistantText }];
        if (askedFun) setFunAskedIndex(updated.length - 1);
        if (isJobFit) setJobFitIndices(s => new Set([...s, updated.length - 1]));
        return updated;
      });
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "I am having trouble connecting right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    if (jobMode) {
      sendMessage(input.trim(), true);
    } else {
      sendMessage(input.trim());
    }
  };

  const handleJobFitClick = () => {
    setStarted(true);
    setJobMode(true);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(170deg, #fdf8f4 0%, #f5ede6 35%, #eef6f7 70%, #fdf8f4 100%)",
      fontFamily: "'Outfit', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      position: "relative", overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&display=swap" rel="stylesheet" />
      <FloatingBlobs />

      <style>{`
        @keyframes msgIn { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes dotPulse { 0%, 60%, 100% { transform: translateY(0); opacity: 0.35; } 30% { transform: translateY(-7px); opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gentleSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: #b8a99a; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e8d5c4; border-radius: 10px; }
        textarea { resize: none; }
      `}</style>

      {/* Header */}
      <div style={{ width: "100%", maxWidth: 700, padding: "32px 28px 0", zIndex: 2, animation: "fadeUp 0.5s ease-out" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
            <svg width="56" height="56" viewBox="0 0 56 56" style={{ position: "absolute", top: 0, left: 0, animation: "gentleSpin 25s linear infinite" }}>
              <defs><linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f4845f" /><stop offset="50%" stopColor="#f7b267" /><stop offset="100%" stopColor="#7ec4cf" /></linearGradient></defs>
              <circle cx="28" cy="28" r="26" fill="none" stroke="url(#ringGrad)" strokeWidth="2" strokeDasharray="8 4 16 4" />
            </svg>
            <div style={{
              position: "absolute", top: 6, left: 6, width: 44, height: 44, borderRadius: "50%",
              background: "linear-gradient(135deg, #f4845f, #f7b267)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 700, color: "#fff", boxShadow: "0 4px 20px rgba(244,132,95,0.35)",
            }}>R</div>
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#2d2926", fontFamily: "'Fraunces', serif", letterSpacing: -0.5, lineHeight: 1.1 }}>Rameez Raja</h1>
            <p style={{ fontSize: 13, color: "#f4845f", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 3 }}>Senior Data Associate</p>
          </div>
          {started && (
            <button
              onClick={() => { setMessages([]); setStarted(false); setInput(""); setJobMode(false); setFunAskedIndex(-1); setJobFitIndices(new Set()); }}
              style={{
                background: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(244,132,95,0.15)", borderRadius: 20,
                padding: "7px 14px", color: "#8a7e74", fontSize: 12,
                cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontWeight: 500,
                transition: "all 0.2s ease", flexShrink: 0,
                display: "flex", alignItems: "center", gap: 6,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#f4845f"; e.currentTarget.style.color = "#f4845f"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(244,132,95,0.15)"; e.currentTarget.style.color = "#8a7e74"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Home
            </button>
          )}
        </div>
        <div style={{ position: "relative", height: 20, marginTop: 16 }}>
          <svg width="100%" height="20" viewBox="0 0 700 20" preserveAspectRatio="none">
            <defs><linearGradient id="divGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="transparent" /><stop offset="20%" stopColor="#f4845f" /><stop offset="50%" stopColor="#f7b267" /><stop offset="80%" stopColor="#7ec4cf" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs>
            <path d="M0,10 Q175,0 350,10 T700,10" stroke="url(#divGrad)" strokeWidth="1.5" fill="none" opacity="0.5" />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, width: "100%", maxWidth: 700, padding: "12px 28px 20px", overflowY: "auto", zIndex: 2, display: "flex", flexDirection: "column" }}>
        {!started ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", paddingBottom: 20 }}>
            <div style={{ position: "relative", width: 70, height: 70, marginBottom: 20 }}>
              <svg width="70" height="70" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="30" fill="none" stroke="#f4845f" strokeWidth="0.8" opacity="0.3"><animateTransform attributeName="transform" type="rotate" values="0 40 40;360 40 40" dur="30s" repeatCount="indefinite" /></circle>
                <circle cx="40" cy="40" r="20" fill="none" stroke="#7ec4cf" strokeWidth="0.8" opacity="0.3"><animateTransform attributeName="transform" type="rotate" values="360 40 40;0 40 40" dur="20s" repeatCount="indefinite" /></circle>
                <circle cx="40" cy="10" r="3" fill="#f4845f" opacity="0.7"><animateTransform attributeName="transform" type="rotate" values="0 40 40;360 40 40" dur="30s" repeatCount="indefinite" /></circle>
                <circle cx="60" cy="40" r="2.5" fill="#7ec4cf" opacity="0.7"><animateTransform attributeName="transform" type="rotate" values="360 40 40;0 40 40" dur="20s" repeatCount="indefinite" /></circle>
                <circle cx="40" cy="40" r="4" fill="#f7b267" opacity="0.8"><animate attributeName="r" values="3;5;3" dur="4s" repeatCount="indefinite" /></circle>
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, color: "#2d2926", marginBottom: 8, textAlign: "center", fontWeight: 600, animation: "fadeUp 0.6s ease-out" }}>
              Chat with my CV
            </h2>
            <p style={{ color: "#8a7e74", fontSize: 14.5, textAlign: "center", maxWidth: 420, lineHeight: 1.6, marginBottom: 36, animation: "fadeUp 0.7s ease-out" }}>
              Ask anything about Rameez's experience, skills, and achievements. Or paste a job description for an instant fit analysis.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, maxWidth: 540, width: "100%", marginBottom: 16 }}>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button key={i} onClick={() => sendMessage(q.text)}
                  style={{
                    background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
                    border: "1px solid rgba(244,132,95,0.15)", borderRadius: 14,
                    padding: "12px 16px", color: "#3d3a38", fontSize: 13,
                    cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontWeight: 400,
                    textAlign: "left", transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
                    animation: `fadeUp 0.5s ease-out ${i * 0.06}s both`,
                    display: "flex", alignItems: "flex-start", gap: 10, lineHeight: 1.4,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.95)"; e.currentTarget.style.borderColor = "#f4845f"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(244,132,95,0.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = "rgba(244,132,95,0.15)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <span style={{ color: "#f4845f", fontSize: 15, lineHeight: 1.2, flexShrink: 0, marginTop: 1 }}>{q.icon}</span>
                  {q.text}
                </button>
              ))}
            </div>
            {/* Job Fit Analysis card */}
            <button onClick={handleJobFitClick}
              style={{
                background: "linear-gradient(135deg, rgba(244,132,95,0.08), rgba(126,196,207,0.08))",
                backdropFilter: "blur(12px)",
                border: "1.5px dashed rgba(244,132,95,0.35)", borderRadius: 16,
                padding: "16px 22px", color: "#3d3a38", fontSize: 14,
                cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontWeight: 500,
                textAlign: "center", transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
                animation: "fadeUp 0.6s ease-out 0.4s both",
                width: "100%", maxWidth: 540,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#f4845f"; e.currentTarget.style.background = "linear-gradient(135deg, rgba(244,132,95,0.12), rgba(126,196,207,0.12))"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(244,132,95,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(244,132,95,0.35)"; e.currentTarget.style.background = "linear-gradient(135deg, rgba(244,132,95,0.08), rgba(126,196,207,0.08))"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f4845f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              Paste a job description for fit analysis
            </button>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} showPhotos={i === funAskedIndex} showGauge={jobFitIndices.has(i)} />
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 18, animation: "msgIn 0.35s cubic-bezier(0.22, 1, 0.36, 1)" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "linear-gradient(135deg, #f4845f, #f7b267)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: 2, fontSize: 15, fontWeight: 700, color: "#fff",
                  boxShadow: "0 3px 12px rgba(244,132,95,0.3)",
                }}>R</div>
                <div style={{ padding: "14px 18px", borderRadius: "20px 20px 20px 6px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(244,132,95,0.1)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </>
        )}
      </div>

      {/* Quick chips */}
      {started && !jobMode && !loading && messages.length > 0 && messages.length < 10 && (
        <div style={{ width: "100%", maxWidth: 700, padding: "0 28px 8px", zIndex: 2 }}>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {[...SUGGESTED_QUESTIONS.filter(q => !messages.some(m => m.content === q.text)).slice(0, 2),
              { text: "Analyse job fit", icon: "\u2B21", action: "jobfit" }
            ].map((q, i) => (
              <button key={i}
                onClick={() => q.action === "jobfit" ? setJobMode(true) : sendMessage(q.text)}
                style={{
                  background: q.action === "jobfit" ? "linear-gradient(135deg, rgba(244,132,95,0.1), rgba(126,196,207,0.1))" : "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(8px)",
                  border: `1px ${q.action === "jobfit" ? "dashed" : "solid"} rgba(244,132,95,0.15)`,
                  borderRadius: 24, padding: "8px 16px", color: "#8a7e74", fontSize: 12.5,
                  cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                  whiteSpace: "nowrap", transition: "all 0.2s ease", flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#f4845f"; e.currentTarget.style.color = "#f4845f"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(244,132,95,0.15)"; e.currentTarget.style.color = "#8a7e74"; }}
              >
                {q.icon} {q.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div style={{ width: "100%", maxWidth: 700, padding: "12px 28px 28px", zIndex: 2 }}>
        {jobMode ? (
          <div style={{
            background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", borderRadius: 20,
            border: "1.5px dashed #f4845f", padding: 18,
            boxShadow: "0 4px 24px rgba(244,132,95,0.1)",
            animation: "msgIn 0.3s ease-out",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f4845f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#f4845f", letterSpacing: 0.5 }}>JOB FIT ANALYSIS</span>
              <button onClick={() => setJobMode(false)} style={{
                marginLeft: "auto", background: "none", border: "none", cursor: "pointer",
                color: "#b8a99a", fontSize: 18, lineHeight: 1, padding: "2px 6px",
              }}>&times;</button>
            </div>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={6}
              style={{
                width: "100%", background: "rgba(253,248,244,0.6)", border: "1px solid rgba(244,132,95,0.12)",
                borderRadius: 12, padding: 14, color: "#2d2926", fontSize: 13.5,
                fontFamily: "'Outfit', sans-serif", outline: "none", lineHeight: 1.5,
              }}
              disabled={loading}
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || loading}
              style={{
                marginTop: 12, width: "100%", padding: "12px 20px", borderRadius: 14,
                background: input.trim() && !loading ? "linear-gradient(135deg, #f4845f, #f7b267)" : "#ede5dd",
                border: "none", color: input.trim() && !loading ? "#fff" : "#b8a99a",
                fontSize: 14, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
                cursor: input.trim() && !loading ? "pointer" : "default",
                transition: "all 0.25s ease",
                boxShadow: input.trim() && !loading ? "0 4px 16px rgba(244,132,95,0.3)" : "none",
              }}
            >
              Analyse Fit
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "flex", gap: 10, background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(16px)", borderRadius: 28,
              padding: "6px 6px 6px 22px", alignItems: "center",
              border: "1px solid rgba(244,132,95,0.15)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)", transition: "all 0.25s ease",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = "#f4845f"; e.currentTarget.style.boxShadow = "0 4px 30px rgba(244,132,95,0.15)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "rgba(244,132,95,0.15)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)"; }}
          >
            <input
              type="text" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit(e)}
              placeholder="Ask about experience, skills, or projects..."
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#2d2926", fontSize: 14.5, fontFamily: "'Outfit', sans-serif", fontWeight: 400 }}
              disabled={loading}
            />
            <button onClick={handleSubmit} disabled={!input.trim() || loading}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                background: input.trim() && !loading ? "linear-gradient(135deg, #f4845f, #f7b267)" : "#ede5dd",
                border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.25s ease", flexShrink: 0,
                boxShadow: input.trim() && !loading ? "0 4px 16px rgba(244,132,95,0.35)" : "none",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !loading ? "#fff" : "#b8a99a"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        )}
        <p style={{ textAlign: "center", fontSize: 11.5, color: "#b8a99a", marginTop: 12, fontWeight: 400, letterSpacing: 0.3 }}>
          Powered by Claude · Responses grounded in Rameez's CV
          {started && (
            <span>
              {" · "}
              <span
                onClick={() => { setMessages([]); setStarted(false); setInput(""); setJobMode(false); setFunAskedIndex(-1); setJobFitIndices(new Set()); }}
                style={{ color: "#f4845f", cursor: "pointer", fontWeight: 500, textDecoration: "underline", textUnderlineOffset: 2 }}
              >Return to home</span>
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
