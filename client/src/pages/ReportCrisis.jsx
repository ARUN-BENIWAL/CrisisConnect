import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  AlertCircle, 
  MapPin, 
  CheckCircle, 
  Copy, 
  Check, 
  FileText, 
  User, 
  Phone, 
  Mail, 
  Shield, 
  Info,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

export const ReportCrisis = () => {
  const [searchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form State
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('MEDIUM');
  
  // Location breakdown
  const [location, setLocation] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [locationDetails, setLocationDetails] = useState('');

  // Reporter Info
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submittedCrisis, setSubmittedCrisis] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        setCategories(res.data);
        const queryCat = searchParams.get('category');
        if (queryCat && res.data.length > 0) {
          const match = res.data.find(
            (c) => c.name.toLowerCase().includes(queryCat.toLowerCase())
          );
          if (match) setCategoryId(match.id);
        } else if (res.data.length > 0) {
          setCategoryId(res.data[0].id);
        }
      })
      .catch((err) => {
        console.error('Failed to load categories', err);
        setCategories([
          { id: 1, name: 'Medical Emergency', description: 'Illness, trauma, collapse, or medical distress', icon: 'stethoscope' },
          { id: 2, name: 'Fire / Hazardous Material', description: 'Smoke, flames, gas leak, or chemical spill', icon: 'flame' },
          { id: 3, name: 'Physical Threat & Violence', description: 'Active intruder, assault, robbery, or weapon on campus', icon: 'shield' },
          { id: 4, name: 'Mental Health Crisis', description: 'Psychological distress or suicide intervention', icon: 'heart' },
          { id: 5, name: 'Facility / Infrastructure', description: 'Elevator entrapment, power failure, or water leak', icon: 'building' },
          { id: 6, name: 'General Campus Safety', description: 'Weather hazard, disturbance, or suspicious condition', icon: 'alert' },
        ]);
        setCategoryId(1);
      })
      .finally(() => setLoadingCategories(false));
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!categoryId) {
      setError('Please select an incident classification.');
      return;
    }
    if (!title.trim() || title.trim().length < 5) {
      setError('Incident headline must be at least 5 characters long.');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setError('Please provide a specific narrative description (minimum 10 characters).');
      return;
    }
    if (!location.trim()) {
      setError('Campus area or building location is required.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        categoryId: Number(categoryId),
        title: title.trim(),
        description: description.trim(),
        severity,
        location: location.trim(),
        building: building.trim() || undefined,
        floor: floor.trim() || undefined,
        room: room.trim() || undefined,
        locationDetails: locationDetails.trim() || undefined,
        isAnonymous,
        reporterName: isAnonymous ? undefined : reporterName.trim() || undefined,
        reporterEmail: isAnonymous ? undefined : reporterEmail.trim() || undefined,
        reporterPhone: isAnonymous ? undefined : reporterPhone.trim() || undefined,
      };

      const response = await api.post('/public/crises', payload);
      setSubmittedCrisis(response.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to report incident', err);
      const errMsg = err.response?.data?.message || 'Unable to transmit incident report. If this is an emergency, contact campus dispatch by phone.';
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* If submitted, show institutional confirmation view */}
      {submittedCrisis ? (
        <div className="inst-card p-6 sm:p-8 space-y-6 border-emerald-300">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="w-10 h-10 rounded bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0f172a]">
                Incident Report Dispatched to Campus Safety
              </h1>
              <p className="text-xs text-slate-500">
                Your electronic report has been queued in the dispatch operations system.
              </p>
            </div>
          </div>

          {/* Tracking ID Box */}
          <div className="bg-slate-50 border border-slate-300 rounded p-4 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Official Incident Reference Number:
            </span>
            <div className="flex items-center justify-between gap-3 bg-white p-3 rounded border border-slate-300 font-mono text-xl font-bold text-[#18392b]">
              <span>{submittedCrisis.publicId}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(submittedCrisis.publicId)}
                className="btn btn-secondary text-xs py-1.5 px-3 font-sans"
                title="Copy reference code to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Retain this code. You may check the live status, responder assignment, and clearance notes at any time.
            </p>
          </div>

          {/* What to do next notice */}
          <div className="space-y-2 bg-slate-50 p-4 rounded border border-slate-200 text-xs text-slate-700">
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
              Immediate Safety Instructions
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              <li>Stay in a safe location unless instructed to evacuate by campus security or fire alarms.</li>
              <li>If the situation changes or becomes immediately life-threatening, dial <strong>112</strong> (National Emergency) or call SRM Hospital Emergency directly at <strong>044-4743 2345</strong>.</li>
              <li>SRM KTR Security Control Room (044-2745 2270) has received electronic notification of your report.</li>
            </ul>
          </div>

          {/* Action links */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              to={`/track?code=${submittedCrisis.publicId}`}
              className="btn btn-forest w-full sm:w-auto text-xs py-2.5 px-5 font-bold"
            >
              <span>Track Incident in Real Time</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={() => {
                setSubmittedCrisis(null);
                setTitle('');
                setDescription('');
                setLocation('');
                setBuilding('');
                setFloor('');
                setRoom('');
                setLocationDetails('');
              }}
              className="btn btn-secondary w-full sm:w-auto text-xs py-2.5 px-4"
            >
              File Another Report
            </button>
          </div>
        </div>
      ) : (
        /* Standard Incident Intake Form */
        <div className="inst-card overflow-hidden">
          <div className="inst-card-header">
            <div className="flex items-center gap-2 text-[#18392b] text-xs font-bold uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" aria-hidden="true" />
              <span>Campus Incident Reporting Form</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0f172a]">
              Submit Incident or Safety Concern
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Provide specific information to help dispatch coordinators deploy appropriate personnel.
            </p>
          </div>

          {error && (
            <div className="m-5 p-3 rounded bg-red-50 border border-red-300 text-red-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
            
            {/* 1. Category selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Incident Classification <span className="text-red-700">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`p-3 rounded border text-left transition-colors ${
                      categoryId === cat.id
                        ? 'bg-emerald-50 border-[#18392b] text-[#18392b] ring-1 ring-[#18392b]'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-semibold text-xs text-slate-900">{cat.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{cat.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Urgency / Severity */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Urgency Level <span className="text-red-700">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    level: 'LOW',
                    title: 'Low',
                    desc: 'No safety risk; non-urgent facility matter.',
                    selectedClass: 'bg-slate-100 border-slate-400 text-slate-900 ring-1 ring-slate-400',
                  },
                  {
                    level: 'MEDIUM',
                    title: 'Medium',
                    desc: 'Prompt attention needed; no immediate danger.',
                    selectedClass: 'bg-amber-50 border-amber-400 text-amber-950 ring-1 ring-amber-400',
                  },
                  {
                    level: 'HIGH',
                    title: 'High',
                    desc: 'Urgent response; threat to health or property.',
                    selectedClass: 'bg-orange-50 border-orange-400 text-orange-950 ring-1 ring-orange-400',
                  },
                  {
                    level: 'CRITICAL',
                    title: 'Critical',
                    desc: 'Life safety risk; active emergency response.',
                    selectedClass: 'bg-red-50 border-red-400 text-red-950 ring-1 ring-red-400',
                  },
                ].map((s) => (
                  <button
                    key={s.level}
                    type="button"
                    onClick={() => setSeverity(s.level)}
                    className={`p-2.5 rounded border text-left transition-colors ${
                      severity === s.level
                        ? s.selectedClass
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-xs">{s.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Incident Details */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Incident Narrative
              </h2>

              <div>
                <label htmlFor="incident-title" className="block text-xs font-medium text-slate-700 mb-1">
                  Brief Headline <span className="text-red-700">*</span>
                </label>
                <input
                  id="incident-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Electrical sparks near Chemistry Lab 304, Slip and fall near Gym entrance"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label htmlFor="incident-desc" className="block text-xs font-medium text-slate-700 mb-1">
                  Specific Description <span className="text-red-700">*</span>
                </label>
                <textarea
                  id="incident-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what occurred, any injured persons, observable hazards, or individuals involved..."
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* 4. Location Information */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#18392b]" aria-hidden="true" />
                <span>4. Campus Location Coordinates</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="campus-area" className="block text-xs font-medium text-slate-700 mb-1">
                    Campus Zone / Area <span className="text-red-700">*</span>
                  </label>
                  <input
                    id="campus-area"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. University Building (UB), Tech Park, Food Street"
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="campus-building" className="block text-xs font-medium text-slate-700 mb-1">
                    Building Name
                  </label>
                  <input
                    id="campus-building"
                    type="text"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    placeholder="e.g. Tech Park, Bioengineering Block, Paari Hostel"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="campus-floor" className="block text-xs font-medium text-slate-700 mb-1">
                    Floor Level
                  </label>
                  <input
                    id="campus-floor"
                    type="text"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    placeholder="e.g. 7th Floor, Ground Floor"
                    className="form-input"
                  />
                </div>

                <div>
                  <label htmlFor="campus-room" className="block text-xs font-medium text-slate-700 mb-1">
                    Room or Hallway
                  </label>
                  <input
                    id="campus-room"
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g. TP Lab 704, Room 212"
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="campus-landmarks" className="block text-xs font-medium text-slate-700 mb-1">
                  Landmarks / Access Instructions
                </label>
                <input
                  id="campus-landmarks"
                  type="text"
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  placeholder="e.g. Near Java Green cafe, Tech Park lift lobby B"
                  className="form-input"
                />
              </div>
            </div>

            {/* 5. Reporter Confidentiality */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  5. Reporter Information
                </h2>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-slate-300 text-[#18392b] focus:ring-[#18392b]"
                  />
                  <span>Submit Anonymously</span>
                </label>
              </div>

              {isAnonymous ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-800 shrink-0" aria-hidden="true" />
                  <span>
                    No identifying information will be associated with this report in dispatch records. You will still receive a reference tracking code.
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="reporter-name" className="block text-xs font-medium text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="reporter-name"
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="e.g. Rohit Sharma"
                      className="form-input text-xs"
                    />
                  </div>

                  <div>
                    <label htmlFor="reporter-email" className="block text-xs font-medium text-slate-700 mb-1">
                      University Email
                    </label>
                    <input
                      id="reporter-email"
                      type="email"
                      value={reporterEmail}
                      onChange={(e) => setReporterEmail(e.target.value)}
                      placeholder="rs1234@srmist.edu.in"
                      className="form-input text-xs"
                    />
                  </div>

                  <div>
                    <label htmlFor="reporter-phone" className="block text-xs font-medium text-slate-700 mb-1">
                      Callback Mobile
                    </label>
                    <input
                      id="reporter-phone"
                      type="tel"
                      value={reporterPhone}
                      onChange={(e) => setReporterPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="form-input text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submission Button Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500">
                Official transmission to SRM KTR Campus Emergency Operations Center.
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-forest w-full sm:w-auto text-xs py-2.5 px-6 font-bold"
              >
                {submitting ? (
                  <span>Transmitting Dispatch...</span>
                ) : (
                  <>
                    <FileText className="w-4 h-4" aria-hidden="true" />
                    <span>Submit Incident Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
