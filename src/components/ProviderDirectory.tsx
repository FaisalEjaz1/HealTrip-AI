import React, { useState, useEffect } from 'react';
import { Doctor, Hospital } from '../types/index.js';
import { ProviderCard } from './ProviderCard.js';
import { Search, Filter, Building2, Stethoscope, RefreshCw, ShieldCheck } from 'lucide-react';
import { translations } from '../locales/translations.js';

interface ProviderDirectoryProps {
  language: 'en' | 'ar';
  onOpenBooking: (provider: any) => void;
}

export const ProviderDirectory: React.FC<ProviderDirectoryProps> = ({
  language,
  onOpenBooking
}) => {
  const [specialty, setSpecialty] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [emergencyOnly, setEmergencyOnly] = useState<boolean>(false);
  const [telehealthOnly, setTelehealthOnly] = useState<boolean>(false);
  const [viewType, setViewType] = useState<'all' | 'doctors' | 'hospitals'>('all');

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);

  const t = translations[language];

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (specialty) queryParams.set('specialty', specialty);
      if (location) queryParams.set('location', location);
      if (emergencyOnly) queryParams.set('emergency_capable', 'true');
      if (telehealthOnly) queryParams.set('telehealth_second_opinion', 'true');

      const res = await fetch(`/api/providers?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDoctors(data.doctors || []);
        setHospitals(data.hospitals || []);
        setTotalCount((data.doctors?.length || 0) + (data.hospitals?.length || 0));
      }
    } catch (err) {
      console.error('Failed to fetch providers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [specialty, location, emergencyOnly, telehealthOnly]);

  const resetFilters = () => {
    setSpecialty('');
    setLocation('');
    setEmergencyOnly(false);
    setTelehealthOnly(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title & Info Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              {language === 'ar' ? 'دليل الأطباء والمراكز الطبية المعتمدة' : 'HealTrip Verified Medical Directory'}
            </h2>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              {language === 'ar' ? 'مصدر بيانات موثق' : 'Grounded Data Source'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {language === 'ar'
              ? 'تعتمد أدوات الوكيل الذكي (search_providers) على قاعدة البيانات هذه للبحث والتصفية، مما يمنع الهلوسة ويضمن تقديم أسعار واعتمادات حقيقية.'
              : 'This is the structured clinical database queried by the AI Agent tools (search_providers & get_provider_details) to guarantee zero-hallucination healthcare matching.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={() => setViewType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewType === 'all' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setViewType('doctors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              viewType === 'doctors' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctors ({doctors.length})</span>
          </button>
          <button
            onClick={() => setViewType('hospitals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              viewType === 'hospitals' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Hospitals ({hospitals.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Specialty */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Specialty</label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-teal-500 outline-hidden"
            >
              <option value="">All Specialties</option>
              <option value="Cardiology">Cardiology (أمراض القلب)</option>
              <option value="Orthopedics">Orthopedics (العظام والمفاصل)</option>
              <option value="Neurology">Neurology (المخ والأعصاب)</option>
              <option value="Oncology">Oncology (الأورام)</option>
              <option value="Emergency Medicine">Emergency Medicine (طب الطوارئ)</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">City / Country</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-teal-500 outline-hidden"
            >
              <option value="">All Locations</option>
              <option value="Istanbul">Istanbul, Turkey</option>
              <option value="Dubai">Dubai, UAE</option>
              <option value="Riyadh">Riyadh, Saudi Arabia</option>
              <option value="Amman">Amman, Jordan</option>
              <option value="Berlin">Berlin, Germany</option>
              <option value="London">London, UK</option>
            </select>
          </div>

          {/* Toggles: Emergency & Telehealth */}
          <div className="flex flex-col justify-end gap-1.5">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={emergencyOnly}
                onChange={(e) => setEmergencyOnly(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <span className="font-semibold text-rose-700">🚨 24/7 ER Capable</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={telehealthOnly}
                onChange={(e) => setTelehealthOnly(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <span className="font-semibold text-teal-700">🌐 2nd Opinion / Telehealth</span>
            </label>
          </div>

          {/* Reset button */}
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full py-2 px-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Querying verified database...</p>
        </div>
      ) : totalCount === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">No matching providers in database</h4>
          <p className="text-xs text-slate-500 mt-1">Try resetting the filters or widening your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(viewType === 'all' || viewType === 'doctors') &&
            doctors.map((doc) => (
              <ProviderCard
                key={doc.id}
                doctor={doc}
                language={language}
                onSelectAction={onOpenBooking}
              />
            ))}

          {(viewType === 'all' || viewType === 'hospitals') &&
            hospitals.map((hosp) => (
              <ProviderCard
                key={hosp.id}
                hospital={hosp}
                language={language}
                onSelectAction={onOpenBooking}
              />
            ))}
        </div>
      )}
    </div>
  );
};
