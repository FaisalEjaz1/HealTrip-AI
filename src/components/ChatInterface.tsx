import React, { useState, useRef, useEffect } from 'react';
import { MessageItem, Doctor, Hospital, AgentResponse } from '../types/index.js';
import { ProviderCard } from './ProviderCard.js';
import {
  Send,
  AlertTriangle,
  HelpCircle,
  Wrench,
  CheckCircle,
  PhoneCall,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Building,
  Stethoscope,
  Info
} from 'lucide-react';
import { translations } from '../locales/translations.js';

interface ChatInterfaceProps {
  language: 'en' | 'ar';
  messages: MessageItem[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onResetChat: () => void;
  onOpenBooking: (provider: any) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  language,
  messages,
  onSendMessage,
  isLoading,
  onResetChat,
  onOpenBooking
}) => {
  const [inputText, setInputText] = useState('');
  const [expandedToolId, setExpandedToolId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  // Pre-configured clinical scenarios from the prompt brief and real triage cases
  const sampleScenarios = [
    {
      labelEn: "Scenario 1 (Chest Pain - Triage & ER Decision)",
      labelAr: "سيناريو 1 (ألم في الصدر - فرز وطوارئ)",
      textEn: "I have chest pain and I'm not sure whether I should see a cardiologist, go to the ER, or seek a second opinion.",
      textAr: "لدي ألم في الصدر ولست متأكداً هل يجب أن أذهب لطبيب قلب، أم لقسم الطوارئ، أم أطلب رأياً طبياً ثانياً؟"
    },
    {
      labelEn: "Scenario 2 (Knee Surgery - Second Opinion)",
      labelAr: "سيناريو 2 (جراحة ركبة - رأي طبي ثانٍ)",
      textEn: "I was diagnosed with severe knee osteoarthritis and advised to do total knee replacement. I want a second opinion with an international specialist in Istanbul or Dubai.",
      textAr: "تم تشخيصي بخشونة متقدمة في الركبة ونُصحت بإجراء استبدال مفصل كامل. أريد استشارة رأي ثانٍ مع استشاري دولي في إسطنبول أو دبي."
    },
    {
      labelEn: "Scenario 3 (Severe Migraine Triage)",
      labelAr: "سيناريو 3 (صداع نصفي حاد ومستمر)",
      textEn: "I've had severe throbbing headaches for 3 weeks with visual light sensitivity. Should I see a neurologist or an ENT specialist?",
      textAr: "أعاني من صداع نصفي نابض منذ 3 أسابيع مع تحسس شديد للضوء. هل الأنسب مراجعة استشاري أعصاب أم أنف وأذن وحنجرة؟"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    onSendMessage(text);
  };

  const handleScenarioClick = (scenarioText: string) => {
    if (isLoading) return;
    setInputText(scenarioText);
  };

  const handleClarifyingClick = (question: string) => {
    if (isLoading) return;
    onSendMessage(question);
  };

  const getTriageBadge = (level: string) => {
    switch (level) {
      case 'EMERGENCY_RED_FLAG':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-800',
          dot: 'bg-rose-600 animate-ping',
          title: t.triageLevels.emergency,
          icon: <AlertTriangle className="w-4 h-4 text-rose-600" />
        };
      case 'URGENT_24_48H':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          dot: 'bg-amber-500',
          title: t.triageLevels.urgent,
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />
        };
      case 'SECOND_OPINION_TELEHEALTH':
        return {
          bg: 'bg-teal-50 border-teal-200 text-teal-800',
          dot: 'bg-teal-500',
          title: t.triageLevels.secondOpinion,
          icon: <Sparkles className="w-4 h-4 text-teal-600" />
        };
      default:
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-800',
          dot: 'bg-blue-500',
          title: t.triageLevels.specialist,
          icon: <Stethoscope className="w-4 h-4 text-blue-600" />
        };
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-3.5rem)] sm:h-[calc(100vh-4rem)] max-w-5xl mx-auto px-2.5 sm:px-6 py-2.5 sm:py-4">
      {/* Quick Scenario Launchers */}
      <div className="mb-2.5 sm:mb-3 bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>{t.quickScenarios}</span>
          </span>
          {messages.length > 0 && (
            <button
              onClick={onResetChat}
              className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.clearChat}</span>
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2">
          {sampleScenarios.map((sc, i) => (
            <button
              key={i}
              onClick={() => handleScenarioClick(language === 'ar' ? sc.textAr : sc.textEn)}
              className="text-left rtl:text-right p-2 sm:p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-teal-50/70 hover:border-teal-300 text-slate-700 transition-all text-xs group"
            >
              <div className="font-semibold text-teal-700 group-hover:text-teal-800 mb-0.5 text-[11px] sm:text-xs">
                {language === 'ar' ? sc.labelAr : sc.labelEn}
              </div>
              <div className="line-clamp-2 text-slate-500 group-hover:text-slate-700 text-[11px] sm:text-xs leading-snug">
                {language === 'ar' ? sc.textAr : sc.textEn}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-5 pr-0.5 sm:pr-2">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-white/60 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 mb-2.5 sm:mb-3 shadow-xs">
              <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {language === 'ar' ? 'مساعد اتخاذ القرار الطبي الذكي من HealTrip' : 'HealTrip Patient Decision Assistant'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed px-2">
              {language === 'ar'
                ? 'اطرح استفسارك السريري أو اختر أحد السيناريوهات أعلاه. سيقوم الوكيل بتقييم درجة الإلحاح، التحقق من العلامات الحمراء، واستدعاء أدوات قاعدة البيانات لاقتراح الخطوة المناسبة.'
                : 'Describe your symptoms or clinical dilemma above. The agent will assess triage urgency, identify potential red flags, execute database search tools, and recommend grounded care options.'}
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-1.5 sm:gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 sm:mt-1 shadow-2xs">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            )}

            <div
              className={`max-w-[92%] sm:max-w-3xl rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-xs ${
                msg.role === 'user'
                  ? 'bg-teal-700 text-white rounded-tr-xs'
                  : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs'
              }`}
            >
              {/* User message */}
              {msg.role === 'user' ? (
                <div className="text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                  {msg.content}
                </div>
              ) : (
                /* Assistant Message with rich triage components */
                <div className="space-y-3 sm:space-y-4">
                  {/* Triage Level Banner if present */}
                  {msg.agentData && (
                    <div className="space-y-2">
                      {(() => {
                        const badge = getTriageBadge(msg.agentData.triageLevel);
                        return (
                          <div className={`p-2.5 sm:p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 ${badge.bg}`}>
                            <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-xs sm:text-sm">
                              {badge.icon}
                              <span>{badge.title}</span>
                            </div>
                            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                              {msg.agentData.modelUsed && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/80 text-teal-800 border border-teal-200/80 shadow-2xs">
                                  {msg.agentData.modelUsed.includes('Gemini') ? '✨ ' + msg.agentData.modelUsed : '⚙️ ' + msg.agentData.modelUsed}
                                </span>
                              )}
                              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold">
                                <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                                <span>{Math.round(msg.agentData.confidence * 100)}% Confidence</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Emergency Callout Banner if ACS/Red-Flag */}
                      {msg.agentData.triageLevel === 'EMERGENCY_RED_FLAG' && (
                        <div className="p-3 sm:p-3.5 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-950 space-y-2">
                          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-rose-800">
                            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0" />
                            <span>{t.emergencyAlertTitle}</span>
                          </div>
                          <p className="text-xs text-rose-800 leading-relaxed">
                            {t.emergencyAlertText}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
                            <a
                              href="tel:911"
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-xs w-full sm:w-auto"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>{t.callEmergencyBtn}</span>
                            </a>
                            <span className="text-[11px] text-rose-700">
                              (Do not drive yourself; seek emergency medical transport)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Main Response Text */}
                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-slate-800">
                    {msg.content}
                  </div>

                  {/* Recommended Next Clinical Step */}
                  {msg.agentData?.suggestedNextStep && (
                    <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>{t.nextStepHeader}</span>
                      </div>
                      <p className="text-slate-700 font-semibold">
                        {language === 'ar' ? msg.agentData.suggestedNextStep.titleAr : msg.agentData.suggestedNextStep.titleEn}
                      </p>
                      <p className="text-slate-500">
                        {language === 'ar' ? msg.agentData.suggestedNextStep.descriptionAr : msg.agentData.suggestedNextStep.descriptionEn}
                      </p>
                    </div>
                  )}

                  {/* Clarifying Questions Quick-Response Chips */}
                  {msg.agentData?.clarifyingQuestions && msg.agentData.clarifyingQuestions.length > 0 && (
                    <div className="pt-1 space-y-1.5">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{t.clarifyingHeader}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.agentData.clarifyingQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleClarifyingClick(q)}
                            className="w-full sm:w-auto text-left rtl:text-right px-2.5 sm:px-3 py-1.5 rounded-lg text-xs bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors flex items-center gap-1.5 group break-words"
                          >
                            <span>💬</span>
                            <span className="group-hover:underline">{q}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tool Execution Inspector (Demonstrating Function Calling directly in chat) */}
                  {msg.agentData?.toolExecutions && msg.agentData.toolExecutions.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      {msg.agentData.toolExecutions.map((tool) => (
                        <div key={tool.id} className="rounded-lg border border-slate-200 bg-slate-50/80 text-xs overflow-hidden">
                          <button
                            onClick={() => setExpandedToolId(expandedToolId === tool.id ? null : tool.id)}
                            className="w-full px-2.5 sm:px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-slate-700 hover:bg-slate-100 transition-colors text-left rtl:text-right"
                          >
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-[11px] sm:text-xs">
                              <Wrench className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                              <span className="font-semibold hidden xs:inline">{t.toolTraceTitle}:</span>
                              <code className="text-teal-700 bg-teal-50 px-1 py-0.5 rounded font-mono text-[11px] font-bold">
                                {tool.tool_name}()
                              </code>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-500">{tool.items_matched} matches</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400 self-end sm:self-auto text-[11px]">
                              <span>{tool.duration_ms}ms</span>
                              {expandedToolId === tool.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </div>
                          </button>

                          {expandedToolId === tool.id && (
                            <div className="p-3 bg-slate-900 text-slate-100 border-t border-slate-200 space-y-2 font-mono text-[11px]">
                              <div>
                                <span className="text-teal-400">// Input Arguments to Tool Function:</span>
                                <pre className="text-slate-300 mt-1 overflow-x-auto whitespace-pre-wrap text-[10px] sm:text-[11px]">
                                  {JSON.stringify(tool.input_args, null, 2)}
                                </pre>
                              </div>
                              <div className="pt-2 border-t border-slate-800">
                                <span className="text-emerald-400">// Database Query Result Summary:</span>
                                <p className="text-slate-300 mt-1">{tool.output_summary}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Grounded Provider Database Recommendations */}
                  {(msg.agentData?.recommendedDoctors?.length || msg.agentData?.recommendedHospitals?.length) ? (
                    <div className="pt-3 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Building className="w-4 h-4 text-teal-600 shrink-0" />
                          <span>{t.recommendedProvidersHeader}</span>
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 self-start sm:self-auto">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{t.groundedVerificationTitle}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {/* Render emergency hospitals first if in emergency */}
                        {msg.agentData?.triageLevel === 'EMERGENCY_RED_FLAG' &&
                          msg.agentData.recommendedHospitals.map((hosp) => (
                            <ProviderCard
                              key={hosp.id}
                              hospital={hosp}
                              language={language}
                              onSelectAction={onOpenBooking}
                            />
                          ))}

                        {/* Render specialists */}
                        {msg.agentData?.recommendedDoctors?.map((doc) => (
                          <ProviderCard
                            key={doc.id}
                            doctor={doc}
                            language={language}
                            onSelectAction={onOpenBooking}
                          />
                        ))}

                        {/* Render general hospitals if not emergency */}
                        {msg.agentData?.triageLevel !== 'EMERGENCY_RED_FLAG' &&
                          msg.agentData.recommendedHospitals.slice(0, 1).map((hosp) => (
                            <ProviderCard
                              key={hosp.id}
                              hospital={hosp}
                              language={language}
                              onSelectAction={onOpenBooking}
                            />
                          ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 sm:mt-1 shadow-2xs">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex gap-3 items-start animate-in fade-in">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-2xs animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 shadow-xs flex items-center gap-3 text-xs text-slate-600">
              <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
              <span>{t.thinking}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form with Flex Layout to Prevent Button-Text Overlap */}
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="bg-white border border-slate-300 rounded-xl p-2.5 shadow-xs focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
          <textarea
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={t.inputPlaceholder}
            className="w-full bg-transparent p-1 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-hidden resize-none min-h-[44px]"
          />

          <div className="flex items-center justify-end shrink-0">
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 shadow-2xs whitespace-nowrap cursor-pointer"
            >
              <span>{t.sendButton}</span>
              <Send className="w-3.5 h-3.5 rtl:rotate-180 shrink-0" />
            </button>
          </div>
        </div>

        <div className="mt-1.5 flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px] text-slate-400 px-1 gap-1">
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{t.disclaimerText}</span>
          </span>
          <span className="hidden sm:inline">Press Enter to send (Shift+Enter for newline)</span>
        </div>
      </form>
    </div>
  );
};
