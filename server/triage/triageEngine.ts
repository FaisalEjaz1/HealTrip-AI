import { TriageUrgency } from '../db/types.js';

export interface TriageAssessment {
  urgency: TriageUrgency;
  confidence: number;
  detectedRedFlags: string[];
  suggestedSpecialty: string;
  emergencyActionsRecommended: boolean;
  clarifyingQuestionsEn: string[];
  clarifyingQuestionsAr: string[];
  clinicalRationaleEn: string;
  clinicalRationaleAr: string;
}

export class ClinicalTriageEngine {
  private redFlagPatterns = [
    {
      keywords: ['crushing', 'pressure', 'radiating', 'left arm', 'jaw', 'sweating', 'short of breath', 'shortness of breath', 'clammy', 'passed out', 'syncope'],
      flag: 'Acute Coronary Syndrome (ACS) / Myocardial Infarction red flags',
      specialty: 'Cardiology / Emergency'
    },
    {
      keywords: ['slurred speech', 'facial droop', 'arm weakness', 'sudden numbness', 'loss of vision'],
      flag: 'Stroke / Transient Ischemic Attack (FAST protocol)',
      specialty: 'Neurology / Emergency'
    },
    {
      keywords: ['worst headache of life', 'thunderclap', 'stiff neck with fever'],
      flag: 'Intracranial hemorrhage or Meningitis red flags',
      specialty: 'Neurology / Emergency'
    },
    {
      keywords: ['coughing blood', 'severe asthma', 'cannot breathe', 'stridor'],
      flag: 'Severe respiratory distress',
      specialty: 'Pulmonology / Emergency'
    }
  ];

