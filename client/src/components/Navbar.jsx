import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Shield, 
  Phone, 
  Search, 
  LayoutDashboard, 
  LogOut, 
  LogIn, 
  Menu, 
  X,
  AlertCircle,
  UserCheck
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* Top emergency dispatch announcement banner */}
      <div className="bg-[#991b1b] text-white text-xs font-semibold px-4 py-2 border-b border-red-900">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white shrink-0" />
            <span className="tracking-wide uppercase text-[11px]">SRM KTR Emergency 24/7</span>
            <span className="hidden sm:inline text-red-100 font-normal">
              — National Emergency: <strong>112</strong> | Police: <strong>100</strong> | Ambulance: <strong>108</strong>
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <a 
              href="tel:04427452270" 
              className="flex items-center gap-1.5 text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-1"
            >
              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Campus Security: 044-2745 2270</span>
            </a>
            <a 
              href="tel:04447432345" 
              className="hidden lg:flex items-center gap-1.5 text-emerald-100 hover:text-white hover:underline"
            >
              <span>SRM Hospital Emergency: 044-4743 2345</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Institutional Header */}
      <div className="bg-[#18392b] border-b border-[#0f251c] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* University / System Brand */}
            <Link 
              to={user ? (user.role === 'ADMIN' ? '/admin' : '/responder') : '/'} 
              className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md p-1"
              aria-label="CrisisConnect SRM KTR Safety Home"
            >
              <div className="w-9 h-9 rounded-md bg-[#2d6a4f] border border-[#3b8764] flex items-center justify-center text-white shrink-0">
                <Shield className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-white tracking-tight">CrisisConnect</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#24523d] text-[#bbf7d0] border border-[#2d6a4f] hidden sm:inline-block">
                    SRM KTR Campus
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200 hidden sm:block">SRM Institute of Science and Technology • Public Safety &amp; Emergency Operations</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
              {!user ? (
                <>
                  <Link
                    to="/"
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-colors ${
                      isActive('/') 
                        ? 'text-white bg-[#22543d]' 
                        : 'text-emerald-100 hover:text-white hover:bg-[#22543d]/60'
                    }`}
                  >
                    Overview
                  </Link>

                  <Link
                    to="/report"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-[#991b1b] text-white hover:bg-[#7f1d1d] transition-colors border border-red-800 shadow-sm"
                  >
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Report Incident</span>
                  </Link>

                  <Link
                    to="/track"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-colors ${
                      isActive('/track') 
                        ? 'text-white bg-[#22543d]' 
                        : 'text-emerald-100 hover:text-white hover:bg-[#22543d]/60'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Track Status</span>
                  </Link>

                  <Link
                    to="/contacts"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-colors ${
                      isActive('/contacts') 
                        ? 'text-white bg-[#22543d]' 
                        : 'text-emerald-100 hover:text-white hover:bg-[#22543d]/60'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Directory</span>
                  </Link>
                </>
              ) : (
                <>
                  {user.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors border ${
                        isActive('/admin') 
                          ? 'bg-amber-100 text-amber-950 border-amber-300' 
                          : 'text-amber-200 border-amber-400/40 hover:bg-amber-400/10'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Command Center</span>
                    </Link>
                  )}

                  {user.role === 'RESPONDER' && (
                    <Link
                      to="/responder"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors border ${
                        isActive('/responder') 
                          ? 'bg-blue-100 text-blue-950 border-blue-300' 
                          : 'text-blue-200 border-blue-400/40 hover:bg-blue-400/10'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Responder Docket</span>
                    </Link>
                  )}

                  <Link
                    to="/report"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-[#991b1b] text-white hover:bg-[#7f1d1d] transition-colors border border-red-800 shadow-sm"
                  >
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Report Incident</span>
                  </Link>

                  <Link
                    to="/contacts"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-colors ${
                      isActive('/contacts') 
                        ? 'text-white bg-[#22543d]' 
                        : 'text-emerald-100 hover:text-white hover:bg-[#22543d]/60'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Directory</span>
                  </Link>
                </>
              )}
            </nav>

            {/* User Session Info & Action */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3 pl-3 border-l border-[#2d6a4f]">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-white">{user.fullName}</div>
                    <div className="text-[10px] text-emerald-300 uppercase tracking-wider">
                      {user.role} • {user.department || 'Staff'}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-md text-emerald-200 hover:text-white hover:bg-[#22543d] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    title="Sign out of system"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-emerald-100 border border-emerald-300/30 hover:bg-[#22543d] hover:text-white transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Staff Portal</span>
                </Link>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-white hover:bg-[#22543d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#2d6a4f] bg-[#143024] px-4 pt-3 pb-5 space-y-2">
            {!user ? (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-semibold text-emerald-100 hover:bg-[#22543d]"
                >
                  Overview
                </Link>

                <Link
                  to="/report"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold bg-[#991b1b] text-white"
                >
                  <AlertCircle className="w-4 h-4" />
                  Report Incident
                </Link>

                <Link
                  to="/track"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold text-emerald-100 hover:bg-[#22543d]"
                >
                  <Search className="w-4 h-4" />
                  Track Status
                </Link>

                <Link
                  to="/contacts"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold text-emerald-100 hover:bg-[#22543d]"
                >
                  <Phone className="w-4 h-4" />
                  Emergency Directory
                </Link>
              </>
            ) : (
              <>
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold text-amber-200 bg-amber-950/40 border border-amber-700"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Command Center
                  </Link>
                )}

                {user.role === 'RESPONDER' && (
                  <Link
                    to="/responder"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold text-blue-200 bg-blue-950/40 border border-blue-700"
                  >
                    <UserCheck className="w-4 h-4" />
                    Responder Docket
                  </Link>
                )}

                <Link
                  to="/report"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold bg-[#991b1b] text-white"
                >
                  <AlertCircle className="w-4 h-4" />
                  Report Incident
                </Link>

                <Link
                  to="/contacts"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold text-emerald-100 hover:bg-[#22543d]"
                >
                  <Phone className="w-4 h-4" />
                  Emergency Directory
                </Link>
              </>
            )}

            <div className="pt-3 border-t border-[#2d6a4f]">
              {user ? (
                <div className="flex items-center justify-between px-3 py-2 bg-[#0f251c] rounded-md">
                  <div>
                    <div className="text-xs font-semibold text-white">{user.fullName}</div>
                    <div className="text-[10px] text-emerald-300 uppercase">{user.role}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-[#22543d] text-white hover:bg-[#2d6a4f]"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-white bg-[#22543d]"
                >
                  <LogIn className="w-4 h-4" />
                  Staff Portal Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
