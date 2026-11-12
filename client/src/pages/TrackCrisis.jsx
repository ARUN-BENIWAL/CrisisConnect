import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { SeverityBadge, StatusBadge } from '../components/Badges';
import { 
  Search, 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  RefreshCw,
  Phone,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const TrackCrisis = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [trackingCode, setTrackingCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [crisis, setCrisis] = useState(null);

  const performTrack = async (codeToTrack) => {
    if (!codeToTrack.trim()) {
      setError('Please provide a valid incident reference code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/public/crises/track/${codeToTrack.trim()}`);
      setCrisis(response.data);
    } catch (err) {
      console.error('Tracking query error', err);
      if (err.response?.status === 404) {
        setError(`No active record found matching code "${codeToTrack}". Please check for typos or contact dispatch.`);
      } else {
        setError('Unable to query incident status. Please try again shortly or contact campus dispatch.');
      }
      setCrisis(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      performTrack(initialCode);
    }
  }, [initialCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ code: trackingCode.trim() });
    performTrack(trackingCode);
  };

  // Determine stage in timeline
  const getStepState = (stepKey, currentStatus) => {
    const sequence = ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    const curIdx = sequence.indexOf(currentStatus);
    const stepIdx = sequence.indexOf(stepKey);

    if (currentStatus === 'INVALID') return 'invalid';
    if (curIdx === -1 || stepIdx === -1) {
      // Check alias mapping
      if (currentStatus === 'ACCEPTED' || currentStatus === 'ON_THE_WAY' || currentStatus === 'ARRIVED') {
        if (stepKey === 'SUBMITTED' || stepKey === 'UNDER_REVIEW' || stepKey === 'ASSIGNED') return 'completed';
        if (stepKey === 'IN_PROGRESS') return 'current';
      }
      return 'pending';
    }

    if (stepIdx < curIdx) return 'completed';
    if (stepIdx === curIdx) return 'current';
    return 'pending';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title & Introduction */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#0f172a]">
          Incident Tracking &amp; Verification
        </h1>
        <p className="text-xs text-slate-500">
          Enter your incident reference code (e.g. <span className="font-mono text-slate-700 font-semibold">CRISIS-100001</span> or <span className="font-mono text-slate-700 font-semibold">CC-XXXXXX</span>) to review on-scene response progression.
        </p>
      </div>

      {/* Code Query Form */}
      <div className="inst-card p-4 sm:p-5">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <label htmlFor="track-input" className="sr-only">Incident Reference Code</label>
            <input
              id="track-input"
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
              placeholder="Enter incident code (e.g. CRISIS-100001)"
              className="form-input font-mono uppercase text-sm tracking-wide pl-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-forest text-xs py-2 px-5 font-bold shrink-0"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" aria-hidden="true" />
            )}
            <span>Track Record</span>
          </button>
        </form>

        {error && (
          <div className="mt-3 p-3 rounded bg-red-50 border border-red-300 text-red-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Incident Result Dossier */}
      {crisis && (
        <div className="inst-card overflow-hidden space-y-0">
          
          {/* Card Header with Badges */}
          <div className="inst-card-header flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold border border-slate-300">
                  {crisis.publicId}
                </span>
                <span className="text-xs text-slate-600 font-medium">{crisis.categoryName}</span>
              </div>
              <h2 className="text-lg font-bold text-[#0f172a]">{crisis.title}</h2>
            </div>

            <div className="flex items-center gap-2 sm:self-start">
              <SeverityBadge severity={crisis.severity} size="sm" />
              <StatusBadge status={crisis.status} size="sm" />
            </div>
          </div>

          {/* Case Description — visible to public */}
          {crisis.description && (
            <div className="px-5 sm:px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#18392b]" aria-hidden="true" />
                <span>Incident Description</span>
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">{crisis.description}</p>
            </div>
          )}

          {/* Operational Progress Steps */}
          <div className="p-5 sm:p-6 space-y-4 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#18392b]" aria-hidden="true" />
              <span>Response Lifecycle Progress</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {[
                { key: 'SUBMITTED', title: 'Submitted', desc: 'Intake Queued' },
                { key: 'UNDER_REVIEW', title: 'Triage', desc: 'Command Review' },
                { key: 'ASSIGNED', title: 'Dispatched', desc: 'Unit Allocated' },
                { key: 'IN_PROGRESS', title: 'On Scene', desc: 'Active Response' },
                { key: 'RESOLVED', title: 'Resolved', desc: 'Hazard Cleared' },
              ].map((step, idx) => {
                const state = getStepState(step.key, crisis.status);

                let cardStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                if (state === 'completed') {
                  cardStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900';
                } else if (state === 'current') {
                  cardStyle = 'bg-[#18392b] border-[#0f251c] text-white';
                }

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded border text-xs flex flex-col justify-between ${cardStyle}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-[10px]">0{idx + 1}</span>
                        {state === 'completed' && <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />}
                        {state === 'current' && <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />}
                      </div>
                      <div className="font-bold text-xs">{step.title}</div>
                      <div className={`text-[10px] mt-0.5 ${state === 'current' ? 'text-emerald-100' : 'text-slate-500'}`}>
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timestamps */}
          <div className="p-4 bg-slate-50 text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2 border-b border-slate-200">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>Report Dispatched: <strong className="text-slate-800">{new Date(crisis.submittedAt).toLocaleString()}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>Latest Operations Update: <strong className="text-slate-800">{new Date(crisis.lastUpdate).toLocaleString()}</strong></span>
            </div>
          </div>

          {/* Emergency Dispatch Assistance Bar */}
          <div className="p-4 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-slate-800">
                Has your situation worsened or escalated on campus?
              </div>
              <p className="text-[11px] text-slate-500">
                Contact SRM KTR Security Control Room directly with your incident ID, or dial 112 for critical emergency response.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="tel:04427452270"
                className="btn btn-secondary text-xs font-semibold py-1.5 px-3"
              >
                <Phone className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
                <span>SRM Security (044-2745 2270)</span>
              </a>
              <a
                href="tel:04447432345"
                className="btn btn-forest text-xs font-semibold py-1.5 px-3"
              >
                <span>SRM Hospital (044-4743 2345)</span>
              </a>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
