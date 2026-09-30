import { Hospital, Doctor, ProviderSearchParams } from './types.js';

export const HOSPITALS: Hospital[] = [
  {
    id: 'hosp-001',
    name: 'Acıbadem Maslak Hospital',
    name_ar: 'مستشفى أتشيبادم مسلك',
    city: 'Istanbul',
    city_ar: 'إسطنبول',
    country: 'Turkey',
    country_ar: 'تركيا',
    accreditations: ['JCI Accredited', 'ISO 9001', 'Temos International'],
    emergency_department_247: true,
    helipad: true,
    languages_supported: ['English', 'Arabic', 'Turkish', 'Russian', 'French'],
    international_patient_desk: true,
    rating: 4.9,
    review_count: 1420,
    telehealth_ready: true,
    address: 'Büyükdere Cd. No:40, Sarıyer, Istanbul',
    contact_phone: '+90 212 304 44 44',
    emergency_hotline: '112 / +90 212 304 49 11',
    specialties: ['Cardiology', 'Cardiac Surgery', 'Oncology', 'Orthopedics', 'Neurosurgery', 'Emergency Medicine']
  },
  {
    id: 'hosp-002',
    name: 'American Hospital Dubai',
    name_ar: 'المستشفى الأمريكي دبي',
    city: 'Dubai',
    city_ar: 'دبي',
    country: 'UAE',
    country_ar: 'الإمارات العربية المتحدة',
    accreditations: ['JCI Accredited', 'CAP Accredited', 'Mayo Clinic Care Network'],
    emergency_department_247: true,
    helipad: true,
    languages_supported: ['Arabic', 'English', 'French', 'Hindi', 'Urdu'],
    international_patient_desk: true,
    rating: 4.8,
    review_count: 2150,
    telehealth_ready: true,
    address: '19th St, Oud Metha, Dubai',
    contact_phone: '+971 4 377 5500',
    emergency_hotline: '998 / +971 4 377 5000',
    specialties: ['Cardiology', 'Interventional Cardiology', 'Emergency Medicine', 'Orthopedics', 'Neurology']
  },
  {
    id: 'hosp-003',
    name: 'King Faisal Specialist Hospital & Research Centre',
    name_ar: 'مستشفى الملك فيصل التخصصي ومركز الأبحاث',
    city: 'Riyadh',
    city_ar: 'الرياض',
    country: 'Saudi Arabia',
    country_ar: 'المملكة العربية السعودية',
    accreditations: ['JCI Accredited', 'Magnet Recognized', 'HIMSS Stage 7'],
    emergency_department_247: true,
    helipad: true,
    languages_supported: ['Arabic', 'English'],
    international_patient_desk: true,
    rating: 4.9,
    review_count: 3800,
    telehealth_ready: true,
    address: 'Zahrawi St, Al Maather, Riyadh',
    contact_phone: '+966 11 464 7272',
    emergency_hotline: '997 / +966 11 442 7777',
    specialties: ['Cardiology', 'Oncology', 'Organ Transplant', 'Genomics', 'Emergency Medicine']
  },
  {
    id: 'hosp-004',
    name: 'King Hussein Cancer Center & Specialist Clinics',
    name_ar: 'مركز الحسين للسرطان والعيادات التخصصية',
    city: 'Amman',
    city_ar: 'عَمّان',
    country: 'Jordan',
    country_ar: 'الأردن',
    accreditations: ['JCI Accredited', 'CCPC Oncology Certified'],
    emergency_department_247: true,
    helipad: false,
    languages_supported: ['Arabic', 'English'],
    international_patient_desk: true,
    rating: 4.9,
    review_count: 1890,
    telehealth_ready: true,
    address: 'Queen Rania Al Abdullah St, Amman',
    contact_phone: '+962 6 530 0460',
    emergency_hotline: '911 / +962 6 530 0499',
    specialties: ['Oncology', 'Cardio-Oncology', 'Palliative Care', 'Second Opinions']
  },
  {
    id: 'hosp-005',
    name: 'Charité – Universitätsmedizin Berlin',
    name_ar: 'مستشفى شاريتيه الجامعي برلين',
    city: 'Berlin',
    city_ar: 'برلين',
    country: 'Germany',
    country_ar: 'ألمانيا',
    accreditations: ['German Quality Award in Healthcare', 'ISO 9001', 'Top Global Hospital'],
    emergency_department_247: true,
    helipad: true,
    languages_supported: ['German', 'English', 'Arabic', 'Russian'],
    international_patient_desk: true,
    rating: 4.9,
    review_count: 4200,
    telehealth_ready: true,
    address: 'Charitépl. 1, 10117 Berlin',
    contact_phone: '+49 30 450 50',
    emergency_hotline: '112 / +49 30 450 531 000',
    specialties: ['Cardiology', 'Neurosurgery', 'Complex Surgery', 'Second Opinions', 'Rare Diseases']
  },
  {
    id: 'hosp-006',
    name: 'Royal Brompton & Harefield Specialist Care',
    name_ar: 'رويال برومبتون التخصصي للقلب والرئة',
    city: 'London',
    city_ar: 'لندن',
    country: 'United Kingdom',
    country_ar: 'المملكة المتحدة',
    accreditations: ['CQC Outstanding', 'International Heart Centre of Excellence'],
    emergency_department_247: false, // Tertiary Referral & Elective Specialist
    helipad: false,
    languages_supported: ['English', 'Arabic', 'French'],
    international_patient_desk: true,
    rating: 4.9,
    review_count: 980,
    telehealth_ready: true,
    address: 'Sydney St, Chelsea, London SW3 6NP',
    contact_phone: '+44 20 7352 8121',
    emergency_hotline: '999 (Refer to St Thomas / Chelsea Emergency)',
    specialties: ['Cardiology', 'Cardiac Electrophysiology', 'Thoracic Surgery', 'Second Opinions']
  }
];

