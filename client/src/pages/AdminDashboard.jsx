import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { SeverityBadge, StatusBadge } from '../components/Badges';
import { CrisisDetailModal } from '../components/CrisisDetailModal';
import { 
  Shield, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Search, 
  Filter, 
  RefreshCw,
  Eye,
  List,
  BarChart2,
  Layers,
  Phone
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('INCIDENTS');
  const [stats, setStats] = useState(null);
  const [crises, setCrises] = useState([]);
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected incident for detail inspection
  const [selectedCrisisId, setSelectedCrisisId] = useState(null);

  const fetchDashboardData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [statsRes, crisesRes, respondersRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/crises?page=0&size=50'),
        api.get('/admin/responders'),
      ]);

      setStats(statsRes.data);
      setCrises(crisesRes.data?.content || crisesRes.data || []);
      setResponders(respondersRes.data || []);
    } catch (err) {
      console.error('Failed to load admin operations data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickReview = async (id) => {
    try {
      await api.patch(`/admin/crises/${id}`, {
        status: 'UNDER_REVIEW',
        adminNotes: 'Incident acknowledged and placed under review by Dispatch Commander.',
      });
      fetchDashboardData(true);
    } catch (err) {
      console.error('Quick review error', err);
    }
  };

  const filteredCrises = crises.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.publicId.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.categoryName.toLowerCase().includes(search.toLowerCase());

    const matchesSeverity = severityFilter === 'ALL' || c.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Restrained institutional color palette for Recharts
  const CHART_COLORS = ['#18392b', '#1e3a8a', '#b45309', '#991b1b', '#475569', '#0d9488'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Operations Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#18392b] mb-1">
            <Shield className="w-4 h-4 text-[#18392b]" aria-hidden="true" />
            <span>SRM KTR Incident Command Center (EOC) • Kattankulathur</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a]">
            Emergency Dispatch &amp; Operations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kattankulathur Campus real-time incident queue, responder allocation, and campus safety telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="btn btn-secondary text-xs py-1.5 px-3 font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Operations Data</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Strip (Database-Backed) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          {
            label: 'Total Incidents',
            value: stats?.totalCrises ?? crises.length,
            note: 'All time intake',
            color: 'text-slate-900',
            bg: 'bg-white',
          },
          {
            label: 'Critical Priority',
            value: stats?.criticalCrises ?? crises.filter((c) => c.severity === 'CRITICAL').length,
            note: 'Immediate risk',
            color: 'text-red-900',
            bg: 'bg-red-50/60 border-red-200',
          },
          {
            label: 'Unassigned Queue',
            value: stats?.unassignedCrises ?? crises.filter((c) => c.status === 'SUBMITTED').length,
            note: 'Needs unit dispatch',
            color: 'text-amber-900',
            bg: 'bg-amber-50/60 border-amber-200',
          },
          {
            label: 'Active on Scene',
            value: stats?.activeCrises ?? crises.filter((c) => ['IN_PROGRESS', 'ASSIGNED', 'ACCEPTED'].includes(c.status)).length,
            note: 'Units deployed',
            color: 'text-[#18392b]',
            bg: 'bg-emerald-50/60 border-emerald-200',
          },
          {
            label: 'Resolved & Closed',
            value: stats?.resolvedCrises ?? crises.filter((c) => ['RESOLVED', 'CLOSED'].includes(c.status)).length,
            note: 'Incidents secured',
            color: 'text-slate-800',
            bg: 'bg-white',
          },
          {
            label: 'Avg Response Time',
            value: stats ? `${stats.avgResponseTimeMinutes || 3} min` : '3 min',
            note: 'Target: < 5 min',
            color: 'text-slate-900',
            bg: 'bg-white',
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded border border-slate-200 ${kpi.bg} flex flex-col justify-between`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {kpi.label}
            </div>
            <div className={`text-2xl font-black ${kpi.color} mt-1`}>
              {kpi.value}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {kpi.note}
            </div>
          </div>
        ))}
      </div>

      {/* Institutional Tab Strip */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('INCIDENTS')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 text-xs font-bold transition-colors ${
            activeTab === 'INCIDENTS'
              ? 'border-[#18392b] text-[#18392b] bg-emerald-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <List className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Incident Queue ({filteredCrises.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ANALYTICS')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 text-xs font-bold transition-colors ${
            activeTab === 'ANALYTICS'
              ? 'border-[#18392b] text-[#18392b] bg-emerald-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Telemetry &amp; Trends</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('RESPONDERS')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 text-xs font-bold transition-colors ${
            activeTab === 'RESPONDERS'
              ? 'border-[#18392b] text-[#18392b] bg-emerald-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Responder Roster ({responders.length})</span>
        </button>
      </div>

      {/* TAB 1: INCIDENT QUEUE */}
      {activeTab === 'INCIDENTS' && (
        <div className="space-y-3">
          {/* Filter Bar */}
          <div className="inst-card p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <label htmlFor="filter-search" className="sr-only">Search incidents</label>
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <input
                id="filter-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reference code, building, description..."
                className="form-input text-xs pl-8 py-1.5"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                aria-label="Filter by severity"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="form-input text-xs py-1.5 px-2.5 w-auto"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              <select
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input text-xs py-1.5 px-2.5 w-auto"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
                <option value="INVALID">Dismissed</option>
              </select>
            </div>
          </div>

          {/* Incident Queue Table */}
          <div className="inst-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Ref Code</th>
                    <th className="py-2.5 px-4">Incident Headline</th>
                    <th className="py-2.5 px-4">Classification</th>
                    <th className="py-2.5 px-4">Severity</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Location</th>
                    <th className="py-2.5 px-4">Logged Time</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCrises.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        No incident records found matching current criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredCrises.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {c.publicId}
                        </td>

                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-semibold text-[#0f172a] truncate">{c.title}</div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {c.description}
                          </div>
                        </td>

                        <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                          {c.categoryName}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <SeverityBadge severity={c.severity} size="sm" />
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <StatusBadge status={c.status} size="sm" />
                        </td>

                        <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                          <div className="font-medium">{c.location}</div>
                          {c.building && (
                            <div className="text-[10px] text-slate-500">{c.building}</div>
                          )}
                        </td>

                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap text-[11px] font-mono">
                          {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {c.status === 'SUBMITTED' && (
                              <button
                                type="button"
                                onClick={() => handleQuickReview(c.id)}
                                className="btn btn-subtle text-xs py-1 px-2 font-semibold text-[#18392b]"
                                title="Acknowledge and mark Under Review"
                              >
                                Triage
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setSelectedCrisisId(c.id)}
                              className="btn btn-secondary text-xs py-1 px-2.5 font-semibold"
                              title="Inspect Full Incident Dossier"
                            >
                              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>View Dossier</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANALYTICS & TELEMETRY */}
      {activeTab === 'ANALYTICS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="inst-card p-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Incidents by Emergency Category
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.byCategory || []}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '4px', fontSize: '11px' }}
                  />
                  <Bar dataKey="count" fill="#18392b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="inst-card p-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Severity Distribution
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.bySeverity || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    dataKey="count"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    fontSize={10}
                  >
                    {(stats?.bySeverity || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '4px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RESPONDER FLEET ROSTER */}
      {activeTab === 'RESPONDERS' && (
        <div className="inst-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Responder Name</th>
                  <th className="py-2.5 px-4">Department &amp; Unit</th>
                  <th className="py-2.5 px-4">Specialization</th>
                  <th className="py-2.5 px-4">Contact Extension</th>
                  <th className="py-2.5 px-4">Duty Status</th>
                  <th className="py-2.5 px-4">Active Assigned Case(s)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {responders.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {r.fullName}
                    </td>

                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                      {r.department || 'Campus Public Safety'}
                    </td>

                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {r.specialization || 'First Responder'}
                    </td>

                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap font-mono">
                      {r.phone || r.email}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        r.availability === 'AVAILABLE'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : r.availability === 'ON_SCENE' || r.availability === 'BUSY'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          r.availability === 'AVAILABLE' ? 'bg-emerald-600' : 'bg-amber-600'
                        }`} />
                        {r.availability || 'AVAILABLE'}
                      </span>
                    </td>

                    <td className="py-3 px-4 min-w-[320px]">
                      {r.assignedCases && r.assignedCases.length > 0 ? (
                        <div className="space-y-1.5">
                          {r.assignedCases.map((c) => (
                            <button
                              key={c.crisisId}
                              type="button"
                              onClick={() => setSelectedCrisisId(c.crisisId)}
                              className="w-full text-left p-2.5 rounded bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 shadow-xs transition-colors group cursor-pointer"
                              title="Click to inspect incident in Command Center"
                            >
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="font-mono font-bold text-slate-900 group-hover:text-[#18392b] text-xs">
                                  {c.publicId}
                                </span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${
                                  c.severity === 'CRITICAL'
                                    ? 'bg-red-100 text-red-800 border-red-300'
                                    : c.severity === 'HIGH'
                                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                                    : 'bg-blue-100 text-blue-800 border-blue-300'
                                }`}>
                                  {c.severity}
                                </span>
                              </div>
                              <div className="text-xs font-semibold text-slate-900 group-hover:text-[#18392b] line-clamp-1 mt-0.5">
                                {c.title}
                              </div>
                              <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500 mt-1">
                                <span className="truncate">📍 {c.location || c.building || 'Campus'}</span>
                                <span className="font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                                  Mission: {c.assignmentStatus}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs py-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          <span>Standing by • No active case assigned</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Incident Detail & Dispatch Modal */}
      {selectedCrisisId && (
        <CrisisDetailModal
          crisisId={selectedCrisisId}
          onClose={() => setSelectedCrisisId(null)}
          onRefresh={() => fetchDashboardData(true)}
          userRole="ADMIN"
        />
      )}

    </div>
  );
};
