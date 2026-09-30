# HealTrip Technical Decisions, Assumptions & Architecture Notes

**Candidate Submission Document**  
**Role:** Full-Stack / AI Engineer  
**Project:** HealTrip AI Patient Decision Assistant  
**Date:** September 2026  

---

## 1. Executive Overview

This document accompanies the submission of the **HealTrip AI Patient Decision Assistant**. It details the clinical and technical assumptions, architectural trade-offs, defensive design principles, and future engineering roadmap considered while designing this prototype.

The goal of this project is to solve a high-stakes clinical dilemma:
> *"A patient experiences ambiguous or concerning symptoms (e.g. chest pain, joint immobility, chronic headaches) and does not know whether they require an immediate 24/7 Emergency Room, an in-person specialist clinic, or a remote international second opinion."*

A generic LLM chatbot is hazardous in this domain because of **under-triaging acute emergencies** and **hallucinating fictitious doctors, fake phone numbers, or arbitrary prices**. Our solution pairs modern agentic tool calling with deterministic clinical safety gates.

---

## 2. Key Assumptions

### 2.1 Clinical & Triage Assumptions
1. **Safety Over Fluency (Zero-Harm Principle):** In healthcare, false negatives on acute red flags (e.g., dismissing Acute Coronary Syndrome as "mild indigestion") can be fatal. We assume that deterministic safety rules must precede probabilistic LLM reasoning.
2. **Patient Urgency Spectrum:** Patient needs fall into 4 distinct clinical buckets:
   - `EMERGENCY_RED_FLAG`: Immediate threat to life/limb (e.g., active crushing chest pain radiating to left arm/jaw, stroke signs, breathing distress). Requires immediate emergency dispatch (911/998/112) and 24/7 emergency department routing.
   - `URGENT_EVALUATION`: Severe, worsening, or acute onset without immediate instability (requires clinical evaluation within 24–48 hours).
   - `SPECIALIST_CONSULT`: Chronic, localized, non-acute issues needing diagnostic workup (e.g., progressive knee pain, localized migraines).
   - `SECOND_OPINION_TELEHEALTH`: Existing diagnosis or proposed major surgery (e.g., joint replacement, cardiac stent) where the patient seeks an independent cross-border specialist review before committing.
3. **Medical Tourism Feasibility:** International second opinions are appropriate only when the patient is clinically stable and possesses existing diagnostic materials (MRI, CT, angiograms, or pathology reports).

### 2.2 User Persona & Usability Assumptions
1. **High Stress & Cognitive Load:** Patients seeking triage are anxious. The interface must provide instant visual clarity (urgency badges, emergency callouts, one-tap clarifying questions) rather than overwhelming text walls.
2. **Regional & Cross-Border Demographics:** HealTrip's core demographic spans the GCC (UAE, Saudi Arabia, Qatar) and global medical travel hubs (Turkey, Germany, Jordan, UK). The platform assumes full native support for **Arabic (العربية, RTL)** and **English (LTR)**.
3. **Bandwidth & Connectivity:** Mobile users in emergency situations may experience intermittent mobile connections; latency must be minimized, and the app must never white-screen.

### 2.3 System & Data Assumptions
1. **Accreditation as Trust Currency:** In medical tourism, patients prioritize internationally accredited institutions (JCI, ISO, Mayo Clinic Care Network). All mock providers are modeled around real accredited centers in Istanbul, Dubai, Riyadh, Amman, Berlin, and London.
2. **Doctor-Hospital Relational Integrity:** Doctors belong to accredited hospitals. Recommendations must link the practitioner to physical facilities equipped with relevant capabilities (e.g., catheterization labs, helipads, 24/7 ERs).

---

## 3. Technical & Architectural Decisions

### Decision 1: Agentic Native Tool Calling vs. Pure RAG vs. Freeform LLM
- **Alternatives Considered:**
  - *Freeform Prompting:* Letting the LLM generate doctor recommendations from its pre-training memory. (Rejected: Catastrophic hallucination rate; models invent fictitious clinic names and outdated phone numbers).
  - *Pure Vector RAG:* Embedding doctor bios into a vector database and returning text snippets. (Rejected: Unreliable structured filtering; cannot reliably enforce strict constraints like `emergency_department_247 == true` or `consultation_fee_usd <= 200`).
- **Chosen Approach:** **Agentic Native Tool Calling (Function Calling)**.
  - The model is supplied with JSON schema declarations: `search_providers` and `evaluate_triage_urgency`.
  - When the user asks for guidance, Gemini 3.8 Flash emits structured arguments (e.g., `specialty: "Cardiology", emergency_capable: true, location: "Dubai"`).
  - The backend intercepts the call, queries the structured registry, and feeds verified records back into the model's reasoning loop.
- **Benefit:** Guarantees that 100% of recommended doctors and hospitals physically exist in HealTrip's network with verified IDs, phone numbers, and pricing.

---

### Decision 2: Rule-Based Clinical Safety Gate (Pre-LLM Triage)
- **Problem:** LLMs have non-zero temperature and can occasionally misinterpret emergency symptoms as non-urgent when prompted conversationally.
- **Chosen Approach:** A deterministic pre-screening clinical engine (`triageEngine.ts`) parses the patient query against clinical red-flag dictionaries (derived from AHA, NICE, and ERC emergency triage guidelines) before the LLM generates advice.
- **Benefit:** If crushing chest pain or stroke symptoms are identified, the system immediately displays emergency dispatch protocols (911 / 998 / 112) regardless of model latency, API availability, or hallucination.

