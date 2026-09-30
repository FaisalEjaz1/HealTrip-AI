export type TriageUrgency = 
  | 'EMERGENCY_RED_FLAG'
  | 'URGENT_24_48H'
  | 'SPECIALIST_CONSULT'
  | 'SECOND_OPINION_TELEHEALTH';

export interface Hospital {
  id: string;
  name: string;
  name_ar: string;
  city: string;
  city_ar: string;
  country: string;
  country_ar: string;
  accreditations: string[];
  emergency_department_247: boolean;
  helipad: boolean;
  languages_supported: string[];
  international_patient_desk: boolean;
  rating: number;
  review_count: number;
  telehealth_ready: boolean;
  address: string;
  contact_phone: string;
  emergency_hotline: string;
  specialties: string[];
}

export interface Doctor {
  id: string;
  name: string;
  name_ar: string;
  title: string;
  title_ar: string;
  hospital_id: string;
  hospital_name: string;
  hospital_name_ar: string;
  specialty: string;
  subspecialties: string[];
  experience_years: number;
  languages: string[];
  education: string;
  second_opinion_available: boolean;
  consultation_fee_usd: number;
  telehealth_fee_usd: number;
  next_available_slot: string;
  bio: string;
  bio_ar: string;
  rating: number;
  review_count: number;
  procedures: string[];
  city: string;
  country: string;
}

export interface ToolExecutionRecord {
  id: string;
  timestamp: string;
  tool_name: string;
  input_args: Record<string, any>;
  output_summary: string;
  items_matched: number;
  duration_ms: number;
}

export interface SuggestedNextStep {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  actionType: 'EMERGENCY_DISPATCH' | 'BOOK_CONSULT' | 'REQUEST_SECOND_OPINION' | 'UPLOAD_REPORTS';
}

export interface AgentResponse {
  reply: string;
  triageLevel: TriageUrgency;
  confidence: number;
  detectedRedFlags: string[];
  suggestedNextStep: SuggestedNextStep;
  clarifyingQuestions: string[];
  toolExecutions: ToolExecutionRecord[];
  recommendedDoctors: Doctor[];
  recommendedHospitals: Hospital[];
  groundedVerification: {
    status: 'GROUNDED_AND_VERIFIED' | 'SAFETY_OVERRIDE';
    recordsChecked: number;
    antiHallucinationPassed: boolean;
  };
  modelUsed?: string;
}

export interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  agentData?: AgentResponse;
}
