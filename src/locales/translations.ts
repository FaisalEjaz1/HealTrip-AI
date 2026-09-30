export interface Translations {
  appTitle: string;
  appSubtitle: string;
  triageTagline: string;
  consultationTab: string;
  directoryTab: string;
  architectureTab: string;
  telemetryTab: string;
  quickScenarios: string;
  inputPlaceholder: string;
  sendButton: string;
  thinking: string;
  verifiedDbBadge: string;
  emergencyAlertTitle: string;
  emergencyAlertText: string;
  callEmergencyBtn: string;
  findErBtn: string;
  clarifyingHeader: string;
  recommendedProvidersHeader: string;
  nextStepHeader: string;
  feeConsult: string;
  feeTelehealth: string;
  availableSlot: string;
  languagesSpoken: string;
  accreditationBadge: string;
  requestSecondOpinion: string;
  bookConsultation: string;
  toolTraceTitle: string;
  toolExecuted: string;
  toolDuration: string;
  groundedVerificationTitle: string;
  groundedVerificationText: string;
  clearChat: string;
  disclaimerText: string;
  triageLevels: {
    emergency: string;
    urgent: string;
    specialist: string;
    secondOpinion: string;
  };
}

export const translations: Record<'en' | 'ar', Translations> = {
  en: {
    appTitle: 'HealTrip AI',
    appSubtitle: 'Patient Decision & Triage Assistant',
    triageTagline: 'Intelligent clinical triage, grounded specialist matching, and medical second opinions.',
    consultationTab: 'Chat',
    directoryTab: 'Database',
    architectureTab: 'Architecture & Docs',
    telemetryTab: 'Telemetry & Logs',
    quickScenarios: 'Quick Clinical Scenarios:',
    inputPlaceholder: 'Describe your symptoms, condition, or question (e.g. chest pain, surgery second opinion)...',
    sendButton: 'Analyze & Consult',
    thinking: 'Evaluating clinical urgency and querying HealTrip verified database...',
    verifiedDbBadge: 'HealTrip Verified Record',
    emergencyAlertTitle: 'CRITICAL SAFETY TRIAGE: IMMEDIATE EMERGENCY EVALUATION REQUIRED',
    emergencyAlertText: 'Symptoms indicate potential acute coronary or life-threatening condition. Do not delay or wait for elective consultations.',
    callEmergencyBtn: 'Call Local Emergency (911 / 998 / 112)',
    findErBtn: 'Locate 24/7 Accredited ER',
    clarifyingHeader: 'Suggested Clarifying Questions:',
    recommendedProvidersHeader: 'Grounded Provider Recommendations (From Database):',
    nextStepHeader: 'Recommended Clinical Action:',
    feeConsult: 'In-Person Fee:',
    feeTelehealth: 'Telehealth 2nd Opinion:',
    availableSlot: 'Next Slot:',
    languagesSpoken: 'Languages:',
    accreditationBadge: 'Accreditations:',
    requestSecondOpinion: 'Request 2nd Opinion',
    bookConsultation: 'Book Consultation',
    toolTraceTitle: 'Agent Tool Execution Trace',
    toolExecuted: 'Function Invoked:',
    toolDuration: 'Latency:',
    groundedVerificationTitle: 'Anti-Hallucination Guardrail Active',
    groundedVerificationText: 'All medical providers and facilities displayed are validated against the HealTrip database.',
    clearChat: 'Reset Consultation',
    disclaimerText: 'Clinical Decision Support Prototype. Not a substitute for formal diagnosis or emergency medical care.',
    triageLevels: {
      emergency: 'EMERGENCY RED FLAG',
      urgent: 'URGENT (24-48 HOURS)',
      specialist: 'SPECIALIST CONSULTATION',
      secondOpinion: 'TELEHEALTH SECOND OPINION'
    }
  },
  ar: {
    appTitle: 'هيل تريب AI',
    appSubtitle: 'مساعد اتخاذ القرار الطبي والفرز السريري',
    triageTagline: 'فرز سريري ذكي، مطابقة الأطباء المعتمدين، وخدمات الرأي الطبي الثاني الدولي.',
    consultationTab: 'المحادثة',
    directoryTab: 'قاعدة البيانات',
    architectureTab: 'التوثيق والهندسة',
    telemetryTab: 'سجلات الأدوات',
    quickScenarios: 'سيناريوهات سريرية سريعة للتجربة:',
    inputPlaceholder: 'صف أعراضك، حالتك، أو استفسارك (مثلاً: ألم في الصدر، طلب رأي ثانٍ لجراحة الركبة)...',
    sendButton: 'تحليل واستشارة',
    thinking: 'جاري التقييم السريري والبحث في قاعدة بيانات هيل تريب المعتمدة...',
    verifiedDbBadge: 'سجل موثق في هيل تريب',
    emergencyAlertTitle: 'تنبيه سريري فوري: يتطلب تقييماً إسعافياً عاجلاً',
    emergencyAlertText: 'الأعراض تشير إلى احتمال متلازمة حادة. يرجى التوجه فوراً لأقرب قسم طوارئ وعدم تأجيل العلاج.',
    callEmergencyBtn: 'اتصل بالطوارئ المحلية (998 / 997 / 112)',
    findErBtn: 'مراكز طوارئ 24/7 معتمدة',
    clarifyingHeader: 'أسئلة توضيحية مقترحة للتشخيص الدقيق:',
    recommendedProvidersHeader: 'المراكز والأطباء المعتمدون (المطابقون من قاعدة البيانات):',
    nextStepHeader: 'الإجراء السريري المقترح:',
    feeConsult: 'رسوم العيادة:',
    feeTelehealth: 'رأي ثانٍ عن بُعد:',
    availableSlot: 'الموعد المتاح:',
    languagesSpoken: 'اللغات:',
    accreditationBadge: 'الاعتمادات الدولية:',
    requestSecondOpinion: 'طلب رأي طبي ثانٍ',
    bookConsultation: 'حجز استشارة سريرية',
    toolTraceTitle: 'مسار تنفيذ أدوات الذكاء الاصطناعي (Tool Calling)',
    toolExecuted: 'الأداة المستدعاة:',
    toolDuration: 'زمن الاستجابة:',
    groundedVerificationTitle: 'درع منع الهلوسة الطبية مفعل',
    groundedVerificationText: 'جميع الأطباء والمشافي المعروضة مستخرجة ومحققة مباشرة من قاعدة بيانات هيل تريب.',
    clearChat: 'بدء استشارة جديدة',
    disclaimerText: 'نموذج أولي لدعم اتخاذ القرار الطبي. لا يغني عن التشخيص السريري الرسمي أو طلب الإسعاف الطارئ.',
    triageLevels: {
      emergency: 'طوارئ قصوى (علامة حمراء)',
      urgent: 'عاجل (خلال 24-48 ساعة)',
      specialist: 'استشارة طبيب تخصصي',
      secondOpinion: 'رأي طبي ثانٍ عن بُعد'
    }
  }
};