export const DOCTORS: Doctor[] = [
  {
    id: 'doc-001',
    name: 'Dr. Ahmet Sinan Demir',
    name_ar: 'د. أحمد سنان دمير',
    title: 'Professor & Senior Interventional Cardiologist',
    title_ar: 'أستاذ واستشاري أول أمراض القلب التداخلية',
    hospital_id: 'hosp-001',
    hospital_name: 'Acıbadem Maslak Hospital',
    hospital_name_ar: 'مستشفى أتشيبادم مسلك',
    specialty: 'Cardiology',
    subspecialties: ['Coronary Angiography', 'TAVI', 'Angina Pectoris & Acute Coronary Care', 'Chest Pain Assessment'],
    experience_years: 24,
    languages: ['English', 'Turkish', 'Arabic (Basic)'],
    education: 'Hacettepe University Faculty of Medicine | Cleveland Clinic Fellow',
    second_opinion_available: true,
    consultation_fee_usd: 180,
    telehealth_fee_usd: 140,
    next_available_slot: 'Today, 16:30 (Urgent slot available) / Tomorrow, 10:00',
    bio: 'Pioneer in minimally invasive catheterization, acute coronary syndrome evaluation, and complex coronary stenting with over 6,500 successful procedures.',
    bio_ar: 'رائد في القسطرة القلبية التداخلية بأقل تدخل جراحي، وتقييم متلازمة الشريان التاجي الحادة، وعلاج آلام الصدر المعقدة مع أكثر من 6500 إجراء ناجح.',
    rating: 4.95,
    review_count: 320,
    procedures: ['Coronary Angioplasty', 'Cardiac CT Review', 'Stress Echocardiogram', 'Chest Pain Triage'],
    city: 'Istanbul',
    country: 'Turkey'
  },
  {
    id: 'doc-002',
    name: 'Dr. Tariq Al-Mansoor',
    name_ar: 'د. طارق المنصور',
    title: 'Consultant Clinical & Interventional Cardiologist',
    title_ar: 'استشاري أمراض القلب السريرية والتداخلية',
    hospital_id: 'hosp-002',
    hospital_name: 'American Hospital Dubai',
    hospital_name_ar: 'المستشفى الأمريكي دبي',
    specialty: 'Cardiology',
    subspecialties: ['Acute Chest Pain', 'Preventive Cardiology', 'Ischemic Heart Disease', 'Echocardiography'],
    experience_years: 19,
    languages: ['Arabic', 'English', 'French'],
    education: 'Imperial College London (MBBS) | Royal College of Physicians (FRCP UK)',
    second_opinion_available: true,
    consultation_fee_usd: 250,
    telehealth_fee_usd: 190,
    next_available_slot: 'Today, 18:00 (Emergency fast-track) / Tomorrow, 09:30',
    bio: 'UK-trained Consultant Cardiologist specializing in differential diagnosis of chest pain, myocardial ischemia, and rapid triage between non-cardiac chest pain and coronary events.',
    bio_ar: 'استشاري بريطاني معتمد متخصص في التشخيص التفريقي لآلام الصدر، والقصور التاجي، والفرز السريع بين الآلام القلبية وغير القلبية.',
    rating: 4.9,
    review_count: 410,
    procedures: ['Diagnostic Coronary Angiogram', 'Transesophageal Echo', 'Cardiac Holter', 'Pre-operative Heart Clearance'],
    city: 'Dubai',
    country: 'UAE'
  },
  {
    id: 'doc-003',
    name: 'Dr. Reem Al-Ghamdi',
    name_ar: 'د. ريم الغامدي',
    title: 'Consultant Non-Invasive Cardiologist & Cardiac Imaging Specialist',
    title_ar: 'استشارية طب القلب غير التداخلي والتصوير القلبي المتقدم',
    hospital_id: 'hosp-003',
    hospital_name: 'King Faisal Specialist Hospital & Research Centre',
    hospital_name_ar: 'مستشفى الملك فيصل التخصصي ومركز الأبحاث',
    specialty: 'Cardiology',
    subspecialties: ['Cardiac MRI', 'CT Coronary Angiography', 'Chest Pain Syndromes', 'Women Heart Health'],
    experience_years: 16,
    languages: ['Arabic', 'English'],
    education: 'King Saud University | Johns Hopkins Hospital Fellowship (USA)',
    second_opinion_available: true,
    consultation_fee_usd: 220,
    telehealth_fee_usd: 160,
    next_available_slot: 'Tomorrow, 11:00 AM',
    bio: 'Recognized international authority in cardiac imaging. Expert at providing second opinions on cardiac CT/MRI scans to differentiate musculoskeletal/GI chest pain from cardiovascular disease.',
    bio_ar: 'خبيرة معترف بها دولياً في التصوير القلبي والرنين المغناطيسي للقلب. تقدم آراءً طبية ثانية دقيقة للتفريق بين آلام الصدر الهيكلية والمعدية وأمراض الشرايين التاجية.',
    rating: 4.96,
    review_count: 275,
    procedures: ['Cardiac MRI Review', 'Coronary Calcium Scoring', 'Stress Testing', 'Valvular Disease Review'],
    city: 'Riyadh',
    country: 'Saudi Arabia'
  },
  {
    id: 'doc-004',
    name: 'Prof. Dr. Markus Lindemann',
    name_ar: 'بروفيسور د. ماركوس ليندمان',
    title: 'Chief of Cardiology & Second Opinion Panel Lead',
    title_ar: 'رئيس قسم أمراض القلب ورئيس لجنة الآراء الطبية الثانية',
    hospital_id: 'hosp-005',
    hospital_name: 'Charité – Universitätsmedizin Berlin',
    hospital_name_ar: 'مستشفى شاريتيه الجامعي برلين',
    specialty: 'Cardiology',
    subspecialties: ['Complex Heart Failure', 'Refractory Angina', 'Cardiomyopathies', 'International Second Opinions'],
    experience_years: 28,
    languages: ['English', 'German', 'Arabic (Translation Desk Support)'],
    education: 'Heidelberg University | European Society of Cardiology Fellow (FESC)',
    second_opinion_available: true,
    consultation_fee_usd: 350,
    telehealth_fee_usd: 280,
    next_available_slot: 'Wednesday, 14:00 (Telehealth video consult)',
    bio: 'Renowned worldwide for thorough remote reviews of cardiac cases, helping patients decide whether surgery, stenting, or medical therapy is truly required.',
    bio_ar: 'معروف عالمياً بتقديم تقارير الرأي الطبي الثاني المعمقة عن بُعد لمساعدة المرضى في تحديد ما إذا كانت الجراحة أو الدعامات أو العلاج الدوائي هو الخيار الأفضل.',
    rating: 4.98,
    review_count: 512,
    procedures: ['Comprehensive Second Opinion Dossier', 'Coronary Revascularization Strategy', 'Risk Stratification'],
    city: 'Berlin',
    country: 'Germany'
  },
  {
    id: 'doc-005',
    name: 'Dr. Serkan Yılmaz',
    name_ar: 'د. سركان يلماز',
    title: 'Consultant Orthopedic & Joint Reconstruction Surgeon',
    title_ar: 'استشاري جراحة العظام واستبدال المفاصل',
    hospital_id: 'hosp-001',
    hospital_name: 'Acıbadem Maslak Hospital',
    hospital_name_ar: 'مستشفى أتشيبادم مسلك',
    specialty: 'Orthopedics',
    subspecialties: ['Total Knee Arthroplasty', 'Robotic Knee Replacement', 'Sports Injuries', 'Hip Resurfacing'],
    experience_years: 20,
    languages: ['English', 'Turkish', 'Arabic (Interpreter)'],
    education: 'Istanbul University Faculty of Medicine | Endoklinik Hamburg Fellow',
    second_opinion_available: true,
    consultation_fee_usd: 160,
    telehealth_fee_usd: 120,
    next_available_slot: 'Tomorrow, 14:00',
    bio: 'Specialist in robotic-assisted knee and hip arthroplasty with high patient satisfaction and accelerated recovery protocols for international medical travelers.',
    bio_ar: 'متخصص في استبدال مفاصل الركبة والورك بمساعدة الروبوت، مع برامج تعافٍ سريعة مخصصة للمسافرين للعلاج الطبي.',
    rating: 4.88,
    review_count: 390,
    procedures: ['MAKO Robotic Knee Surgery', 'Knee Arthroscopy', 'Second Opinion on Surgery Necessity'],
    city: 'Istanbul',
    country: 'Turkey'
  },
  {
    id: 'doc-006',
    name: 'Dr. Layla Hashim',
    name_ar: 'د. ليلى هاشم',
    title: 'Consultant Neurologist & Headache Specialist',
    title_ar: 'استشارية طب الأعصاب واضطرابات الصداع المزمن',
    hospital_id: 'hosp-002',
    hospital_name: 'American Hospital Dubai',
    hospital_name_ar: 'المستشفى الأمريكي دبي',
    specialty: 'Neurology',
    subspecialties: ['Refractory Migraine', 'Cluster Headaches', 'Trigeminal Neuralgia', 'Neurovascular Triage'],
    experience_years: 17,
    languages: ['Arabic', 'English'],
    education: 'American University of Beirut (AUB) | Harvard Medical School Fellowship',
    second_opinion_available: true,
    consultation_fee_usd: 240,
    telehealth_fee_usd: 180,
    next_available_slot: 'Thursday, 10:00 AM',
    bio: 'Leading headache and neurovascular specialist providing diagnostic clarity for severe recurrent headaches, distinguishing benign migraines from intracranial red flags.',
    bio_ar: 'استشارية رائدة في أمراض الصداع والأعصاب تقدم دقة تشخيصية للصداع المزمن والتفريق بين الشقيقة والحالات الوعائية الدماغية الطارئة.',
    rating: 4.92,
    review_count: 230,
    procedures: ['Botox for Chronic Migraine', 'CGRP Inhibitor Protocols', 'Brain MRI Review', 'Second Opinions'],
    city: 'Dubai',
    country: 'UAE'
  }
];

