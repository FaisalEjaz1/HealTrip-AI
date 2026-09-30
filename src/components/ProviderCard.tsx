import React from 'react';
import { Doctor, Hospital } from '../types/index.js';
import { Award, Clock, DollarSign, Languages, Calendar, Video, MapPin, Building2, UserCheck, ShieldCheck } from 'lucide-react';
import { translations } from '../locales/translations.js';

interface ProviderCardProps {
  doctor?: Doctor;
  hospital?: Hospital;
  language: 'en' | 'ar';
  onSelectAction: (provider: { name: string; title: string; type: 'doctor' | 'hospital'; fee?: number; secondOpinion: boolean }) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  doctor,
  hospital,
  language,
  onSelectAction
}) => {
  const t = translations[language];

  if (doctor) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-base sm:text-lg shadow-2xs shrink-0">
                {doctor.name.split(' ').slice(1, 3).map(n => n[0]).join('') || 'DR'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-base group-hover:text-teal-700 transition-colors truncate">
                    {language === 'ar' ? doctor.name_ar : doctor.name}
                  </h4>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <ShieldCheck className="w-3 h-3" />
                    {language === 'ar' ? 'موثق' : 'Verified'}
                  </span>
                </div>
                <p className="text-xs text-teal-800 font-medium mt-0.5 truncate">
                  {language === 'ar' ? doctor.title_ar : doctor.title}
                </p>
              </div>
            </div>
            
            <div className="text-right shrink-0">
              <div className="text-xs font-semibold text-amber-600 flex items-center gap-1 justify-end">
                ★ <span>{doctor.rating}</span>
                <span className="text-slate-400 font-normal">({doctor.review_count})</span>
              </div>
            </div>
          </div>

          {/* Hospital Affiliation & Location */}
          <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center gap-y-1 gap-x-2.5 sm:gap-x-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{language === 'ar' ? doctor.hospital_name_ar : doctor.hospital_name}</span>
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{doctor.city}, {doctor.country}</span>
            </span>
          </div>

          {/* Bio snippet */}
          <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-2">
            {language === 'ar' ? doctor.bio_ar : doctor.bio}
          </p>

          {/* Procedures & Tags */}
          <div className="mt-2.5 flex flex-wrap gap-1 sm:gap-1.5">
            {doctor.subspecialties.slice(0, 3).map((sub, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] bg-slate-100 text-slate-700">
                {sub}
              </span>
            ))}
          </div>

          {/* Metadata Grid: Slot & Languages */}
          <div className="mt-3 pt-2.5 sm:mt-4 sm:pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 min-w-0">
              <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">
                <strong className="text-slate-700">{t.availableSlot}</strong> {doctor.next_available_slot}
              </span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <Languages className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">
                <strong className="text-slate-700">{t.languagesSpoken}</strong> {doctor.languages.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing & Call to Action Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-baseline sm:block gap-2">
            <div className="text-xs text-slate-500">
              {doctor.second_opinion_available ? t.feeTelehealth : t.feeConsult}
            </div>
            <div className="text-base font-bold text-slate-900">
              ${doctor.second_opinion_available ? doctor.telehealth_fee_usd : doctor.consultation_fee_usd}
              <span className="text-xs font-normal text-slate-500 ml-1">USD</span>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
            {doctor.second_opinion_available && (
              <button
                onClick={() => onSelectAction({
                  name: doctor.name,
                  title: doctor.title,
                  type: 'doctor',
                  fee: doctor.telehealth_fee_usd,
                  secondOpinion: true
                })}
                className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
              >
                <Video className="w-3.5 h-3.5 shrink-0" />
                <span>{t.requestSecondOpinion}</span>
              </button>
            )}

            <button
              onClick={() => onSelectAction({
                name: doctor.name,
                title: doctor.title,
                type: 'doctor',
                fee: doctor.consultation_fee_usd,
                secondOpinion: false
              })}
              className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors flex items-center justify-center gap-1 shadow-2xs whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{t.bookConsultation}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (hospital) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shadow-2xs shrink-0">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-base group-hover:text-blue-700 transition-colors truncate">
                    {language === 'ar' ? hospital.name_ar : hospital.name}
                  </h4>
                  {hospital.emergency_department_247 && (
                    <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                      🚨 24/7 ER
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{language === 'ar' ? hospital.city_ar : hospital.city}, {language === 'ar' ? hospital.country_ar : hospital.country}</span>
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xs font-semibold text-amber-600 flex items-center gap-1 justify-end">
                ★ <span>{hospital.rating}</span>
                <span className="text-slate-400 font-normal">({hospital.review_count})</span>
              </div>
            </div>
          </div>

          {/* Accreditations */}
          <div className="mt-2.5 sm:mt-3 flex flex-wrap gap-1 sm:gap-1.5">
            {hospital.accreditations.map((acc, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-[11px] bg-slate-100 text-slate-700 font-medium">
                <Award className="w-3 h-3 text-teal-600 shrink-0" />
                <span>{acc}</span>
              </span>
            ))}
          </div>

          <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-700">Address:</strong> {hospital.address}
          </p>

          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate"><strong>Supported Languages:</strong> {hospital.languages_supported.join(', ')}</span>
          </div>
        </div>

        {/* Footer Contact & Emergency Hotline */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-xs">
            <span className="text-slate-500 font-medium">Emergency Line:</span>
            <span className="ml-1 font-bold text-rose-600">{hospital.emergency_hotline}</span>
          </div>

          <button
            onClick={() => onSelectAction({
              name: hospital.name,
              title: hospital.city + ' Hospital Center',
              type: 'hospital',
              secondOpinion: false
            })}
            className="w-full sm:w-auto px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
          >
            <span>Contact Desk</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};
