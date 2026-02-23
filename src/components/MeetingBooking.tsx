'use client';

import { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, Building2, MessageSquare, DollarSign, CheckCircle, X } from 'lucide-react';
import { useGsapReveal } from '@/hooks/useGsap';

const projectTypes = ['Website', 'Web App', 'E-commerce', 'Mobile App', 'API/Backend', 'UI/UX Design', 'Consultation', 'Other'];
const budgetRanges = ['< $500', '$500 - $1,000', '$1,000 - $5,000', '$5,000 - $10,000', '$10,000+'];
const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

export default function MeetingBooking() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    projectType: '', budget: '', date: '', time: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    message: '',
  });
  const ref = useGsapReveal({ y: 30 });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
    } catch {
      alert('Failed to book meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get next 14 available dates (excluding weekends)
  const getAvailableDates = () => {
    const dates: string[] = [];
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (dates.length < 14) {
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        dates.push(d.toISOString().split('T')[0]);
      }
      d.setDate(d.getDate() + 1);
    }
    return dates;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (!open) {
    return (
      <section id="booking" className="py-20 md:py-28">
        <div ref={ref} className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
            Book a Call
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Let&apos;s Discuss Your Project
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Schedule a free 30-minute consultation to discuss your project requirements, timeline, and budget
          </p>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/25 text-lg"
          >
            <Calendar className="w-5 h-5" />
            Schedule Free Consultation
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 md:py-28">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/50">
            <h3 className="text-lg font-bold text-white">Book a Consultation</h3>
            <button onClick={() => { setOpen(false); setStep(1); setSuccess(false); }} className="p-1 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="flex gap-1 px-6 pt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all ${step >= s ? 'bg-emerald-500' : 'bg-gray-700'}`} />
            ))}
          </div>

          <div className="p-6">
            {success ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Meeting Booked!</h3>
                <p className="text-gray-400 mb-2">
                  {formatDate(form.date)} at {form.time} ({form.timezone})
                </p>
                <p className="text-sm text-gray-500">You&apos;ll receive a confirmation email shortly.</p>
              </div>
            ) : step === 1 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-400 mb-2">Your Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Full Name *" required className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="Email *" required className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Phone" className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                  </div>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input value={form.company} onChange={(e) => update('company', e.target.value)} placeholder="Company" className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Project Type</p>
                  <div className="flex flex-wrap gap-2">
                    {projectTypes.map((pt) => (
                      <button key={pt} onClick={() => update('projectType', pt)} className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${form.projectType === pt ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                        {pt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Estimated Budget</p>
                  <div className="flex flex-wrap gap-2">
                    {budgetRanges.map((b) => (
                      <button key={b} onClick={() => update('budget', b)} className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${form.budget === b ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => form.name && form.email ? setStep(2) : alert('Please fill name and email')}
                  className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition-colors"
                >
                  Continue
                </button>
              </div>
            ) : step === 2 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-400 mb-2">Select Date & Time</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                  {getAvailableDates().map((d) => (
                    <button key={d} onClick={() => update('date', d)} className={`p-2 rounded-lg text-sm border transition-all ${form.date === d ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-gray-800/60 border-gray-700 text-gray-300 hover:border-gray-600'}`}>
                      {formatDate(d)}
                    </button>
                  ))}
                </div>
                {form.date && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Time ({form.timezone})</p>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((t) => (
                        <button key={t} onClick={() => update('time', t)} className={`p-2 rounded-lg text-sm border transition-all ${form.time === t ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-gray-800/60 border-gray-700 text-gray-300 hover:border-gray-600'}`}>
                          <Clock className="w-3 h-3 inline mr-1" />{t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">Back</button>
                  <button onClick={() => form.date && form.time ? setStep(3) : alert('Please select date and time')} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition-colors">Continue</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-400 mb-2">Additional Message (Optional)</p>
                <textarea
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  rows={4}
                  placeholder="Describe your project or any specific topics you'd like to discuss..."
                  className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                />
                <div className="bg-gray-800/40 rounded-xl p-4 text-sm">
                  <p className="text-gray-400 mb-2">Booking Summary:</p>
                  <div className="space-y-1 text-gray-300">
                    <p><Calendar className="w-3 h-3 inline mr-1" /> {formatDate(form.date)} at {form.time}</p>
                    {form.projectType && <p>Project: {form.projectType}</p>}
                    {form.budget && <p><DollarSign className="w-3 h-3 inline mr-1" /> Budget: {form.budget}</p>}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">Back</button>
                  <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50">
                    {loading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
