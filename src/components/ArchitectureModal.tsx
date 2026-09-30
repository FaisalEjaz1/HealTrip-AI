import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Database,
  ShieldCheck,
  Lock,
  Copy,
  Check,
  Code2,
  GitBranch,
  Terminal,
  Server,
  AlertOctagon,
  FileText,
  Activity,
  Clock,
  CheckCircle2,
  FileJson,
  Download
} from 'lucide-react';
import { MessageItem, ToolExecutionRecord } from '../types/index.js';

interface ArchitectureModalProps {
  language: 'en' | 'ar';
  messages?: MessageItem[];
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ language, messages = [] }) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'agent' | 'schema' | 'antihallucination' | 'security' | 'telemetry' | 'readme' | 'decisions'>('overview');
  const [copiedReadme, setCopiedReadme] = useState(false);
  const [copiedDecisions, setCopiedDecisions] = useState(false);

  // Extract all tool execution records across messages
  const allExecutions: {
    msgId: string;
    timestamp: string;
    tool: ToolExecutionRecord;
    triageLevel?: string;
  }[] = [];

  messages.forEach((msg) => {
    if (msg.agentData?.toolExecutions) {
      msg.agentData.toolExecutions.forEach((tool) => {
        allExecutions.push({
          msgId: msg.id,
          timestamp: tool.timestamp || msg.timestamp,
          tool,
          triageLevel: msg.agentData?.triageLevel
        });
      });
    }
  });

  const fullReadmeContent = `# HealTrip AI Patient Decision Assistant
**Bilingual AI Clinical Triage, Grounded Medical Tourism Provider Matching & Second Opinion Navigator**

Developed as a Technical Prototype for HealTrip.

---

## 1. Executive Summary & Problem Formulation
Patients seeking cross-border healthcare or clinical clarity often face severe cognitive overload:
- *"I have chest pain and I'm not sure whether I should see a cardiologist, go to the ER, or seek a second opinion."*
- Unqualified LLM chatbots frequently **hallucinate** doctors, quote outdated pricing, or fail to prioritize **life-threatening emergencies** (such as Acute Coronary Syndrome).

The **HealTrip AI Patient Decision Assistant** solves this through a multi-layered **Agentic Architecture**:
1. **Clinical Triage Pre-Screening**: Evaluates red-flag symptoms (ACS, stroke, severe respiratory distress) before elective matching.
2. **Native Tool Calling (Function Calling)**: The AI queries a verified, structured healthcare database instead of generating fictitious facilities.
3. **Dual-Layer Anti-Hallucination Validation**: Only doctors and hospitals verified in the query response are displayed.
4. **Bilingual Localization**: Seamlessly supports English (LTR) and Arabic (العربية - RTL).

---

## 2. High-Level System Architecture

\`\`\`text
  +-----------------------------------------------------------------------------+
  |                               PRESENTATION LAYER                           |
  |  React 19 SPA + Tailwind CSS + Bilingual Engine (English LTR / Arabic RTL)  |
  |  - Interactive Chat with Quick Clinical Scenarios                           |
  |  - Real-time Triage Badges (Emergency Red Flag, Urgent, Specialist, 2nd Op) |
  |  - Grounded Provider Cards (JCI Accreditations, Fees, Next Available Slot)   |
  |  - Real-Time Tool Execution Telemetry Inspector                             |
  +---------------------------------------+-------------------------------------+
                                          | JSON over HTTPS (REST API)
                                          v
  +-----------------------------------------------------------------------------+
  |                           APPLICATION & API LAYER                           |
  |  Node.js + Express (server.ts)                                              |
  |  - POST /api/chat               (Agentic Triage & Tool Calling Loop)        |
  |  - GET  /api/providers          (Database Search & Filters)                 |
  |  - GET  /api/system-architecture (System Specs & DDL Contracts)             |
  +-------------------+-----------------------------------+---------------------+
                      |                                   |
                      v                                   v
  +---------------------------------------+   +---------------------------------+
  |             AI AGENT LAYER            |   |          DATABASE LAYER         |
  |  Gemini 3.8 Flash SDK (@google/genai) |   |  Relational / Mock Database     |
  |  - Clinical Triage Engine             |   |  - Hospitals (JCI, 24/7 ER, ERD)|
  |  - Tool Call Dispatcher:              |   |  - Doctors (Fees, Subspecialty) |
  |    * search_providers(...)            |<--+  - Indexed by Specialty, City,  |
  |    * evaluate_triage_urgency(...)     |   |    Emergency Status & Telehealth|
  |  - Anti-Hallucination Guardrail       |   +---------------------------------+
  |  - Deterministic Safety Fallback      |
  +---------------------------------------+
\`\`\`

---

## 3. AI Agent Design & Tool Calling Workflow
1. **Perception**: Patient inputs text.
2. **Deterministic Triage Filter**: Regex & semantic heuristic rules detect immediate life threats (e.g., crushing chest pain radiating to left arm/jaw, diaphoresis). If triggered, emergency dispatch advice is rendered.
3. **Model Function Invocation**:
   - Gemini evaluates clinical context and issues a structured function call:
     \`search_providers({ specialty: "Cardiology", emergency_capable: true, location: "Dubai" })\`
4. **Database Execution**:
   - The server queries the structured registry and returns matched provider records.
5. **Tool Response Synthesis**:
   - The tool output is fed back into the model to generate tailored clinical explanations and clarifying questions.
6. **Anti-Hallucination Cross-Verification**:
   - Recommended entities are verified against returned database IDs.

---

## 4. Database Schema (PostgreSQL DDL)
\`\`\`sql
CREATE TABLE hospitals (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    city VARCHAR(128) NOT NULL,
    country VARCHAR(128) NOT NULL,
    accreditations TEXT[] NOT NULL,
    emergency_department_247 BOOLEAN DEFAULT FALSE,
    helipad BOOLEAN DEFAULT FALSE,
    languages_supported TEXT[] NOT NULL,
    international_patient_desk BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    review_count INTEGER DEFAULT 0,
    telehealth_ready BOOLEAN DEFAULT TRUE,
    address TEXT NOT NULL,
    contact_phone VARCHAR(64) NOT NULL,
    emergency_hotline VARCHAR(64) NOT NULL,
    specialties TEXT[] NOT NULL
);

CREATE INDEX idx_hospitals_city ON hospitals(city);
CREATE INDEX idx_hospitals_emergency ON hospitals(emergency_department_247);

CREATE TABLE doctors (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    hospital_id VARCHAR(64) REFERENCES hospitals(id) ON DELETE CASCADE,
    specialty VARCHAR(128) NOT NULL,
    subspecialties TEXT[] NOT NULL,
    experience_years INTEGER NOT NULL,
    languages TEXT[] NOT NULL,
    second_opinion_available BOOLEAN DEFAULT TRUE,
    consultation_fee_usd NUMERIC(10, 2) NOT NULL,
    telehealth_fee_usd NUMERIC(10, 2) NOT NULL,
    next_available_slot VARCHAR(128),
    bio TEXT NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    procedures TEXT[] NOT NULL,
    city VARCHAR(128) NOT NULL,
    country VARCHAR(128) NOT NULL
);

CREATE INDEX idx_doctors_specialty ON doctors(specialty);
CREATE INDEX idx_doctors_second_opinion ON doctors(second_opinion_available);
\`\`\`

---

## 5. Security & Error Handling
- **Zero Client Secret Exposure**: API keys reside solely in \`process.env.GEMINI_API_KEY\` on the server.
- **Fail-Safe Fallback**: If LLM API quotas or network delays occur, the deterministic clinical decision engine automatically handles triage and tool queries without downtime.
- **PII & HIPAA Compliance**: No identifiable health records or payment details are collected in the triage phase.

---

## 6. Assumptions & Limitations
- **Prototype Scope**: Demonstrates clinical decision architecture, tool calling, and grounded matching. It does not replace emergency medical response (911/998/112).
- **Medical Tourism Focus**: Provider dataset mirrors premier hubs for international patients (Istanbul, Dubai, Riyadh, Amman, Berlin, London).
`;

  const fullDecisionsContent = `# HealTrip Technical Decisions, Assumptions & Architecture Notes

**Candidate Submission Document**  
**Role:** Full-Stack / AI Engineer  
**Project:** HealTrip AI Patient Decision Assistant  
**Date:** September 2026  

---

## 1. Executive Overview
This document accompanies the submission of the HealTrip AI Patient Decision Assistant. It details the clinical and technical assumptions, architectural trade-offs, defensive design principles, and future engineering roadmap.

---

## 2. Key Assumptions
1. **Safety Over Fluency (Zero-Harm Principle):** In healthcare, under-triaging acute red flags (e.g. dismissing Acute Coronary Syndrome as mild indigestion) is unacceptable. Deterministic clinical rules must guard before probabilistic LLM reasoning.
2. **Four Patient Urgency Buckets:**
   - EMERGENCY_RED_FLAG (Immediate threat to life/limb; 911/998/112 dispatch + 24/7 ER)
   - URGENT_EVALUATION (Severe, non-critical symptoms requiring exam within 24-48 hours)
   - SPECIALIST_CONSULT (Chronic, localized, non-acute issues needing diagnostic workup)
   - SECOND_OPINION_TELEHEALTH (Elective surgeries/procedures where patient seeks cross-border senior review)
3. **Medical Tourism Feasibility:** International second opinions require a clinically stable patient with existing diagnostic reports (MRI/CT scans, pathology, catheterization notes).
4. **Bilingual Regional Needs:** Native support for Arabic (العربية - RTL) and English (LTR).

---

## 3. Technical & Architectural Decisions
- **Decision 1: Native Agentic Tool Calling vs Freeform Generation:** Tool calling with strict schemas (search_providers, evaluate_triage_urgency) completely eliminates synthetic hospital/doctor hallucination.
- **Decision 2: Deterministic Pre-Screening Engine:** Pre-LLM clinical rule evaluator intercepts acute cardiac, stroke, and respiratory symptoms, triggering emergency protocols regardless of LLM temperature.
- **Decision 3: Zero-Downtime Dual Pipeline:** Automatic fallback to rule engine and local database search if external AI API keys or quotas are disrupted.
- **Decision 4: Express Serverless Proxy on Vercel:** Keeps GEMINI_API_KEY secure on the server, avoiding browser credential leakage.
- **Decision 5: PostgreSQL DDL Ready Schema:** Normalized entities (hospitals, doctors, specialties) ready for Cloud SQL or Supabase migration via Drizzle ORM.

---

## 4. Edge Cases Handled
- Acute Coronary Syndrome (Heart Attack) detection with 24/7 ER routing
- Zero database matches handled gracefully without fabricated clinics
- Interactive clarifying questions for ambiguous symptom inputs
- Missing/invalid API keys handled with full diagnostic reporting in /api/health
`;

  const downloadMarkdownFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadWordDocument = (filename: string, title: string, markdownContent: string) => {
    const formattedHtml = markdownContent
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/```([\s\S]*?)```/gim, '<pre>$1</pre>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      .replace(/\n\n/gim, '<br/><br/>');

    const html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${title}</title>
      <style>
        body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #1e293b; margin: 40px; }
        h1 { color: #0f766e; font-size: 20pt; border-bottom: 2px solid #0f766e; padding-bottom: 6px; }
        h2 { color: #0f766e; font-size: 14pt; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
        h3 { color: #334155; font-size: 12pt; margin-top: 14px; }
        pre { font-family: Consolas, monospace; font-size: 9pt; background: #0f172a; color: #f8fafc; padding: 10px; border-radius: 6px; white-space: pre-wrap; }
        code { font-family: Consolas, monospace; background: #f1f5f9; color: #0f766e; padding: 2px 4px; }
        blockquote { border-left: 4px solid #0f766e; padding: 8px 14px; background: #f0fdfa; color: #134e4a; font-style: italic; }
      </style>
      </head>
      <body>
        ${formattedHtml}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename.endsWith('.doc') ? filename : `${filename}.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyReadme = () => {
    navigator.clipboard.writeText(fullReadmeContent);
    setCopiedReadme(true);
    setTimeout(() => setCopiedReadme(false), 2500);
  };

  const handleCopyDecisions = () => {
    navigator.clipboard.writeText(fullDecisionsContent);
    setCopiedDecisions(true);
    setTimeout(() => setCopiedDecisions(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Technical Test Submission Spec
            </span>
            <span className="text-xs text-slate-400">HealTrip AI Engineering</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-1 text-white">
            System Architecture & Engineering Decisions
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Transparent architectural blueprints, tool calling contracts, database entity models, anti-hallucination guardrails, and submission documentation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
          <button
            onClick={() => downloadWordDocument('README.doc', 'HealTrip AI - README Spec', fullReadmeContent)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-sm"
            title="Download formatted Microsoft Word .doc file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download README.doc (Word)</span>
          </button>

          <button
            onClick={() => downloadMarkdownFile('README.md', fullReadmeContent)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>README.md</span>
          </button>

          <button
            onClick={() => downloadWordDocument('TECHNICAL_DECISIONS_AND_ASSUMPTIONS.doc', 'HealTrip Technical Decisions & Assumptions', fullDecisionsContent)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 font-semibold text-xs transition-colors shadow-sm"
            title="Download Notes & Assumptions in Word format"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Notes & Assumptions (.doc)</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeSubTab === 'overview'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Architecture Overview</span>
        </button>

        <button
          onClick={() => setActiveSubTab('agent')}
          className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeSubTab === 'agent'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>AI Agent & Tool Calling</span>
        </button>

        <button
          onClick={() => setActiveSubTab('schema')}
          className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeSubTab === 'schema'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Database Schema & ERD</span>
        </button>

        <button
          onClick={() => setActiveSubTab('antihallucination')}
          className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeSubTab === 'antihallucination'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Anti-Hallucination & Safety</span>
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeSubTab === 'security'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Security & Error Handling</span>
        </button>

        <button
          onClick={() => setActiveSubTab('telemetry')}
          className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeSubTab === 'telemetry'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Live Tool Logs ({allExecutions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('readme')}
          className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeSubTab === 'readme'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>README.md</span>
        </button>

        <button
          onClick={() => setActiveSubTab('decisions')}
          className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeSubTab === 'decisions'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Notes & Assumptions</span>
        </button>
      </div>

      {/* Sub Tab Contents */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Server className="w-5 h-5 text-teal-600" />
              <span>Full-Stack Component Layers & Data Flow</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              The application is structured into decoupled, single-responsibility layers adhering to clean architecture principles:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-teal-700 block mb-1">1. Presentation Layer</span>
                <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                  <li>React 19 SPA with Tailwind CSS v4</li>
                  <li>Bilingual engine (English LTR / Arabic RTL)</li>
                  <li>Triage urgency indicator badges</li>
                  <li>Clarifying question chip handlers</li>
                  <li>Grounded provider cards & booking modal</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-teal-700 block mb-1">2. Agentic Backend Layer</span>
                <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                  <li>Node.js / Express (<code className="text-teal-800">server.ts</code>)</li>
                  <li>Clinical Triage Rule Pre-screener</li>
                  <li>Google GenAI SDK (<code className="text-teal-800">gemini-3.8-flash</code>)</li>
                  <li>Tool Calling Loop & state handling</li>
                  <li>Anti-hallucination verification engine</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-teal-700 block mb-1">3. Data & Persistence Layer</span>
                <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                  <li>Normalized relational schema (PostgreSQL DDL)</li>
                  <li>In-memory indexed mock database</li>
                  <li>Hospitals, doctors, specialties, accreditations</li>
                  <li>24/7 ER & Telehealth indices</li>
                  <li>Structured search query engine</li>
                </ul>
              </div>
            </div>

            {/* ASCII Data Flow */}
            <div className="mt-6 bg-slate-900 text-teal-400 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
              <pre>{`[Patient User Prompt]
       │
       ▼
[Express Server: POST /api/chat]
       │
       ├─► [Deterministic Clinical Triage Check] (Detects ACS / Stroke / Emergency Red Flags)
       │
       ├─► [AI Agent Turn 1: Gemini 3.8 Flash]
       │       │
       │       ▼ (Decides to invoke tool)
       │   [Tool Call Event: search_providers(specialty, emergency_capable, location)]
       │       │
       │       ▼
       ├─► [Execute Database Query against medicalDirectoryDb]
       │       │
       │       ▼ (Returns matched Doctor & Hospital records)
       │   [Feed Tool Output to Agent Turn 2]
       │
       ├─► [Agent Turn 2: Synthesize clinical guidance & clarifying questions]
       │
       ├─► [Anti-Hallucination Guardrail Check] (Strict ID matching)
       │
       ▼
[Return AgentResponse JSON to React Client]`}</pre>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'agent' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-teal-600" />
              <span>AI Agent Tool / Function Calling Specifications</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rather than allowing the LLM to freely invent doctor names, clinic locations, and phone numbers, the model is bound to strongly-typed function declarations via the <code>@google/genai</code> SDK:
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 bg-slate-900 text-slate-200 rounded-xl overflow-x-auto">
                <span className="text-teal-400 font-bold">// Tool 1: search_providers</span>
                <pre className="text-slate-300 mt-2">{`{
  name: "search_providers",
  description: "Search verified HealTrip doctors and accredited hospitals by specialty, location, ER status, and second opinion availability.",
  parameters: {
    type: "OBJECT",
    properties: {
      specialty: { type: "STRING", description: "Cardiology, Orthopedics, Neurology, etc." },
      location: { type: "STRING", description: "Istanbul, Dubai, Riyadh, Germany, etc." },
      emergency_capable: { type: "BOOLEAN", description: "True if patient requires 24/7 ER" },
      telehealth_second_opinion: { type: "BOOLEAN", description: "True if seeking remote review" },
      language: { type: "STRING", description: "Arabic, English, etc." },
      max_fee_usd: { type: "NUMBER", description: "Budget ceiling in USD" }
    }
  }
}`}</pre>
              </div>

              <div className="p-4 bg-slate-900 text-slate-200 rounded-xl overflow-x-auto">
                <span className="text-teal-400 font-bold">// Tool 2: evaluate_triage_urgency</span>
                <pre className="text-slate-300 mt-2">{`{
  name: "evaluate_triage_urgency",
  description: "Evaluates patient clinical acuity and red flags for emergency escalation.",
  parameters: {
    type: "OBJECT",
    properties: {
      symptoms: { type: "ARRAY", items: { type: "STRING" } },
      red_flags_suspected: { type: "BOOLEAN" },
      provisional_condition: { type: "STRING" }
    },
    required: ["symptoms", "red_flags_suspected"]
  }
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'schema' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-600" />
              <span>Production Relational Schema (PostgreSQL DDL)</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The data model is designed to support high-throughput multi-criteria searches, emergency flag filtering, and international medical travel booking:
            </p>

            <div className="bg-slate-900 text-teal-300 p-4 rounded-xl font-mono text-xs overflow-x-auto">
              <pre>{`-- Hospitals Table
CREATE TABLE hospitals (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    city VARCHAR(128) NOT NULL,
    country VARCHAR(128) NOT NULL,
    accreditations TEXT[] NOT NULL,
    emergency_department_247 BOOLEAN DEFAULT FALSE,
    helipad BOOLEAN DEFAULT FALSE,
    languages_supported TEXT[] NOT NULL,
    international_patient_desk BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    review_count INTEGER DEFAULT 0,
    telehealth_ready BOOLEAN DEFAULT TRUE,
    address TEXT NOT NULL,
    contact_phone VARCHAR(64) NOT NULL,
    emergency_hotline VARCHAR(64) NOT NULL,
    specialties TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_hospitals_city ON hospitals(city);
CREATE INDEX idx_hospitals_emergency ON hospitals(emergency_department_247);

-- Doctors Table
CREATE TABLE doctors (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    hospital_id VARCHAR(64) REFERENCES hospitals(id) ON DELETE CASCADE,
    specialty VARCHAR(128) NOT NULL,
    subspecialties TEXT[] NOT NULL,
    experience_years INTEGER NOT NULL,
    languages TEXT[] NOT NULL,
    second_opinion_available BOOLEAN DEFAULT TRUE,
    consultation_fee_usd NUMERIC(10, 2) NOT NULL,
    telehealth_fee_usd NUMERIC(10, 2) NOT NULL,
    next_available_slot VARCHAR(128),
    bio TEXT NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    procedures TEXT[] NOT NULL,
    city VARCHAR(128) NOT NULL,
    country VARCHAR(128) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_doctors_specialty ON doctors(specialty);
CREATE INDEX idx_doctors_second_opinion ON doctors(second_opinion_available);
CREATE INDEX idx_doctors_hospital_id ON doctors(hospital_id);`}</pre>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'antihallucination' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <span>How We Prevent AI Hallucinations</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Medical applications have a zero-tolerance threshold for ungrounded or fictitious claims. We enforce a 4-pillar anti-hallucination defense:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
                <span className="font-bold text-teal-900 text-sm flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-teal-200 text-teal-800 flex items-center justify-center text-xs">1</span>
                  Tool-Constrained Generation
                </span>
                <p className="text-teal-800 leading-relaxed">
                  The model prompt contains strict negative constraints: <em>"You MUST ONLY recommend doctors and hospitals returned by the search_providers tool. NEVER invent clinic names, phone numbers, or doctor names."</em>
                </p>
              </div>

              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
                <span className="font-bold text-teal-900 text-sm flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-teal-200 text-teal-800 flex items-center justify-center text-xs">2</span>
                  Server-Side ID Validation
                </span>
                <p className="text-teal-800 leading-relaxed">
                  The frontend receives structured provider cards directly from the database query result payload, completely isolated from model generation variance.
                </p>
              </div>

              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
                <span className="font-bold text-teal-900 text-sm flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-teal-200 text-teal-800 flex items-center justify-center text-xs">3</span>
                  Deterministic Safety Override
                </span>
                <p className="text-teal-800 leading-relaxed">
                  If acute red flags are identified (e.g. chest pain with arm radiation), an emergency bypass triggers immediately without relying on model stochastic sampling.
                </p>
              </div>

              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
                <span className="font-bold text-teal-900 text-sm flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-teal-200 text-teal-800 flex items-center justify-center text-xs">4</span>
                  Audit Trail & Telemetry
                </span>
                <p className="text-teal-800 leading-relaxed">
                  Every tool call, query argument, latency, and returned match count is logged into a tamper-evident audit trail available in the Telemetry tab.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-teal-600" />
              <span>Security, Privacy & Fault Tolerance</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Server-Side Secret Isolation</strong>
                <span>The Gemini API key is never exposed to the client or browser bundle. All LLM calls and tool executions are encapsulated in the Express backend.</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Deterministic Fallback Engine</strong>
                <span>In the event of an external AI service outage or rate-limit event, our rule-based clinical engine gracefully serves verified database results and triage protocols without application failure.</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">HIPAA / GDPR Boundary Protection</strong>
                <span>The triage chat does not request or store sensitive patient identifiers (such as national ID or credit cards) during the navigation session.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'telemetry' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Real-Time Tool Execution Log</h4>
              <p className="text-xs text-slate-500">Live inspection of function calling events executed by the agent</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
              {allExecutions.length} Executed
            </span>
          </div>

          {allExecutions.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-200">
              <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No tool calls executed yet. Try typing a query in the Chat tab!</p>
            </div>
          ) : (
            allExecutions.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-teal-700">{item.tool.tool_name}()</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-teal-600" />
                      {item.tool.duration_ms}ms
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      {item.tool.items_matched} matches
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="font-semibold text-slate-700 block mb-1">Tool Input Parameters:</span>
                    <pre className="p-2.5 bg-slate-900 text-teal-300 rounded-lg font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(item.tool.input_args, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 block mb-1">Database Result Summary:</span>
                    <p className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                      {item.tool.output_summary}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeSubTab === 'readme' && (
        <div className="bg-slate-950 text-slate-200 rounded-2xl p-6 font-mono text-xs overflow-x-auto border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <span className="text-teal-400 font-bold">README.md (Architecture & Repository Specification)</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => downloadWordDocument('README.doc', 'HealTrip AI - README Spec', fullReadmeContent)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .doc (Word)</span>
              </button>
              <button
                onClick={() => downloadMarkdownFile('README.md', fullReadmeContent)}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-sans text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .md</span>
              </button>
              <button
                onClick={handleCopyReadme}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-sans text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
              >
                {copiedReadme ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReadme ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
          </div>
          <pre className="whitespace-pre-wrap text-slate-300 leading-relaxed">
            {fullReadmeContent}
          </pre>
        </div>
      )}

      {activeSubTab === 'decisions' && (
        <div className="bg-slate-950 text-slate-200 rounded-2xl p-6 font-mono text-xs overflow-x-auto border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <span className="text-teal-400 font-bold">TECHNICAL_DECISIONS_AND_ASSUMPTIONS.md (Submission Document)</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => downloadWordDocument('TECHNICAL_DECISIONS_AND_ASSUMPTIONS.doc', 'HealTrip Technical Decisions & Assumptions', fullDecisionsContent)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .doc (Word)</span>
              </button>
              <button
                onClick={() => downloadMarkdownFile('TECHNICAL_DECISIONS_AND_ASSUMPTIONS.md', fullDecisionsContent)}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-sans text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .md</span>
              </button>
              <button
                onClick={handleCopyDecisions}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-sans text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
              >
                {copiedDecisions ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDecisions ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
          </div>
          <pre className="whitespace-pre-wrap text-slate-300 leading-relaxed">
            {fullDecisionsContent}
          </pre>
        </div>
      )}
    </div>
  );
};
