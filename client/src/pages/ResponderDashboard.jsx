import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { SeverityBadge, StatusBadge } from '../components/Badges';
import { CrisisDetailModal } from '../components/CrisisDetailModal';
import { 
  UserCheck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Eye, 
  Activity, 
  ArrowRight, 
  FileCheck 
} from 'lucide-react';

export const ResponderDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCrisisId, setSelectedCrisisId] = useState(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(undefined);

  // Active filter tab
  const [filterTab, setFilterTab] = useState('ALL');

  // Duty status
  const [availability, setAvailability] = useState('AVAILABLE');
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  const fetchResponderData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [assignmentsRes, statsRes] = await Promise.all([
        api.get('/responder/assignments'),
        api.get('/responder/dashboard'),
      ]);

      setAssignments(assignmentsRes.data || []);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load responder operational docket', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchResponderData();
  }, []);

  const handleUpdateAvailability = async (newAvail) => {
    setUpdatingAvailability(true);
    try {
      await api.put('/responder/availability', { availability: newAvail });
      setAvailability(newAvail);
    } catch (err) {
      console.error('Availability update failed', err);
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const handleAccept = async (assignmentId) => {
    try {
      await api.post(`/responder/assignments/${assignmentId}/accept`);
      await fetchResponderData(true);
    } catch (err) {
      console.error('Error accepting mission', err);
      alert('Unable to acknowledge assignment.');
    }
  };

  const handleStart = async (assignmentId) => {
    try {
      await api.patch(`/responder/assignments/${assignmentId}/status`, {
        status: 'IN_PROGRESS',
        notes: 'Responder arrived on scene.',
      });
      await fetchResponderData(true);
    } catch (err) {
      console.error('Error marking in progress', err);
      alert('Unable to update operational status.');
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    if (filterTab === 'NEW') return a.assignmentStatus === 'ASSIGNED';
    if (filterTab === 'ACTIVE') return ['ACCEPTED', 'IN_PROGRESS', 'ON_THE_WAY', 'ARRIVED'].includes(a.assignmentStatus);
    if (filterTab === 'RESOLVED') return ['COMPLETED', 'RESOLVED'].includes(a.assignmentStatus);
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Tactical Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#18392b] mb-1">
            <UserCheck className="w-4 h-4 text-[#18392b]" aria-hidden="true" />
            <span>SRM KTR Tactical Field Operations • Kattankulathur</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a]">
            Active Incident Missions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Receive automated incident assignments from SRM Security Control, update on-scene status, and log resolution actions.
          </p>
        </div>

        {/* Duty Status Switcher & Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded p-1 text-xs">
            <span className="text-slate-500 font-semibold px-1 text-[11px] uppercase">Duty:</span>
            {['AVAILABLE', 'ON_SCENE', 'OFF_DUTY'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => handleUpdateAvailability(st)}
                disabled={updatingAvailability}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  availability === st
                    ? st === 'AVAILABLE'
                      ? 'bg-[#18392b] text-white'
                      : st === 'ON_SCENE'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-700 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchResponderData(true)}
            disabled={refreshing}
            className="btn btn-secondary text-xs p-2"
            title="Refresh active missions"
            aria-label="Refresh missions"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Assigned Missions', value: stats?.totalAssigned ?? assignments.length, note: 'Assigned to unit' },
          { label: 'Pending Acceptance', value: stats?.newlyAssigned ?? assignments.filter((a) => a.assignmentStatus === 'ASSIGNED').length, note: 'Action required' },
          { label: 'Active on Scene', value: stats?.inProgress ?? assignments.filter((a) => a.assignmentStatus === 'IN_PROGRESS').length, note: 'Currently engaging' },
          { label: 'Cleared Missions', value: stats?.resolved ?? assignments.filter((a) => ['COMPLETED', 'RESOLVED'].includes(a.assignmentStatus)).length, note: 'Resolved & closed' },
        ].map((s, idx) => (
          <div key={idx} className="inst-card p-3.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.label}</div>
            <div className="text-2xl font-bold text-[#0f172a] mt-1">{s.value}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{s.note}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {[
          { key: 'ALL', label: `All Missions (${assignments.length})` },
          { key: 'NEW', label: 'Needs Acceptance' },
          { key: 'ACTIVE', label: 'Active on Scene' },
          { key: 'RESOLVED', label: 'Resolved / Closed' },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setFilterTab(t.key)}
            className={`px-3 py-1.5 border-b-2 text-xs font-bold transition-colors ${
              filterTab === t.key
                ? 'border-[#18392b] text-[#18392b] bg-emerald-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Active Missions Docket */}
      {filteredAssignments.length === 0 ? (
        <div className="inst-card p-10 text-center">
          <CheckCircle className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
          <h2 className="text-sm font-bold text-slate-900">No active incidents assigned</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You are on standby. Any new dispatches routed to your unit by command will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAssignments.map((a) => (
            <div
              key={a.assignmentId}
              className="inst-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-800 border border-slate-300">
                    {a.publicId}
                  </span>
                  <SeverityBadge severity={a.severity} size="sm" />
                  <StatusBadge status={a.assignmentStatus} size="sm" />
                  <span className="text-xs text-slate-500 font-medium">• {a.categoryName}</span>
                </div>

                <div>
                  <h2 className="text-base font-bold text-[#0f172a]">{a.title}</h2>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{a.description}</p>
                </div>

                {/* Location & Instructions Bar */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-1 font-medium text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-[#18392b] shrink-0" aria-hidden="true" />
                    <span>{a.location}</span>
                    {(a.building || a.floor || a.room) && (
                      <span className="text-slate-500">
                        ({[a.building, a.floor, a.room].filter(Boolean).join(', ')})
                      </span>
                    )}
                  </div>

                  {a.instructions && (
                    <div className="text-[11px] bg-amber-50 text-amber-950 px-2 py-0.5 rounded border border-amber-200">
                      <strong>Dispatch:</strong> {a.instructions}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 md:self-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                {a.assignmentStatus === 'ASSIGNED' && (
                  <button
                    type="button"
                    onClick={() => handleAccept(a.assignmentId)}
                    className="btn btn-forest text-xs py-1.5 px-3 font-bold"
                  >
                    Acknowledge &amp; En Route
                  </button>
                )}

                {a.assignmentStatus === 'ACCEPTED' && (
                  <button
                    type="button"
                    onClick={() => handleStart(a.assignmentId)}
                    className="btn btn-forest text-xs py-1.5 px-3 font-bold"
                  >
                    Mark On Scene
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCrisisId(a.crisisId);
                    setSelectedAssignmentId(a.assignmentId);
                  }}
                  className="btn btn-secondary text-xs py-1.5 px-3 font-semibold"
                >
                  <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Open Dossier &amp; Resolve</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for detailed notes & resolution report */}
      {selectedCrisisId && (
        <CrisisDetailModal
          crisisId={selectedCrisisId}
          assignmentId={selectedAssignmentId}
          onClose={() => {
            setSelectedCrisisId(null);
            setSelectedAssignmentId(undefined);
          }}
          onRefresh={() => fetchResponderData(true)}
          userRole="RESPONDER"
        />
      )}

    </div>
  );
};
