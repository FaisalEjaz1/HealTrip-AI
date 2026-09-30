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

export type TriageUrgency = 
  | 'EMERGENCY_RED_FLAG'      // Immediate ER / Ambulance (e.g., active acute coronary syndrome, stroke)
  | 'URGENT_24_48H'           // Urgent clinic / same-day specialist
  | 'SPECIALIST_CONSULT'      // In-person comprehensive cardiology / specialty consult
  | 'SECOND_OPINION_TELEHEALTH'; // Remote review of existing scans, lab work, surgery plans

export interface ProviderSearchParams {
  specialty?: string;
  location?: string;
  emergency_capable?: boolean;
  telehealth_second_opinion?: boolean;
  language?: string;
  max_fee_usd?: number;
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
