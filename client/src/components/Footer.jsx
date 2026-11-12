import React from 'react';
import { Shield, Phone, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#1e293b] text-slate-300 border-t border-slate-700 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Institutional Department Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-6 h-6 rounded bg-[#2d6a4f] flex items-center justify-center text-white">
                <Shield className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <span>SRM KTR CrisisConnect</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              SRM Institute of Science and Technology, Kattankulathur Campus (SRM KTR). Directorate of Campus Safety, Student Affairs &amp; SRM Hospital Emergency Operations.
            </p>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>SRM KTR Dispatch Status: 24x7 Active</span>
            </div>
            <div className="text-[11px] text-slate-400">
              SRM Nagar, Kattankulathur - 603 203, Chengalpattu Dist., Tamil Nadu
            </div>
          </div>

          {/* Critical Emergency Contacts */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              Emergency Numbers
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li className="flex justify-between items-center py-1 border-b border-slate-700/60">
                <span className="text-slate-300">National Emergency (All-in-One)</span>
                <a href="tel:112" className="text-red-400 font-bold hover:underline">
                  112
                </a>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-700/60">
                <span className="text-slate-300">SRM Hospital Emergency (24/7)</span>
                <a href="tel:04447432345" className="text-white hover:underline">
                  044-4743 2345
                </a>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-700/60">
                <span className="text-slate-300">SRM Security Control Room</span>
                <a href="tel:04427452270" className="text-emerald-400 font-semibold hover:underline">
                  044-2745 2270
                </a>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-700/60">
                <span className="text-slate-300">Ambulance (Tamil Nadu EMS)</span>
                <a href="tel:108" className="text-amber-300 font-semibold hover:underline">
                  108
                </a>
              </li>
              <li className="flex justify-between items-center py-1">
                <span className="text-slate-300">Women Helpline / Anti-Ragging</span>
                <a href="tel:1091" className="text-white hover:underline">
                  1091 / 1800-180-5522
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Navigation */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              Portal Directory
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <Link to="/report" className="hover:text-white transition-colors">
                  Submit Incident Report
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition-colors">
                  Track Existing Incident by Code
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="hover:text-white transition-colors">
                  SRM KTR Campus Emergency Directory
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Authorized Staff &amp; Responder Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and Life-Safety Notice */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              Life Safety Protocol
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed bg-slate-800/80 p-3 rounded border border-slate-700">
              For active fires, severe medical shock, or immediate violence, dial <strong>112</strong> (or <strong>108</strong> / <strong>044-4743 2345</strong> for SRM Hospital Ambulance) immediately before filing an electronic report.
            </p>
            <p className="text-[11px] text-slate-500">
              UGC Anti-Ragging &amp; AICTE Campus Safety Compliant Portal.
            </p>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div>
            &copy; {new Date().getFullYear()} SRM Institute of Science and Technology (SRM IST, Kattankulathur). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Confidential Campus Reporting</span>
            <span>SRM KTR EOC v2.5</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
