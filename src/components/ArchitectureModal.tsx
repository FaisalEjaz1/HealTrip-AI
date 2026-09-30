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
  FileJson
} from 'lucide-react';
import { MessageItem, ToolExecutionRecord } from '../types/index.js';

interface ArchitectureModalProps {
  language: 'en' | 'ar';
  messages?: MessageItem[];
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ language, messages = [] }) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'agent' | 'schema' | 'antihallucination' | 'security' | 'telemetry' | 'readme'>('overview');
  const [copied, setCopied] = useState(false);

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

  const handleCopyReadme = () => {
    navigator.clipboard.writeText(fullReadmeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
            Transparent architectural blueprints, tool calling contracts, database entity models, anti-hallucination guardrails, and production considerations.
          </p>
        </div>

        <button
          onClick={handleCopyReadme}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shadow-sm self-start md:self-center"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Full README.md!' : 'Copy README.md (For GitHub)'}</span>
        </button>
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
          <span>Raw README.md</span>
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
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-teal-400 font-bold">README.md (Ready to submit)</span>
            <button
              onClick={handleCopyReadme}
              className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-sans text-xs font-semibold hover:bg-teal-500 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-slate-300 leading-relaxed">
            {fullReadmeContent}
          </pre>
        </div>
      )}
    </div>
  );
};
