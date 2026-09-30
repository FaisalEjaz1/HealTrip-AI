import { Router, Request, Response } from 'express';
import { healTripAiAgent, ChatMessage } from '../ai/agent.js';
import { medicalDirectoryDb } from '../db/database.js';

export const apiRouter = Router();

// Chat endpoint with AI Agent and Tool Calling
apiRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const { messages, language } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Invalid request: messages array is required.'
      });
    }

    const preferredLanguage = language === 'ar' ? 'ar' : 'en';
    const agentResult = await healTripAiAgent.processPatientQuery(
      messages as ChatMessage[],
      preferredLanguage
    );

    return res.json(agentResult);
  } catch (error: any) {
    console.error('Error processing /api/chat:', error);
    return res.status(500).json({
      error: 'Failed to process patient consultation.',
      details: error?.message || 'Internal server error'
    });
  }
});

// Search verified providers directly from database
apiRouter.get('/providers', (req: Request, res: Response) => {
  try {
    const { specialty, location, emergency_capable, telehealth_second_opinion, language, max_fee_usd } = req.query;

    const result = medicalDirectoryDb.search({
      specialty: typeof specialty === 'string' ? specialty : undefined,
      location: typeof location === 'string' ? location : undefined,
      emergency_capable: emergency_capable === 'true',
      telehealth_second_opinion: telehealth_second_opinion === 'true',
      language: typeof language === 'string' ? language : undefined,
      max_fee_usd: typeof max_fee_usd === 'string' ? Number(max_fee_usd) : undefined
    });

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to search providers' });
  }
});

// Provider detail endpoint
apiRouter.get('/providers/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const doctor = medicalDirectoryDb.getDoctorById(id);
  if (doctor) {
    const hospital = medicalDirectoryDb.getHospitalById(doctor.hospital_id);
    return res.json({ type: 'doctor', data: doctor, hospital });
  }

  const hospital = medicalDirectoryDb.getHospitalById(id);
  if (hospital) {
    return res.json({ type: 'hospital', data: hospital });
  }

  return res.status(404).json({ error: 'Provider not found in database' });
});

// System Architecture & Technical Specifications endpoint
apiRouter.get('/system-architecture', (req: Request, res: Response) => {
  return res.json({
    project: 'HealTrip AI Patient Decision Assistant',
    version: '1.0.0-prototype',
    framework: 'React 19 + Vite (Frontend) | Node.js + Express (Backend) | Google Gemini 3.8 Flash (LLM/Agentic)',
    architecture: {
      layers: [
        {
          name: 'Presentation Layer (React 19 SPA)',
          responsibilities: [
            'Bilingual LTR / RTL conversational UI (English / Arabic)',
            'Dynamic Clinical Triage Urgency visualization (Red Flag Emergency, Urgent, Specialist, 2nd Opinion)',
            'Contextual Clarifying Question action pills for rapid patient answering',
            'Verified Healthcare Provider cards (with JCI accreditation, fees, language, emergency badges)',
            'Real-Time Agent Telemetry Inspector (Live display of tool invocations, inputs, results, and latency)'
          ]
        },
        {
          name: 'Application & Agentic Layer (Express + Gemini API)',
          responsibilities: [
            'Gemini 3.8 Flash orchestration with native Function / Tool Calling declarations',
            'Rule-based Clinical Triage Pre-Screening (Acute Coronary Syndrome, Stroke FAST, Meningitis detection)',
            'Tool Calling Loop: Intercepting model tool calls, executing queries against local structured DB, feeding results back',
            'Deterministic Fallback Pipeline: Ensures 100% test reliability if API key hits rate limits or network issues',
            'Anti-Hallucination Verification: Post-generation validation cross-referencing recommended doctor IDs with DB query records'
          ]
        },
        {
          name: 'Data & Persistence Layer',
          responsibilities: [
            'Relational-ready Normalized Schema: Hospitals, Doctors, Specialties, Accreditations, Availability',
            'Multi-faceted querying: By specialty, geography, 24/7 ER status, telehealth readiness, language, price ceiling',
            'Audit Trail: Logging each tool invocation, execution parameters, item counts, and elapsed latency'
          ]
        }
      ],
      antiHallucinationGuardrails: [
        'Tool-Restricted Recommendations: The agent prompt explicitly forbids recommending non-database clinics or numbers.',
        'Strict Object Mapping: The client receives strongly-typed Doctor/Hospital objects directly from server DB results, eliminating model synthetic hallucination.',
        'Deterministic Safety Pre-Filter: Red-flag symptoms trigger an immediate emergency alert that cannot be hallucinated away by LLM temperature fluctuations.'
      ],
      securityAndCompliance: [
        'Zero Browser Secret Exposure: All Gemini SDK operations and API keys reside exclusively on the server.',
        'PII Minimization: Chat sessions are processed without requiring patient National ID or payment details.',
        'Clinical Boundary Disclaimers: Prominent advisory explaining the assistant is a triage navigation prototype, not a final medical diagnosis or substitute for emergency dispatch.'
      ]
    },
    databaseSchema: {
      entities: [
        {
          table: 'hospitals',
          fields: [
            { name: 'id', type: 'VARCHAR(64)', pk: true },
            { name: 'name', type: 'VARCHAR(255)', index: true },
            { name: 'city', type: 'VARCHAR(128)', index: true },
            { name: 'country', type: 'VARCHAR(128)', index: true },
            { name: 'accreditations', type: 'TEXT[]' },
            { name: 'emergency_department_247', type: 'BOOLEAN', index: true },
            { name: 'telehealth_ready', type: 'BOOLEAN' },
            { name: 'languages_supported', type: 'TEXT[]' },
            { name: 'specialties', type: 'TEXT[]' }
          ]
        },
        {
          table: 'doctors',
          fields: [
            { name: 'id', type: 'VARCHAR(64)', pk: true },
            { name: 'name', type: 'VARCHAR(255)', index: true },
            { name: 'hospital_id', type: 'VARCHAR(64)', fk: 'hospitals.id', index: true },
            { name: 'specialty', type: 'VARCHAR(128)', index: true },
            { name: 'subspecialties', type: 'TEXT[]' },
            { name: 'experience_years', type: 'INTEGER' },
            { name: 'languages', type: 'TEXT[]' },
            { name: 'second_opinion_available', type: 'BOOLEAN', index: true },
            { name: 'consultation_fee_usd', type: 'NUMERIC(10,2)' },
            { name: 'telehealth_fee_usd', type: 'NUMERIC(10,2)' }
          ]
        }
      ]
    }
  });
});

// Health check endpoint
apiRouter.get('/health', (req: Request, res: Response) => {
  return res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    gemini_key_configured: Boolean(process.env.GEMINI_API_KEY),
    stats: {
      total_doctors: medicalDirectoryDb.getAllDoctors().length,
      total_hospitals: medicalDirectoryDb.getAllHospitals().length,
      specialties_indexed: medicalDirectoryDb.getAllSpecialties()
    }
  });
});
