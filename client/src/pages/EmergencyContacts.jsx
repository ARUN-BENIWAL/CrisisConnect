import React, { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Copy, 
  Check, 
  Search 
} from 'lucide-react';

const CONTACTS = [
  {
    name: 'SRM KTR Campus Security Control Room & CSO',
    department: 'Directorate of Campus Public Safety',
    category: 'Police',
    phone: '044-2745 2270',
    altPhone: '044-2741 7777 / Ext. 2270',
    location: 'Main Security Post, University Arch, Kattankulathur',
    hours: '24 Hours / 7 Days / 365 Days',
    desc: 'Immediate emergency dispatch, 24/7 motorized campus patrol, perimeter containment, incident coordination, and visitor safety.',
    emergency: true,
  },
  {
    name: 'SRM Medical College Hospital & Research Centre — 24/7 Casualty',
    department: 'Emergency & Critical Care Medicine',
    category: 'Medical',
    phone: '044-4743 2345',
    altPhone: '044-4743 2444 / 044-2745 4700',
    location: 'SRM Hospital Complex, GST Road, Kattankulathur',
    hours: '24x7 Emergency Casualty & Trauma Ward',
    desc: 'Acute medical triage, polytrauma resuscitation, cardiac shock, poison control, intensive critical care unit, and 24/7 doctor on duty.',
    emergency: true,
  },
  {
    name: 'SRM Campus 24/7 Ambulance Fleet (Quick Response)',
    department: 'SRM Hospital Emergency Medical Services',
    category: 'Medical',
    phone: '044-4743 2444',
    altPhone: '+91 99400 96012',
    location: 'Stationed at Hospital Casualty & University Building Portico',
    hours: '24/7 Rapid Inter-Campus Response',
    desc: 'Dedicated on-campus ambulances for urgent pickup from hostels, classrooms, Tech Park, and sports complex to SRM Hospital.',
    emergency: true,
  },
  {
    name: 'National Emergency Response Support System (ERSS)',
    department: 'Ministry of Home Affairs & Tamil Nadu Police',
    category: 'Police',
    phone: '112',
    altPhone: 'Police: 100 | Fire: 101 | Ambulance: 108',
    location: 'National Command Center / Chengalpattu District Control',
    hours: '24 Hours / Nationwide Unified Lifeline',
    desc: 'Single unified emergency helpline for all life-safety emergencies across India with real-time GPS coordinate location tracking.',
    emergency: true,
  },
  {
    name: 'UGC National Anti-Ragging Helpline & SRM Anti-Ragging Cell',
    department: 'Directorate of Student Affairs, SRM IST',
    category: 'Safety',
    phone: '1800-180-5522',
    altPhone: 'SRM Cell: 044-2745 6730 / 044-2741 7100',
    location: 'Student Affairs Office, 3rd Floor, University Building (UB)',
    hours: '24 Hours Toll-Free & Confidential',
    desc: 'Strict zero-tolerance anti-ragging cell, anonymous grievances, harassment investigations, and immediate student welfare protection.',
    emergency: true,
  },
  {
    name: 'Tamil Nadu Women Helpline / Crime Against Women',
    department: 'Tamil Nadu Police & Social Welfare Department',
    category: 'Safety',
    phone: '1091',
    altPhone: 'State Women Helpline: 181',
    location: 'Tamil Nadu State Police Women Protection Wing',
    hours: '24/7 Toll-Free Rapid Protection',
    desc: 'Dedicated emergency defense for women students, anti-eve teasing response squad, cyber harassment prevention, and crisis counseling.',
    emergency: true,
  },
  {
    name: 'SRM Student Health & Tele-MANAS Counseling Centre',
    department: 'Health, Wellness & Psychological Services',
    category: 'Mental Health',
    phone: '044-2741 7800',
    altPhone: 'National Tele-MANAS: 14416 / 1800-891-4416',
    location: 'Health Centre, University Building Ground Floor',
    hours: '24/7 Confidential Crisis Helpline',
    desc: 'Immediate psychological crisis de-escalation, suicide prevention hotline, depression intervention, and academic stress tele-counseling.',
    emergency: true,
  },
  {
    name: 'SRM Hostel Management (Gents & Ladies Hostels Desk)',
    department: 'SRM Hostel Administration',
    category: 'Safety',
    phone: '044-2745 3159',
    altPhone: 'Ladies Hostels: 044-2745 3156 / 044-2741 7300',
    location: 'Hostel Administrative Office, Near Paari / Kaari Blocks',
    hours: '24/7 Chief Warden Desk & Resident Doctors',
    desc: 'Hostel emergency response, night health transport, resident safety checks, Paari, Kaari, Oori, Adhiyaman, M Block & Begum Rokeya.',
    emergency: false,
  },
  {
    name: 'Local Police Jurisdiction — Maraimalai Nagar & Guduvanchery PS',
    department: 'Chengalpattu District Police',
    category: 'Police',
    phone: '044-2745 2333',
    altPhone: 'Guduvanchery PS: 044-2746 4100',
    location: 'GST Road, Maraimalai Nagar / Guduvanchery',
    hours: '24/7 Station Duty Officer',
    desc: 'Jurisdictional Tamil Nadu state police stations for SRM KTR campus, GST Road perimeter, legal complaints, and incident investigations.',
    emergency: false,
  },
  {
    name: 'Chengalpattu District Fire & Rescue Station',
    department: 'Tamil Nadu Fire and Rescue Services (TNFRS)',
    category: 'Safety',
    phone: '044-2742 2101',
    altPhone: 'Fire Control: 101',
    location: 'District Fire Station, Chengalpattu',
    hours: '24/7 Fire & Emergency Dispatch',
    desc: 'Municipal fire tenders, chemical laboratory blaze containment, industrial fire extinguishing, and water-rescue operations.',
    emergency: true,
  },
  {
    name: 'SRM KTR Electrical & Facilities Breakdown Emergency',
    department: 'Campus Civil & Electrical Maintenance',
    category: 'Facilities',
    phone: '044-2745 3903',
    altPhone: '044-2741 7200',
    location: 'Central Power Substation Complex, Kattankulathur',
    hours: '24/7 On-Duty Electrical Engineers',
    desc: 'Elevator passenger entrapment, campus blackout recovery, high-tension electrical hazards, water pipeline bursts, and lab safety.',
    emergency: false,
  },
  {
    name: 'National Cyber Crime Reporting Helpline',
    department: 'Ministry of Home Affairs, Govt. of India',
    category: 'Safety',
    phone: '1930',
    altPhone: 'cybercrime.gov.in',
    location: 'National Cyber Crime Coordination Centre (I4C)',
    hours: '24/7 National Emergency Hotline',
    desc: 'Immediate reporting of online financial scams, identity theft, student cyberbullying, unauthorized image dissemination, and blackmail.',
    emergency: false,
  },
];