  public evaluate(userText: string): TriageAssessment {
    const textLower = userText.toLowerCase();
    const detectedFlags: string[] = [];

    for (const pattern of this.redFlagPatterns) {
      for (const kw of pattern.keywords) {
        if (textLower.includes(kw)) {
          if (!detectedFlags.includes(pattern.flag)) {
            detectedFlags.push(pattern.flag);
          }
          break;
        }
      }
    }

    // Chest pain analysis
    const hasChestPain = textLower.includes('chest pain') || textLower.includes('chest') || textLower.includes('ألم في الصدر') || textLower.includes('الم بالصدر') || textLower.includes('ذبحة');
    const isSeekingSecondOpinion = textLower.includes('second opinion') || textLower.includes('surgery') || textLower.includes('scan') || textLower.includes('رأي ثان') || textLower.includes('رأي طبي');
    const isElectiveOrOrthopedic = textLower.includes('knee') || textLower.includes('joint') || textLower.includes('ركبة') || textLower.includes('مفصل');

    if (detectedFlags.length > 0 && hasChestPain) {
      return {
        urgency: 'EMERGENCY_RED_FLAG',
        confidence: 0.95,
        detectedRedFlags: detectedFlags,
        suggestedSpecialty: 'Emergency Medicine / Interventional Cardiology',
        emergencyActionsRecommended: true,
        clarifyingQuestionsEn: [
          'Did this pain start suddenly or during physical exertion?',
          'Does the pain spread into your left arm, neck, back, or jaw?',
          'Are you experiencing cold sweats, nausea, or lightheadedness?'
        ],
        clarifyingQuestionsAr: [
          'هل بدأ هذا الألم فجأة أو أثناء بذل مجهود بدني؟',
          'هل يمتد الألم إلى ذراعك الأيسر أو الرقبة أو الفك أو الظهر؟',
          'هل يصاحب ذلك تعرق بارد، غثيان، أو شعور بالدوار؟'
        ],
        clinicalRationaleEn: 'Symptoms show high overlap with acute coronary syndrome indicators. Immediate medical evaluation at a 24/7 Emergency Department is strictly advised before elective consultations.',
        clinicalRationaleAr: 'تشير الأعراض إلى احتمال وجود متلازمة الشريان التاجي الحادة. يُوصى بالتوجه فوراً لأقرب قسم طوارئ مجهز على مدار 24 ساعة لإجراء تخطيط قلب وفحص إنزيمات.'
      };
    }

    if (hasChestPain && !isSeekingSecondOpinion) {
      return {
        urgency: 'URGENT_24_48H',
        confidence: 0.85,
        detectedRedFlags: ['Undifferentiated chest discomfort requiring rapid clinical rule-out'],
        suggestedSpecialty: 'Cardiology',
        emergencyActionsRecommended: false,
        clarifyingQuestionsEn: [
          'How long has this chest sensation lasted (minutes, hours, or days)?',
          'Does taking a deep breath or pressing on your chest wall change the intensity?',
          'Do you have a personal or family history of high blood pressure, cholesterol, or heart conditions?'
        ],
        clarifyingQuestionsAr: [
          'منذ متى تشعر بألم الصدر (دقائق، ساعات، أم أيام متكررة)؟',
          'هل يتغير الألم مع أخذ نفس عميق أو الضغط المباشر على القفص الصدري؟',
          'هل لديك تاريخ شخصي أو عائلي لارتفاع ضغط الدم، الكوليسترول أو أمراض القلب؟'
        ],
        clinicalRationaleEn: 'Chest pain requires an ECG and cardiac troponin test to safely differentiate ischemic cardiac origin from musculoskeletal or gastroesophageal reflux causes.',
        clinicalRationaleAr: 'يتطلب ألم الصدر فحصاً سريرياً مع تخطيط قلب لاستبعاد الأسباب القلبية الإقفارية وتمييزها عن آلام العضلات أو الارتجاع المعدي.'
      };
    }

    if (isSeekingSecondOpinion || isElectiveOrOrthopedic) {
      return {
        urgency: 'SECOND_OPINION_TELEHEALTH',
        confidence: 0.9,
        detectedRedFlags: [],
        suggestedSpecialty: isElectiveOrOrthopedic ? 'Orthopedics' : 'Cardiology',
        emergencyActionsRecommended: false,
        clarifyingQuestionsEn: [
          'Do you have existing diagnostic reports, MRI/CT scans, or angiograms ready to upload?',
          'Has a specific surgical procedure or catheterization been recommended already?',
          'Are you looking for in-person treatment in medical travel destinations (e.g. Istanbul, Dubai, Germany) or remote video review?'
        ],
        clarifyingQuestionsAr: [
          'هل تتوفر لديك تقارير طبية، صور رنين مغناطيسي أو أشعة مقطعية جاهزة للمشاركة؟',
          'هل أوصى طبيبك السابق بإجراء جراحي أو قسطرة محددة؟',
          'هل ترغب بالسفر للعلاج (إسطنبول، دبي، ألمانيا) أم استشارة عبر الفيديو لرأي ثانٍ أولاً؟'
        ],
        clinicalRationaleEn: 'Stable elective condition ideal for HealTrip remote second opinion panel or pre-travel international specialist consult.',
        clinicalRationaleAr: 'حالة غير طارئة ومستقرة، مثالية للحصول على رأي طبي ثانٍ عن بُعد أو تخطيط رحلة علاجية دولية عبر منصة هيل تريب.'
      };
    }

    return {
      urgency: 'SPECIALIST_CONSULT',
      confidence: 0.8,
      detectedRedFlags: [],
      suggestedSpecialty: 'General Internal Medicine / Specialist',
      emergencyActionsRecommended: false,
      clarifyingQuestionsEn: [
        'How long have you been experiencing these symptoms?',
        'Have you noticed any factors that make the condition better or worse?',
        'Which city or country would be most convenient for your consultation?'
      ],
      clarifyingQuestionsAr: [
        'منذ متى تعاني من هذه الأعراض؟',
        'هل لاحظت عوامل تزيد من شدة الأعراض أو تخففها؟',
        'ما هي المدينة أو الدولة الأنسب لك لحجز موعد استشارة؟'
      ],
      clinicalRationaleEn: 'Outpatient evaluation is appropriate. Clear specialty mapping will guide optimal provider matching.',
      clinicalRationaleAr: 'التقييم في العيادات الخارجية مناسب. سنقوم بمطابقتك مع الطبيب أو المركز التخصصي الأنسب لحالتك.'
    };
  }
}

export const triageEngine = new ClinicalTriageEngine();