---

### Decision 3: Deterministic Fallback Engine (Zero-Downtime Guarantee)
- **Problem:** External AI APIs can suffer network partitions, rate limits (HTTP 429), or API key misconfigurations in staging/testing environments.
- **Chosen Approach:** Dual-pipeline architecture in `server/ai/agent.ts`.
  - Primary path: Gemini 3.8 Flash with tool calling.
  - Fallback path: If the API client is unconfigured or throws an error, the system automatically falls back to `buildDeterministicAgentResponse()`.
- **Benefit:** The application is 100% resilient. It will never return a 500 error or crash during an interview evaluation, even with no internet access or without an API key.

---

### Decision 4: Express Serverless Handler on Vercel (`api/index.ts`)
- **Alternatives Considered:**
  - Client-only React app directly calling Gemini via browser SDK. (Rejected: Leaks `GEMINI_API_KEY` to browser DevTools; breaches HIPAA/security best practices).
  - Dedicated Docker container on AWS ECS/Render. (Valid, but slower to deploy for code reviews).
- **Chosen Approach:** Express mounted as a Vercel Serverless Function (`api/index.ts`) with Vite static assets in `dist/`.
- **Benefit:** Server-side secret isolation, zero API key leakage, instant global serverless edge deployment, and single-repository ergonomics.

---

### Decision 5: Bilingual Architecture (English LTR / Arabic RTL)
- **Chosen Approach:** Built from the ground up with directional context (`dir="rtl"` vs `dir="ltr"`), bilingual system prompt instructions, and Arabic localization dictionaries.
- **Benefit:** Provides a native Arabic user experience suited to Middle Eastern patients seeking medical travel in Turkey, Germany, or the UAE.

---

### Decision 6: Relational Schema DDL Design (PostgreSQL Ready)
- **Design:** While the prototype runs on a high-performance in-memory mock database with relational lookups, the data model is strictly defined in PostgreSQL DDL (`hospitals`, `doctors`, indexes, and foreign keys).
- **Benefit:** Frictionless migration to PostgreSQL / Cloud SQL using Drizzle ORM or Prisma when transitioning from prototype to production.

---

## 4. Edge Cases Handled

| Edge Case | Risk | Mitigation |
| :--- | :--- | :--- |
| **Acute Coronary Syndrome (Heart Attack)** | Patient waits for an elective clinic while having an active infarct. | Pre-LLM triage triggers `EMERGENCY_RED_FLAG` banner, emergency dispatch advice, and filters exclusively for 24/7 ER hospitals. |
| **Zero Database Matches** | Model hallucinates non-existent local clinics to fill the gap. | Anti-hallucination verification rejects synthetic entities; system displays polite fallback explaining no providers currently match that specific filter. |
| **Ambiguous or Vague Symptom Description** | Model gives overly broad or inaccurate medical advice. | Agent generates 2–3 interactive clarifying question chips (e.g. *"Does the pain radiate to your left arm or jaw?"*) to help patients clarify their clinical picture in one click. |
| **Missing or Expired API Key** | App displays an ugly red error stack trace. | Automatic fallback to clinical rule engine; health endpoint (`/api/health`) reports key status with diagnostic telemetry. |
| **RTL Layout Breakage** | Broken alignment, misaligned icons, or reversed chevron arrows. | Semantic Tailwind RTL classes (`rtl:space-x-reverse`, `start-0`, `end-0`) ensure pixel-perfect rendering across languages. |

---

## 5. Security, Privacy & Compliance Posture

1. **Zero Secret Leakage:** The Gemini API key is isolated on the server (`process.env.GEMINI_API_KEY`). The browser bundle contains zero credentials.
2. **PII Minimization:** The triage conversation requires no patient national ID numbers, credit cards, or insurance policy identifiers during the initial decision-making phase.
3. **Clinical Disclaimer:** Every response includes prominent legal and clinical disclaimers stating that the tool provides clinical decision support and does not replace emergency dispatch or definitive physician diagnosis.

---

## 6. Production Scaling Roadmap (Next Steps)

If taking this prototype into production for HealTrip, the recommended architecture evolution includes:

1. **Database Persistence:**
   - Migrate in-memory directory to managed **PostgreSQL (Cloud SQL / Supabase)** with **Drizzle ORM**.
   - Add spatial indexing (`PostGIS`) for geospatial radius queries (e.g., *"Find JCI hospitals within 25km of Istanbul Airport"*).
2. **Hybrid Search (Vector + Relational):**
   - Combine structured SQL filtering (specialty, pricing, accreditations) with vector embeddings (pgvector) to index doctor research papers, surgical case logs, and patient testimonials.
3. **EHR / Telehealth Integration:**
   - Connect to standard **HL7 / FHIR** APIs to enable automated record ingestion (DICOM viewers for MRI/CT scans).
   - Integrate WebRTC (e.g., Twilio / Agora) for direct video consultations from the recommended doctor cards.
4. **Physician-in-the-Loop Audit Queue:**
   - Implement an asynchronous audit dashboard where HealTrip medical directors review AI triage conversations to continuously evaluate accuracy and refine prompts.
