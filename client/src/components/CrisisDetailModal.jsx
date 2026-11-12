import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { SeverityBadge, StatusBadge } from './Badges';
import { 
  X, 
  MapPin, 
  User as UserIcon, 
  Shield, 
  FileText, 
  Send, 
  History, 
  Activity, 
  UserCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const CrisisDetailModal = ({
  crisisId,
  assignmentId,
  onClose,
  onRefresh,
  userRole,
}) => {
  const [crisis, setCrisis] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [notes, setNotes] = useState([]);
  const [responders, setResponders] = useState([]);
  const [resolutions, setResolutions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin action state
  const [selectedResponder, setSelectedResponder] = useState('');
  const [assignInstructions, setAssignInstructions] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Responder action state
  const [progressNoteText, setProgressNoteText] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  // Resolution report state
  const [showResolutionForm, setShowResolutionForm] = useState(false);
  const [actionsTaken, setActionsTaken] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [couldResolve, setCouldResolve] = useState(true);
  const [unableReason, setUnableReason] = useState('');
  const [submittingResolution, setSubmittingResolution] = useState(false);

  useEffect(() => {
    fetchCrisisDetails();
  }, [crisisId]);

  const fetchCrisisDetails = async () => {
    setLoading(true);
    try {
      if (userRole === 'ADMIN') {
        const [crisisRes, historyRes, notesRes, respondersRes, resolutionsRes, assignmentsRes] = await Promise.all([
          api.get(`/admin/crises/${crisisId}`),
          api.get(`/admin/crises/${crisisId}/history`).catch(() => ({ data: [] })),
          api.get(`/admin/crises/${crisisId}/notes`).catch(() => ({ data: [] })),
          api.get('/admin/responders').catch(() => ({ data: [] })),
          api.get(`/admin/crises/${crisisId}/resolutions`).catch(() => ({ data: [] })),
          api.get(`/admin/crises/${crisisId}/assignments`).catch(() => ({ data: [] })),
        ]);
        setCrisis(crisisRes.data);
        setTimeline(historyRes.data || []);
        setNotes(notesRes.data || []);
        setResponders(respondersRes.data || []);
        setResolutions(resolutionsRes.data || []);
        setAssignments(assignmentsRes.data || []);
        setNewStatus(crisisRes.data.status);
      } else {
        // Responder context using authorized responder endpoints
        const targetAssignId = assignmentId || crisisId;
        const [crisisRes, historyRes, notesRes, resolutionsRes] = await Promise.all([
          api.get(`/responder/assignments/${targetAssignId}/details`).catch(() => 
            api.get(`/public/crises/track/${crisisId}`)
          ),
          api.get(`/responder/assignments/${targetAssignId}/timeline`).catch(() => ({ data: [] })),
          api.get(`/responder/assignments/${targetAssignId}/notes`).catch(() => ({ data: [] })),
          api.get(`/responder/assignments/${targetAssignId}/resolutions`).catch(() => ({ data: [] })),
        ]);

        setCrisis(crisisRes.data);
        setTimeline(historyRes.data || []);
        setNotes(notesRes.data || []);
        setResolutions(resolutionsRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load incident details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedResponder) return;
    setAssigning(true);
    try {
      await api.post('/admin/assignments', {
        crisisId,
        responderId: Number(selectedResponder),
        instructions: assignInstructions,
      });
      setSelectedResponder('');
      setAssignInstructions('');
      await fetchCrisisDetails();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Assignment error', err);
      alert('Failed to assign responder.');
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === crisis?.status) return;
    setUpdatingStatus(true);
    try {
      await api.patch(`/admin/crises/${crisisId}`, {
        status: newStatus,
        adminNotes: statusNotes,
        invalidReason: newStatus === 'INVALID' ? (statusNotes.trim() || 'Dismissed by dispatcher') : undefined,
      });
      setStatusNotes('');
      await fetchCrisisDetails();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Status update error', err);
      alert('Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!progressNoteText.trim()) return;
    setSubmittingNote(true);
    try {
      const targetId = assignmentId || crisisId;
      await api.post(`/responder/assignments/${targetId}/notes`, {
        note: progressNoteText.trim(),
      });
      setProgressNoteText('');
      await fetchCrisisDetails();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to add note', err);
      alert('Failed to record progress note.');
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleAcceptAssignment = async () => {
    try {
      const targetId = assignmentId || crisisId;
      await api.post(`/responder/assignments/${targetId}/accept`);
      await fetchCrisisDetails();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error accepting assignment', err);
      alert('Failed to accept assignment.');
    }
  };

  const handleStartProgress = async () => {
    try {
      const targetId = assignmentId || crisisId;
      await api.patch(`/responder/assignments/${targetId}/status`, {
        status: 'IN_PROGRESS',
        notes: 'Responder arrived on scene.',
      });
      await fetchCrisisDetails();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error marking in progress', err);
      alert('Failed to update status.');
    }
  };

  const handleSubmitResolution = async (e) => {
    e.preventDefault();
    if (!actionsTaken.trim() || !resolutionSummary.trim()) {
      alert('Please fill out both actions taken and resolution summary.');
      return;
    }
    setSubmittingResolution(true);
    try {
      const targetId = assignmentId || crisisId;
      await api.post(`/responder/assignments/${targetId}/resolve`, {
        actionsTaken: actionsTaken.trim(),
        resolutionSummary: resolutionSummary.trim(),
        couldResolve,
        unableReason: !couldResolve ? unableReason.trim() : undefined,
      });
      setShowResolutionForm(false);
      await fetchCrisisDetails();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Resolution submission error', err);
      alert('Failed to submit resolution report.');
    } finally {
      setSubmittingResolution(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white border border-slate-300 rounded-md shadow-xl my-6 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-incident-title"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-100 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-white text-slate-800 font-bold border border-slate-300">
              {crisis?.publicId || `ID #${crisisId}`}
            </span>
            <span className="text-xs text-slate-600 font-medium">Official Incident Briefing</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            aria-label="Close incident modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-[#18392b] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Loading incident records...</span>
          </div>
        ) : !crisis ? (
          <div className="p-6 text-center text-red-800 text-xs">
            Unable to locate incident records in database.
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            
            {/* Title and Status Tags */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs text-slate-500 block mb-0.5">
                  Category: <strong className="text-slate-900 font-semibold">{crisis.categoryName}</strong>
                </span>
                <h1 id="modal-incident-title" className="text-xl font-bold text-[#0f172a]">
                  {crisis.title}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <SeverityBadge severity={crisis.severity} size="sm" />
                <StatusBadge status={crisis.status} size="sm" />
              </div>
            </div>

            {/* Location Coordinates & Reporter Dossier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-1 text-xs">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#18392b]" aria-hidden="true" />
                  <span>Campus Location Coordinates</span>
                </div>
                <div className="font-semibold text-slate-900">{crisis.location}</div>
                {(crisis.building || crisis.floor || crisis.room) && (
                  <div className="text-slate-600">
                    {[crisis.building, crisis.floor, crisis.room].filter(Boolean).join(' • ')}
                  </div>
                )}
                {crisis.locationDetails && (
                  <div className="text-slate-500 italic mt-1">"{crisis.locationDetails}"</div>
                )}
              </div>

              <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-1 text-xs">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-[#18392b]" aria-hidden="true" />
                  <span>Reporter Identification</span>
                </div>
                {crisis.reporterName ? (
                  <div className="text-slate-700">
                    <div className="font-semibold text-slate-900">{crisis.reporterName}</div>
                    {crisis.reporterEmail && <div>{crisis.reporterEmail}</div>}
                    {crisis.reporterPhone && <div>{crisis.reporterPhone}</div>}
                  </div>
                ) : (
                  <div className="text-emerald-800 font-medium">
                    ✓ Confidential Anonymous Report
                  </div>
                )}
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Received: {new Date(crisis.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Incident Narrative */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#18392b]" aria-hidden="true" />
                <span>Incident Description Narrative</span>
              </h2>
              <div className="p-3.5 rounded border border-slate-200 bg-white text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                {crisis.description}
              </div>
            </div>

            {/* ASSIGNED RESPONSE UNITS (Visible to Admin and Responders) */}
            {assignments.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#18392b]" aria-hidden="true" />
                  <span>Dispatched Units &amp; Assignment Status</span>
                </h2>
                <div className="border border-slate-200 rounded divide-y divide-slate-100 overflow-hidden">
                  {assignments.map((a, idx) => (
                    <div key={idx} className="p-3 bg-slate-50/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900">{a.responderName}</div>
                        {a.instructions && (
                          <div className="text-slate-600 text-[11px] mt-0.5">
                            Priority Instructions: <span className="font-medium text-slate-800">"{a.instructions}"</span>
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Assigned: {a.assignedAt ? new Date(a.assignedAt).toLocaleString() : 'N/A'}
                          {a.completedAt && ` • Completed: ${new Date(a.completedAt).toLocaleTimeString()}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                          a.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          a.status === 'IN_PROGRESS' || a.status === 'ARRIVED' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          a.status === 'ACCEPTED' || a.status === 'ON_THE_WAY' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {a.status}
                        </span>
                        {a.isActive && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FORMAL RESOLUTION REPORTS / CLEARANCE DOSSIERS (Reflected to Admin & Responders) */}
            {resolutions.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                  <span>On-Scene Resolution &amp; Clearance Reports</span>
                </h2>
                <div className="space-y-2">
                  {resolutions.map((r, idx) => (
                    <div key={idx} className="p-3.5 rounded border border-emerald-300 bg-emerald-50/40 text-xs space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-emerald-200/60 pb-2">
                        <div>
                          <span className="font-bold text-slate-900">{r.responderName}</span>
                          <span className="text-slate-500 text-[11px] ml-2 font-mono">
                            {r.resolvedAt ? new Date(r.resolvedAt).toLocaleString() : ''}
                          </span>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                          r.couldResolve 
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}>
                          {r.couldResolve ? '✓ Resolved On Scene' : '⚠ Escalation Required'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                          Actions Taken on Scene:
                        </div>
                        <p className="text-slate-700 bg-white/70 p-2 rounded border border-emerald-200/60 leading-relaxed">
                          {r.actionsTaken}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                          Resolution Summary &amp; Outcome:
                        </div>
                        <p className="text-slate-700 bg-white/70 p-2 rounded border border-emerald-200/60 leading-relaxed">
                          {r.resolutionSummary}
                        </p>
                      </div>

                      {!r.couldResolve && r.unableReason && (
                        <div className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-900 text-xs">
                          <strong>Escalation / Inability Justification:</strong> {r.unableReason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FIELD PROGRESS NOTES (Visible to Admin and Responders) */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#18392b]" aria-hidden="true" />
                <span>Field Progress Notes &amp; Observations ({notes.length})</span>
              </h2>

              {/* Add note input for responders */}
              {userRole === 'RESPONDER' && crisis.status !== 'RESOLVED' && crisis.status !== 'CLOSED' && (
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={progressNoteText}
                    onChange={(e) => setProgressNoteText(e.target.value)}
                    placeholder="Add field status or arrival observation..."
                    className="form-input text-xs py-1.5 flex-1"
                  />
                  <button
                    type="submit"
                    disabled={submittingNote || !progressNoteText.trim()}
                    className="btn btn-secondary text-xs py-1.5 px-3 font-semibold shrink-0"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post Note</span>
                  </button>
                </form>
              )}

              {notes.length > 0 ? (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {notes.map((n, idx) => (
                    <div key={idx} className="p-2.5 rounded border border-slate-200 bg-slate-50 text-xs">
                      <div className="flex justify-between text-slate-500 mb-0.5">
                        <span className="font-semibold text-slate-800">{n.responderName || 'Responder'}</span>
                        <span className="font-mono text-[10px]">{n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                      </div>
                      <p className="text-slate-700">{n.note}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-400 text-xs italic py-1">
                  No progress notes logged yet.
                </div>
              )}
            </div>

            {/* Timeline Audit History */}
            {timeline.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-[#18392b]" aria-hidden="true" />
                  <span>Operations Audit Timeline</span>
                </h2>
                <div className="border border-slate-200 rounded divide-y divide-slate-100 max-h-36 overflow-y-auto">
                  {timeline.map((item, idx) => (
                    <div key={idx} className="p-2.5 text-xs flex items-center justify-between bg-slate-50/50">
                      <div>
                        <span className="font-semibold text-slate-900">{item.changedBy || 'Dispatcher'}</span>{' '}
                        <span className="text-slate-500">updated status to</span>{' '}
                        <span className="font-semibold text-[#18392b]">{item.newStatus}</span>
                        {item.notes && <div className="text-slate-500 text-[11px] mt-0.5">"{item.notes}"</div>}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RESPONDER ACTIONS (Acknowledge, En-route, Resolve) */}
            {userRole === 'RESPONDER' && (
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#18392b]" aria-hidden="true" />
                  <span>Field Responder Quick Actions</span>
                </h2>

                <div className="flex flex-wrap items-center gap-2">
                  {crisis.status === 'ASSIGNED' && (
                    <button
                      type="button"
                      onClick={handleAcceptAssignment}
                      className="btn btn-forest text-xs py-1.5 px-3 font-bold"
                    >
                      Acknowledge &amp; En Route
                    </button>
                  )}

                  {['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY'].includes(crisis.status) && (
                    <button
                      type="button"
                      onClick={handleStartProgress}
                      className="btn btn-forest text-xs py-1.5 px-3 font-bold"
                    >
                      Mark On Scene
                    </button>
                  )}

                  {crisis.status !== 'RESOLVED' && crisis.status !== 'CLOSED' && (
                    <button
                      type="button"
                      onClick={() => setShowResolutionForm(!showResolutionForm)}
                      className="btn btn-emergency text-xs py-1.5 px-3 font-bold"
                    >
                      {showResolutionForm ? 'Cancel Resolution Report' : 'Complete Formal Incident Resolution'}
                    </button>
                  )}
                </div>

                {/* Formal Resolution Form */}
                {showResolutionForm && (
                  <form onSubmit={handleSubmitResolution} className="p-4 rounded border border-emerald-300 bg-emerald-50/50 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                      Formal Clearance Dossier
                    </h3>

                    <div>
                      <label htmlFor="modal-actions-taken" className="block text-xs font-semibold text-slate-800 mb-1">
                        Actions Taken on Scene <span className="text-red-700">*</span>
                      </label>
                      <textarea
                        id="modal-actions-taken"
                        rows={2}
                        value={actionsTaken}
                        onChange={(e) => setActionsTaken(e.target.value)}
                        placeholder="e.g. Cleared spill with neutralization agent; escorted injured student to SRM Hospital Casualty..."
                        className="form-input text-xs"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="modal-resolution-summary" className="block text-xs font-semibold text-slate-800 mb-1">
                        Resolution Summary &amp; Final Outcome <span className="text-red-700">*</span>
                      </label>
                      <textarea
                        id="modal-resolution-summary"
                        rows={2}
                        value={resolutionSummary}
                        onChange={(e) => setResolutionSummary(e.target.value)}
                        placeholder="e.g. Patient stabilized and transferred to emergency casualty; area secured."
                        className="form-input text-xs"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        id="modal-could-resolve"
                        type="checkbox"
                        checked={couldResolve}
                        onChange={(e) => setCouldResolve(e.target.checked)}
                        className="rounded border-slate-300 text-[#18392b]"
                      />
                      <label htmlFor="modal-could-resolve" className="text-xs font-semibold text-slate-800">
                        Incident successfully resolved on scene
                      </label>
                    </div>

                    {!couldResolve && (
                      <div>
                        <label htmlFor="modal-unable-reason" className="block text-xs font-semibold text-amber-900 mb-1">
                          Reason Unable to Resolve / Escalation Needed
                        </label>
                        <input
                          id="modal-unable-reason"
                          type="text"
                          value={unableReason}
                          onChange={(e) => setUnableReason(e.target.value)}
                          placeholder="e.g. Outside police or specialized hospital equipment required..."
                          className="form-input text-xs"
                          required
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submittingResolution}
                      className="btn btn-forest text-xs py-1.5 px-4 font-bold"
                    >
                      {submittingResolution ? 'Submitting...' : 'Transmit Resolution Report'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ADMIN DISPATCH CONTROLS */}
            {userRole === 'ADMIN' && (
              <div className="space-y-4 pt-3 border-t border-slate-200">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#18392b]" aria-hidden="true" />
                  <span>Dispatch Command Center Actions</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Assign Responder Unit */}
                  <form onSubmit={handleAssign} className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-2.5">
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <UserCheck className="w-3.5 h-3.5 text-[#18392b]" aria-hidden="true" />
                      <span>Allocate Responder</span>
                    </h3>

                    <div>
                      <select
                        aria-label="Select responder unit"
                        value={selectedResponder}
                        onChange={(e) => setSelectedResponder(e.target.value ? Number(e.target.value) : '')}
                        className="form-input text-xs py-1.5"
                      >
                        <option value="">Select On-Duty Responder Unit...</option>
                        {responders.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.fullName} ({r.department}) — {r.availability || 'AVAILABLE'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={assignInstructions}
                        onChange={(e) => setAssignInstructions(e.target.value)}
                        placeholder="Priority instructions for responder..."
                        className="form-input text-xs py-1.5"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={assigning || !selectedResponder}
                      className="btn btn-forest w-full text-xs py-1.5 font-bold"
                    >
                      {assigning ? 'Allocating...' : 'Dispatch Unit'}
                    </button>
                  </form>

                  {/* Status Override */}
                  <div className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-2.5">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Override Operational Status
                    </h3>

                    <div>
                      <select
                        aria-label="Select status"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="form-input text-xs py-1.5"
                      >
                        <option value="SUBMITTED">SUBMITTED</option>
                        <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                        <option value="ASSIGNED">ASSIGNED</option>
                        <option value="ACCEPTED">ACCEPTED</option>
                        <option value="ON_THE_WAY">ON_THE_WAY</option>
                        <option value="ARRIVED">ARRIVED</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED (Frees Responders)</option>
                        <option value="CLOSED">CLOSED (Frees Responders)</option>
                        <option value="INVALID">DISMISSED / INVALID (Frees Responders)</option>
                      </select>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={statusNotes}
                        onChange={(e) => setStatusNotes(e.target.value)}
                        placeholder="Status change justification note..."
                        className="form-input text-xs py-1.5"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleStatusUpdate}
                      disabled={updatingStatus || newStatus === crisis.status}
                      className="btn btn-secondary w-full text-xs py-1.5 font-semibold"
                    >
                      {updatingStatus ? 'Updating...' : 'Commit Status Change'}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};
