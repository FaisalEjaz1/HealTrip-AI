# HealTrip AI Patient Decision Assistant

> **Technical Evaluation Prototype for HealTrip**
> Developed to demonstrate full-stack engineering, clinical triage, grounded AI agent design with tool calling, and anti-hallucination architecture.

---

## 1. Executive Summary & Problem Scope

When patients experience ambiguous or concerning medical symptoms—such as:
> *"I have chest pain and I'm not sure whether I should see a cardiologist, go to the ER, or seek a second opinion."*

A naive conversational AI presents two catastrophic risks:
1. **Safety Failure**: Under-triaging acute emergencies (e.g., advising an elective consultation or a remote second opinion when the patient is in fact experiencing Acute Coronary Syndrome).
2. **Hallucination Risk**: Inventing fictitious clinics, non-existent doctor names, arbitrary pricing, or wrong contact information.

The **HealTrip AI Patient Decision Assistant** demonstrates an engineering architecture that systematically mitigates these risks using **deterministic clinical pre-screening, native LLM tool calling, grounded database retrieval, and post-generation verification**.

---

## 2. Architecture & Data Flow

```text
[ Patient / Browser (React 19 SPA) ]
                 │
                 │ JSON over HTTPS (Bilingual English / Arabic)
                 ▼
[ Full-Stack Express Server (server.ts) ]
                 │
                 ├──► Step 1: Clinical Triage Pre-Screening
                 │    Rule-based safety evaluator detecting ACS, Stroke FAST, Meningitis
                 │
                 ├──► Step 2: Gemini 3.8 Flash Agent Orchestration
                 │    System prompts + Function/Tool Calling Declarations
                 │    Tool: search_providers(...) & evaluate_triage_urgency(...)
                 │
                 ├──► Step 3: Structured Database Execution
                 │    Queries indexed registry of JCI-accredited Hospitals & Doctors
                 │    (Istanbul, Dubai, Riyadh, Amman, Berlin, London)
                 │
                 ├──► Step 4: Tool Response Synthesis
                 │    Model incorporates tool query results into clinical explanation
                 │
                 ├──► Step 5: Anti-Hallucination & Grounding Check
                 │    Verifies returned doctor/hospital IDs match database entities
                 │
                 ▼
[ Strongly Typed AgentResponse Payload delivered to Frontend ]
```

---

## 3. AI Agent Design & Tool Calling

### Core Tools Declared to LLM:
1. `search_providers`:
   - `specialty` (e.g. Cardiology, Orthopedics, Neurology)
   - `location` (City or Country)
   - `emergency_capable` (Boolean: requires 24/7 ER facility)
   - `telehealth_second_opinion` (Boolean: seeking remote review)
   - `language` (e.g. Arabic, English)
   - `max_fee_usd` (Budget constraint)
2. `evaluate_triage_urgency`:
   - `symptoms` (Array of reported symptoms)
   - `red_flags_suspected` (Boolean)
   - `provisional_condition` (Differential diagnosis)

### Multi-Turn Tool Loop:
- The backend evaluates the patient's message.
- If medical matching or triage confirmation is needed, Gemini emits `functionCalls`.
- The backend executes the function against the local structured medical directory, logs latency and matched records, and passes the `functionResponse` back to the model.
- The model produces natural clinical recommendations and 2-3 focused clarifying questions.

---

## 4. Preventing AI Hallucinations

Medical applications demand strict verification:
1. **Negative Constraint Prompting**: The system prompt forbids inventing providers, phone numbers, or addresses.
2. **Server-Side Data Binding**: Provider cards rendered on the UI are populated **directly from the database query payload**, not synthesized from unstructured LLM text tokens.
3. **Emergency Bypass**: If critical red flags are present, the system elevates the case to `EMERGENCY_RED_FLAG`, triggering emergency hotlines (911 / 998 / 112) regardless of model temperature.
4. **Auditability**: Every tool call, parameters, latency, and matched count is recorded in the Telemetry inspector.

---

## 5. Database Structure & Relational Schema (PostgreSQL DDL)

```sql
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
```

---

## 6. Security, Privacy & Reliability

- **Zero Secret Exposure**: The `GEMINI_API_KEY` is loaded exclusively in `server.ts` via `process.env.GEMINI_API_KEY`. No API keys or credentials ever reach the client bundle.
- **Graceful Deterministic Fallback**: If the external AI API experiences network disruption or rate limiting, the backend automatically transitions to the deterministic clinical decision engine, guaranteeing 100% test reliability.
- **Bilingual RTL/LTR**: Dynamic Arabic and English interface with localized medical phrasing.

---

## 7. How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Add your Gemini API key in .env (optional; fallback engine operates automatically if absent)
echo 'GEMINI_API_KEY="your-api-key"' > .env

# 3. Start development server (Port 3000)
npm run dev

# 4. Open in browser:
http://localhost:3000
```
