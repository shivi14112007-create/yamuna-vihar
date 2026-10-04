import React, { useState } from 'react';
import { INDIAN_STATES } from '../../lib/constants.ts';
import { PledgeFormData } from '../../types/index.ts';
import { User, Mail, MapPin, Building2, Phone, AlertCircle, ArrowRight } from 'lucide-react';

interface PledgeStepFormProps {
  initialData: PledgeFormData;
  onSubmit: (data: PledgeFormData) => void;
  onCancel: () => void;
}

export const PledgeStepForm: React.FC<PledgeStepFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<PledgeFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters long.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required.';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'Please select or enter your State.';
    }

    if (formData.phone && formData.phone.trim()) {
      const cleanPhone = formData.phone.trim().replace(/[\s-]/g, '');
      if (!/^\+?[0-9]{10,12}$/.test(cleanPhone)) {
        newErrors.phone = 'Please enter a valid 10-digit mobile number.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      
      {/* Header bar */}
      <div className="bg-[#0c2f4d] px-6 py-6 text-white text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-300 tracking-widest uppercase">
            Step 1 of 2 • Citizen Information
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-wide text-white mt-0.5">
            Enter Your Basic Details
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            These details will be officially recorded on your personalized Clean Yamuna e-certificate.
          </p>
        </div>
        <div className="hidden sm:flex items-center text-xs text-slate-300 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
          Official Registry Form
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Full Name <span className="text-rose-600">*</span>
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value });
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              placeholder="e.g. Aarav Sharma"
              className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border transition focus:outline-none focus:ring-2 ${
                errors.fullName
                  ? 'border-rose-400 focus:ring-rose-200 text-rose-900 bg-rose-50/30'
                  : 'border-slate-300 focus:border-[#0c2f4d] focus:ring-[#0c2f4d]/20'
              }`}
            />
          </div>
          {errors.fullName ? (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 inline" /> {errors.fullName}
            </p>
          ) : (
            <p className="mt-1 text-[11px] text-slate-500">Your name as it will appear on your e-certificate.</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Email Address <span className="text-rose-600">*</span>
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              placeholder="aarav.sharma@example.com"
              className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border transition focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-rose-400 focus:ring-rose-200 text-rose-900 bg-rose-50/30'
                  : 'border-slate-300 focus:border-[#0c2f4d] focus:ring-[#0c2f4d]/20'
              }`}
            />
          </div>
          {errors.email ? (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 inline" /> {errors.email}
            </p>
          ) : (
            <p className="mt-1 text-[11px] text-slate-500">Used for pledge tracking and certificate delivery.</p>
          )}
        </div>

        {/* City and State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              City <span className="text-rose-600">*</span>
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => {
                  setFormData({ ...formData, city: e.target.value });
                  if (errors.city) setErrors({ ...errors, city: '' });
                }}
                placeholder="e.g. New Delhi"
                className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border transition focus:outline-none focus:ring-2 ${
                  errors.city
                    ? 'border-rose-400 focus:ring-rose-200 text-rose-900 bg-rose-50/30'
                    : 'border-slate-300 focus:border-[#0c2f4d] focus:ring-[#0c2f4d]/20'
                }`}
              />
            </div>
            {errors.city && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 inline" /> {errors.city}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              State / UT <span className="text-rose-600">*</span>
            </label>
            <select
              value={formData.state}
              onChange={(e) => {
                setFormData({ ...formData, state: e.target.value });
                if (errors.state) setErrors({ ...errors, state: '' });
              }}
              className={`block w-full px-3 py-2.5 text-sm rounded-lg border transition focus:outline-none focus:ring-2 bg-white ${
                errors.state
                  ? 'border-rose-400 focus:ring-rose-200 text-rose-900 bg-rose-50/30'
                  : 'border-slate-300 focus:border-[#0c2f4d] focus:ring-[#0c2f4d]/20'
              }`}
            >
              <option value="">Select State or UT</option>
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 inline" /> {errors.state}
              </p>
            )}
          </div>
        </div>

        {/* Country (default India) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Country
          </label>
          <input
            type="text"
            value={formData.country || 'India'}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="block w-full px-3 py-2.5 text-sm rounded-lg border border-slate-300 bg-slate-50 text-slate-700 focus:outline-none"
          />
        </div>

        {/* Organization / College / Institution (optional) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Organization / College / Institution <span className="text-slate-400 text-xs font-normal">(Optional)</span>
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={formData.organization || ''}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              placeholder="e.g. Delhi University / Green Earth Foundation"
              className="block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-slate-300 focus:border-[#0c2f4d] focus:ring-2 focus:ring-[#0c2f4d]/20 focus:outline-none"
            />
          </div>
        </div>

        {/* Phone Number (optional) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Phone Number <span className="text-slate-400 text-xs font-normal">(Optional)</span>
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              placeholder="e.g. 9876543210"
              className={`block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border transition focus:outline-none focus:ring-2 ${
                errors.phone
                  ? 'border-rose-400 focus:ring-rose-200 text-rose-900 bg-rose-50/30'
                  : 'border-slate-300 focus:border-[#0c2f4d] focus:ring-[#0c2f4d]/20'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 inline" /> {errors.phone}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#0c2f4d] hover:bg-[#144272] text-white px-7 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 shadow-md hover:shadow"
          >
            Continue to Official Pledge
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
};