/**
 * In-memory Mock Database Engine with Search, Filters, and Indexing
 */
export class MedicalDirectoryDatabase {
  private hospitals: Hospital[] = HOSPITALS;
  private doctors: Doctor[] = DOCTORS;

  /**
   * Search providers based on structured criteria
   */
  public search(params: ProviderSearchParams): {
    doctors: Doctor[];
    hospitals: Hospital[];
    querySummary: string;
  } {
    let filteredDoctors = [...this.doctors];
    let filteredHospitals = [...this.hospitals];

    // Filter by specialty
    if (params.specialty && params.specialty.trim() !== '') {
      const specLower = params.specialty.toLowerCase();
      filteredDoctors = filteredDoctors.filter(d => 
        d.specialty.toLowerCase().includes(specLower) ||
        d.subspecialties.some(sub => sub.toLowerCase().includes(specLower)) ||
        d.procedures.some(p => p.toLowerCase().includes(specLower))
      );

      filteredHospitals = filteredHospitals.filter(h =>
        h.specialties.some(s => s.toLowerCase().includes(specLower))
      );
    }

    // Filter by location (City or Country)
    if (params.location && params.location.trim() !== '') {
      const locLower = params.location.toLowerCase();
      filteredDoctors = filteredDoctors.filter(d =>
        d.city.toLowerCase().includes(locLower) ||
        d.country.toLowerCase().includes(locLower)
      );

      filteredHospitals = filteredHospitals.filter(h =>
        h.city.toLowerCase().includes(locLower) ||
        h.country.toLowerCase().includes(locLower)
      );
    }

    // Filter by Emergency Capable
    if (params.emergency_capable) {
      filteredHospitals = filteredHospitals.filter(h => h.emergency_department_247);
      const emergencyHospitalIds = new Set(filteredHospitals.map(h => h.id));
      filteredDoctors = filteredDoctors.filter(d => emergencyHospitalIds.has(d.hospital_id));
    }

    // Filter by Telehealth / Second Opinion
    if (params.telehealth_second_opinion) {
      filteredDoctors = filteredDoctors.filter(d => d.second_opinion_available);
      filteredHospitals = filteredHospitals.filter(h => h.telehealth_ready);
    }

    // Filter by Language
    if (params.language && params.language.trim() !== '') {
      const langLower = params.language.toLowerCase();
      filteredDoctors = filteredDoctors.filter(d =>
        d.languages.some(l => l.toLowerCase().includes(langLower))
      );
      filteredHospitals = filteredHospitals.filter(h =>
        h.languages_supported.some(l => l.toLowerCase().includes(langLower))
      );
    }

    // Filter by Max Fee
    if (params.max_fee_usd && params.max_fee_usd > 0) {
      filteredDoctors = filteredDoctors.filter(d =>
        d.consultation_fee_usd <= (params.max_fee_usd as number) ||
        d.telehealth_fee_usd <= (params.max_fee_usd as number)
      );
    }

    const summary = `Found ${filteredDoctors.length} verified doctors and ${filteredHospitals.length} accredited hospitals matching criteria [Specialty: ${params.specialty || 'Any'}, Location: ${params.location || 'Any'}, Emergency: ${params.emergency_capable ? '24/7 Required' : 'Any'}, Telehealth 2nd Opinion: ${params.telehealth_second_opinion ? 'Required' : 'Any'}]`;

    return {
      doctors: filteredDoctors,
      hospitals: filteredHospitals,
      querySummary: summary
    };
  }

  public getDoctorById(id: string): Doctor | undefined {
    return this.doctors.find(d => d.id === id);
  }

  public getHospitalById(id: string): Hospital | undefined {
    return this.hospitals.find(h => h.id === id);
  }

  public getAllSpecialties(): string[] {
    const set = new Set<string>();
    this.doctors.forEach(d => set.add(d.specialty));
    this.hospitals.forEach(h => h.specialties.forEach(s => set.add(s)));
    return Array.from(set);
  }

  public getAllHospitals(): Hospital[] {
    return this.hospitals;
  }

  public getAllDoctors(): Doctor[] {
    return this.doctors;
  }
}

export const medicalDirectoryDb = new MedicalDirectoryDatabase();