export const EmergencyContacts = () => {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [copiedPhone, setCopiedPhone] = useState(null);

  const copyNumber = (phone) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const filtered = CONTACTS.filter((c) => {
    const matchesFilter = filter === 'ALL' || c.category === filter;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.department.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
            SRM KTR Campus Directory
          </span>
          <span className="text-xs text-slate-500">• Kattankulathur, Chengalpattu Dist.</span>
        </div>
        <h1 className="text-2xl font-bold text-[#0f172a]">
          SRM KTR &amp; National Emergency Helplines
        </h1>
        <p className="text-xs text-slate-500">
          Official contact directory for SRM Institute of Science and Technology campus security, SRM Hospital Casualty, and Indian national crisis lifelines.
        </p>
      </div>

      {/* Primary Emergency Lifeline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* National 112 */}
        <div className="p-4 rounded border border-red-300 bg-red-50/70 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-red-900 tracking-wider">National Emergency (India)</div>
            <div className="text-2xl font-black text-red-950 font-mono mt-0.5">112</div>
            <p className="text-[11px] text-red-800 mt-0.5">All-in-One: Police, Fire, Ambulance</p>
          </div>
          <a
            href="tel:112"
            className="btn btn-emergency text-xs font-bold py-1.5 px-3"
          >
            Dial 112
          </a>
        </div>

        {/* SRM Hospital 24/7 Casualty */}
        <div className="p-4 rounded border border-emerald-300 bg-emerald-50/70 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-900 tracking-wider">SRM Hospital Emergency (24/7)</div>
            <div className="text-xl font-black text-emerald-950 font-mono mt-0.5">044-4743 2345</div>
            <p className="text-[11px] text-emerald-800 mt-0.5">On-Campus Trauma &amp; ICU Casualty</p>
          </div>
          <a
            href="tel:04447432345"
            className="btn btn-forest text-xs font-bold py-1.5 px-3"
          >
            Call Hospital
          </a>
        </div>

        {/* SRM KTR Security Control */}
        <div className="p-4 rounded border border-slate-300 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-700 tracking-wider">SRM Security Control Desk</div>
            <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">044-2745 2270</div>
            <p className="text-[11px] text-slate-600 mt-0.5">Main Arch 24/7 Patrol Dispatch</p>
          </div>
          <a
            href="tel:04427452270"
            className="btn btn-secondary text-xs font-bold py-1.5 px-3"
          >
            Call Security
          </a>
        </div>
      </div>

      {/* Directory Filter Bar */}
      <div className="inst-card p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'Police', 'Medical', 'Mental Health', 'Safety', 'Facilities'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                filter === cat
                  ? 'bg-[#18392b] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Divisions' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <label htmlFor="search-contacts" className="sr-only">Search contacts</label>
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <input
            id="search-contacts"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search department or extension..."
            className="form-input text-xs pl-8 py-1.5"
          />
        </div>
      </div>

      {/* Contacts Table */}
      <div className="inst-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Department / Service</th>
                <th className="py-2.5 px-4">Contact Numbers</th>
                <th className="py-2.5 px-4">Campus Location &amp; Hours</th>
                <th className="py-2.5 px-4">Service Description</th>
                <th className="py-2.5 px-4 text-right">Quick Dial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-bold text-[#0f172a]">{c.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{c.department}</div>
                    {c.emergency && (
                      <span className="inline-block mt-1 text-[10px] font-bold text-red-800 bg-red-100 px-1.5 py-0.2 rounded border border-red-200 uppercase">
                        24/7 Emergency Line
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-slate-900">{c.phone}</div>
                    {c.altPhone && <div className="text-[11px] text-slate-500 font-mono">{c.altPhone}</div>}
                  </td>

                  <td className="py-3 px-4 text-slate-700 max-w-xs">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
                      <span>{c.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
                      <span>{c.hours}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-600 max-w-md">
                    {c.desc}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`tel:${c.phone.replace(/[^0-9]/g, '')}`}
                        className="btn btn-subtle text-xs py-1 px-2.5 text-[#18392b] font-semibold"
                        title={`Call ${c.name}`}
                      >
                        <Phone className="w-3 h-3" aria-hidden="true" />
                        <span>Call</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => copyNumber(c.phone)}
                        className="btn btn-secondary text-xs p-1"
                        title="Copy phone number"
                        aria-label={`Copy phone number for ${c.name}`}
                      >
                        {copiedPhone === c.phone ? (
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
