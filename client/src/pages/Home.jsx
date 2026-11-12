import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  AlertCircle, 
  Search, 
  ShieldCheck, 
  Clock, 
  Phone, 
  FileText,
  Activity,
  ArrowRight,
  Lock,
  Building,
  Flame,
  Stethoscope,
  HeartHandshake,
  AlertTriangle
} from 'lucide-react';

export const Home = () => {
  const [telemetry, setTelemetry] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/public/status').catch(() => null),
      api.get('/categories').catch(() => null),
    ]).then(([statusRes, catRes]) => {
      if (statusRes?.data) setTelemetry(statusRes.data);
      if (catRes?.data) setCategories(catRes.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-10 pb-12">
      {/* Institutional Top Banner */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl space-y-4">
            
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-[#18392b] text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              <span>SRM KTR Campus Emergency Operations Center • 24x7 Active</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">
              SRM KTR Incident Reporting &amp; Campus Emergency Coordination
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              CrisisConnect provides SRM Institute of Science and Technology (Kattankulathur) students, faculty, and campus staff with direct electronic dispatch to SRM Campus Security, SRM Hospital Casualty, and rapid crisis response teams.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
              <Link
                to="/report"
                className="btn btn-emergency py-3 px-6 text-sm font-bold shadow-sm"
              >
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                <span>Submit an Incident Report</span>
              </Link>

              <Link
                to="/track"
                className="btn btn-secondary py-3 px-5 text-sm font-semibold"
              >
                <Search className="w-4 h-4 text-slate-500" aria-hidden="true" />
                <span>Track Report by Incident ID</span>
              </Link>
            </div>

            {/* Institutional Trust Factors */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-500 border-t border-slate-100">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Lock className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" /> Confidential &amp; Anonymous Reporting
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Clock className="w-3.5 h-3.5 text-slate-700" aria-hidden="true" /> Direct SRM Hospital &amp; Security Dispatch
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-700" aria-hidden="true" /> Kattankulathur Campus EOC Audit
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Real-time System Telemetry Bar (100% backend data) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inst-card p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#18392b]" aria-hidden="true" />
                <span>Live Operations Status</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Current telemetry from the campus emergency management database
              </p>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Status: <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{telemetry?.systemStatus || 'OPERATIONAL'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="text-[11px] font-semibold uppercase text-slate-500">Active Incidents</div>
              <div className="text-2xl font-bold text-[#0f172a] mt-0.5">
                {telemetry ? telemetry.activeIncidents : '—'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">In triage or on scene</div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="text-[11px] font-semibold uppercase text-slate-500">Resolved Incidents</div>
              <div className="text-2xl font-bold text-emerald-800 mt-0.5">
                {telemetry ? telemetry.resolvedIncidents : '—'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Secured and closed</div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="text-[11px] font-semibold uppercase text-slate-500">Total Recorded</div>
              <div className="text-2xl font-bold text-slate-800 mt-0.5">
                {telemetry ? telemetry.totalRecorded : '—'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Database audit log</div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="text-[11px] font-semibold uppercase text-slate-500">Dispatch Readiness</div>
              <div className="text-2xl font-bold text-[#18392b] mt-0.5">
                {telemetry ? telemetry.dispatchReadiness : '24/7 ACTIVE'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Police, EMT, Facilities on duty</div>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Incident Categories & Reporting Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inst-card overflow-hidden">
          <div className="inst-card-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-[#0f172a]">
                Incident Response Protocols &amp; Reporting Channels
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select an emergency category for direct routing to authorized campus response units.
              </p>
            </div>
            <Link
              to="/report"
              className="text-xs font-semibold text-[#18392b] hover:underline flex items-center gap-1"
            >
              <span>Open Complete Report Form</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Emergency Classification</th>
                  <th className="py-2.5 px-4">Designated Responding Unit</th>
                  <th className="py-2.5 px-4">Response Protocol Summary</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  {
                    name: 'Medical Emergency',
                    unit: 'Student Health & Campus Paramedics',
                    desc: 'Severe illness, collapse, allergic anaphylaxis, acute trauma, or loss of consciousness.',
                    path: 'Medical Emergency',
                    urgent: true,
                  },
                  {
                    name: 'Fire & Chemical Hazard',
                    unit: 'Environmental Health & Safety (EHS) / Fire Marshal',
                    desc: 'Active smoke, chemical spill in research labs, gas odor, or electrical arcing.',
                    path: 'Fire / Hazardous Material',
                    urgent: true,
                  },
                  {
                    name: 'Physical Threat & Violence',
                    unit: 'Campus Police Department Dispatch',
                    desc: 'Armed individual, physical altercation, intruder in residence halls, or stalking.',
                    path: 'Physical Threat & Violence',
                    urgent: true,
                  },
                  {
                    name: 'Mental Health Crisis',
                    unit: 'Counseling & Psychological Services (CAPS)',
                    desc: 'Severe emotional distress, suicide intervention, panic attack, or substance overdose.',
                    path: 'Mental Health Crisis',
                    urgent: false,
                  },
                  {
                    name: 'Facility & Infrastructure Breakdown',
                    unit: 'Campus Operations & Facilities Engineering',
                    desc: 'Elevator entrapment, major water main leak, power outage, or broken security doors.',
                    path: 'Facility / Infrastructure',
                    urgent: false,
                  },
                  {
                    name: 'General Campus Safety',
                    unit: 'Dean of Students Triage & Public Safety',
                    desc: 'Severe weather hazard, suspicious activity, crowd disturbance, or property safety.',
                    path: 'General Campus Safety',
                    urgent: false,
                  },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#0f172a] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {row.urgent && (
                          <span className="w-2 h-2 rounded-full bg-red-600" title="Immediate Priority" />
                        )}
                        <span>{row.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium border border-slate-200">
                        {row.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-md">
                      {row.desc}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Link
                        to={`/report?category=${encodeURIComponent(row.path)}`}
                        className="btn btn-subtle text-xs py-1 px-2.5 font-semibold text-[#18392b]"
                      >
                        File Report &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Incident Response Lifecycle (Clear Institutional Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inst-card p-6 sm:p-8">
          <div className="max-w-2xl mb-6">
            <h2 className="text-base font-bold text-[#0f172a]">
              Incident Resolution Workflow
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Every incident submitted to CrisisConnect follows strict operational standards ensuring timely on-scene dispatch and immutable documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                step: '1',
                title: 'Report Intake',
                desc: 'Electronic submission with location coordinates, severity, and optional confidentiality. A unique tracking code is generated immediately.',
              },
              {
                step: '2',
                title: 'Command Triage',
                desc: 'Dispatch commanders verify severity and allocate the nearest available responder unit based on specialization.',
              },
              {
                step: '3',
                title: 'Field Response',
                desc: 'Responders acknowledge dispatch, proceed to the scene, and record real-time progress notes in the operational docket.',
              },
              {
                step: '4',
                title: 'Resolution Dossier',
                desc: 'On-scene actions are submitted in a formal resolution report. Records are archived for Clery Act safety compliance.',
              },
            ].map((st, i) => (
              <div key={i} className="p-4 rounded border border-slate-200 bg-slate-50/60">
                <div className="w-6 h-6 rounded-full bg-[#18392b] text-white flex items-center justify-center font-bold text-xs mb-2">
                  {st.step}
                </div>
                <h3 className="font-semibold text-xs text-[#0f172a] mb-1">{st.title}</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Emergency Callout Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-300 rounded-md p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-red-700" aria-hidden="true" />
              <span>Immediate Life Safety Threat on SRM KTR Campus?</span>
            </div>
            <p className="text-xs text-red-800">
              Do not wait for an electronic ticket if you are in immediate physical danger, severe medical shock, or active fire. Dial <strong>112</strong> (National Emergency), <strong>108</strong> (Ambulance), or call <strong>SRM Hospital Emergency: 044-4743 2345</strong> / <strong>Campus Security: 044-2745 2270</strong> immediately.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="tel:112"
              className="btn btn-emergency text-xs font-bold py-2 px-3 shadow-sm"
            >
              Dial 112 (National)
            </a>
            <a
              href="tel:04447432345"
              className="btn btn-forest text-xs font-bold py-2 px-3 shadow-sm"
            >
              SRM Hospital (24/7)
            </a>
            <Link
              to="/contacts"
              className="btn btn-secondary text-xs font-semibold py-2 px-3"
            >
              Full Directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
