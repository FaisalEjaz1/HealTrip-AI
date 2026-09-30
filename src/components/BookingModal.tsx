import React, { useState } from 'react';
import { X, Calendar, Video, Clock, CheckCircle2, FileText, User } from 'lucide-react';
import { translations } from '../locales/translations.js';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: {
    name: string;
    title: string;
    type: 'doctor' | 'hospital';
    fee?: number;
    secondOpinion: boolean;
  } | null;
  language: 'en' | 'ar';
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  provider,
  language
}) => {
  const [patientName, setPatientName] = useState('Sarah M.');
  const [patientPhone, setPatientPhone] = useState('+971 50 123 4567');
  const [patientNotes, setPatientNotes] = useState('Discussing chest symptoms / cardiac evaluation reports');
  const [preferredDate, setPreferredDate] = useState('2026-10-02');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !provider) return null;
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {language === 'ar' ? 'تم تأكيد طلب الاستشارة بنجاح' : 'Consultation Request Confirmed!'}
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              {language === 'ar'
                ? `سيتواصل معك فريق هيل تريب لتأكيد الموعد مع ${provider.name} وتنسيق تفاصيل الاستشارة.`
                : `HealTrip patient desk will contact you within 2 hours to confirm your session with ${provider.name}.`}
            </p>
            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 text-left space-y-1">
              <div><strong>Reference ID:</strong> HT-{Math.floor(100000 + Math.random() * 900000)}</div>
              <div><strong>Provider:</strong> {provider.name}</div>
              <div><strong>Type:</strong> {provider.secondOpinion ? 'Telehealth Second Opinion' : 'In-Person Consultation'}</div>
              {provider.fee && <div><strong>Estimated Fee:</strong> ${provider.fee} USD</div>}
            </div>
            <button
              onClick={resetAndClose}
              className="mt-6 w-full py-2.5 px-4 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors"
            >
              {language === 'ar' ? 'العودة للمحادثة' : 'Back to Consultation'}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                {provider.secondOpinion ? <Video className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {provider.secondOpinion ? t.requestSecondOpinion : t.bookConsultation}
                </h3>
                <p className="text-xs text-slate-500">{provider.name} • {provider.title}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'ar' ? 'اسم المريض' : 'Patient Full Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'ar' ? 'رقم الهاتف' : 'Contact Phone'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'ar' ? 'التاريخ المفضل' : 'Preferred Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'ar' ? 'ملاحظات سريرية أو تقارير متوفرة' : 'Clinical Summary / Available Reports'}
                </label>
                <textarea
                  rows={3}
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden"
                  placeholder="Mention previous diagnosis, tests (e.g. ECG, Troponin, MRI), or medical history..."
                />
              </div>

              {provider.fee && (
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-teal-900 font-medium">
                    {provider.secondOpinion ? 'Standard Telehealth Fee:' : 'In-Person Consultation Fee:'}
                  </span>
                  <span className="text-base font-bold text-teal-800">${provider.fee} USD</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
                >
                  {language === 'ar' ? 'تأكيد الحجز' : 'Confirm Consultation Request'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
