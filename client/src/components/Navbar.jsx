import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Search,
  LogIn,
  User,
  ShieldCheck,
  LogOut,
  Phone,
  Mail,
  CheckCircle,
  Sparkles,
  MapPin,
  ExternalLink,
  Sun,
  Moon,
} from 'lucide-react';
import { searchTouristDestinations } from '../data/indiaWebPlaces';
import GoogleTranslateWidget from './GoogleTranslateWidget';

export default function Navbar({
  searchQuery,
  setSearchQuery,
  placesList = [],
  onSelectPlace,
  onLoginClick,
  currentAdmin,
  currentUser,
  activeView,
  setActiveView,
  onAdminLogout,
  onUserLogout,
  onGenerateLivePlace,
  isGeneratingAi = false,
  theme = 'dark',
  onToggleTheme
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // If regular user/visitor, only allow searching published places (isPublished !== false)
  // If admin, allow searching all places
  const accessiblePlaces = currentAdmin
    ? placesList
    : placesList.filter((p) => p.isPublished !== false);

  // Compute live search suggestions based on spelling/prefix/fuzzy matching
  const suggestions = searchTouristDestinations(searchQuery, accessiblePlaces).slice(0, 6);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectSuggestion = (place) => {
    setSearchQuery(place.name);
    setIsDropdownOpen(false);
    if (activeView !== 'home' && setActiveView) {
      setActiveView('home');
    }
    if (onSelectPlace) {
      onSelectPlace(place);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (suggestions.length > 0) {
        handleSelectSuggestion(suggestions[0]);
      } else if (searchQuery.trim().length >= 2 && onGenerateLivePlace) {
        onGenerateLivePlace(searchQuery.trim());
        setIsDropdownOpen(false);
      }
    }
  };


  return (
    <nav className={`fixed top-0 left-0 w-full z-50 backdrop-blur-lg border-b transition-colors duration-300 ${
      theme === 'light'
        ? 'bg-white/90 border-slate-200 shadow-sm'
        : 'bg-slate-950/85 border-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left Section: Team Pheonix Brand Logo */}
        <div className="flex items-center gap-3">
          {/* Logo Section with India Emblem / Tiranga Chakra */}
          <div
            onClick={() => setActiveView && setActiveView('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl p-[2px] bg-gradient-to-b from-[#FF9933] via-white to-[#138808] shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center relative overflow-hidden transition-colors ${
                theme === 'light' ? 'bg-white' : 'bg-slate-950'
              }`}>
                {/* Ashoka Chakra vector */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-7 h-7 text-blue-600 animate-spin-slow"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="3" />
                  <circle cx="50" cy="50" r="8" fill="currentColor" />
                  {Array.from({ length: 24 }).map((_, i) => {
                    const angle = (i * 360) / 24;
                    return (
                      <line
                        key={i}
                        x1="50"
                        y1="50"
                        x2={50 + 40 * Math.cos((angle * Math.PI) / 180)}
                        y2={50 + 40 * Math.sin((angle * Math.PI) / 180)}
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
            <div>
              <span className={`text-xl font-black tracking-tight flex items-center gap-1 ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                Team<span className="text-amber-500">Pheonix</span>
              </span>
              <p className={`text-[10px] tracking-widest uppercase font-medium ${
                theme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Incredible India Tourism
              </p>
            </div>
          </div>
        </div>

        {/* Center Search Bar with Auto-Suggestions: Only visible when logged in (User or Admin) */}
        {(currentUser || currentAdmin) && (
          <div className="relative w-80 lg:w-[420px]" ref={searchContainerRef}>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-amber-400" />
              <input
                type="text"
                placeholder="Search 'trimbkeshwar', 'tri', 'raigad', 'taj'..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                onKeyDown={handleKeyDown}
                className="w-full bg-slate-900/90 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-400 rounded-full pl-9 pr-8 py-2.5 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsDropdownOpen(false);
                  }}
                  className="absolute right-3 text-slate-400 hover:text-white text-xs w-4 h-4 rounded-full flex items-center justify-center bg-slate-800"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Auto-suggest dropdown modal */}
            {isDropdownOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 px-3">
                  <span className="font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Matching Tourist Places
                  </span>
                  <span>{suggestions.length} places found</span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                  {suggestions.length > 0 ? (
                    suggestions.map((item) => (
                      <div
                        key={item.id || item._id}
                        onClick={() => handleSelectSuggestion(item)}
                        className="p-3 hover:bg-slate-800/80 cursor-pointer transition flex items-center gap-3 group"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0 group-hover:scale-105 transition"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-amber-400 transition truncate flex items-center justify-between">
                            <span>{item.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-medium">
                              {item.tag?.split('&')[0] || 'Tourism'}
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                            <span>{item.location}</span>
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center space-y-2">
                      <p className="text-xs text-slate-400">Place not found in initial dataset.</p>
                    </div>
                  )}

                  {/* Always Available Action: Generate Live Destination Card with Google Gemini AI */}
                  {searchQuery.trim().length >= 3 && (
                    <div className="p-2.5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border-t border-amber-500/20">
                      <button
                        type="button"
                        onClick={() => {
                          if (onGenerateLivePlace) {
                            onGenerateLivePlace(searchQuery.trim());
                            setIsDropdownOpen(false);
                          }
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95"
                      >
                        <Sparkles className="w-4 h-4 fill-slate-950" />
                        <span>Create AI Destination Card for "{searchQuery}"</span>
                      </button>
                      <p className="text-[10px] text-slate-400 text-center mt-1">
                        Generates real-time 15km nearby spots, circuits, audio guides & timeline via Google Gemini AI
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer search action */}
                <div className="p-2.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs px-3">
                  <span className="text-[11px] text-slate-400">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">Enter</kbd> to search
                  </span>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(`${searchQuery} tourism`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline text-[11px] font-semibold flex items-center gap-1"
                  >
                    <span>Google Search</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Action: Language Switcher + Theme Toggle + User / Admin state or Login button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Multi-Language Switcher (Google Translate) */}
          <GoogleTranslateWidget theme={theme} />

          {/* Light / Dark Mode Toggle Button on Right Top Side */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center shadow-md active:scale-95 group ${
                theme === 'light'
                  ? 'bg-amber-100/80 border-amber-300/80 text-amber-600 hover:bg-amber-200'
                  : 'bg-slate-900/90 border-slate-800 text-amber-400 hover:bg-slate-800 hover:border-amber-400/50'
              }`}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 transition-transform group-hover:-rotate-12 fill-amber-500/20" />
              ) : (
                <Sun className="w-4 h-4 transition-transform group-hover:rotate-45" />
              )}
            </button>
          )}

          {currentAdmin ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView(activeView === 'admin' ? 'home' : 'admin')}
                className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider hover:bg-amber-500/20 transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{activeView === 'admin' ? 'View Website' : 'Admin Dashboard'}</span>
              </button>
              <button
                onClick={onAdminLogout}
                className="px-3 py-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 text-xs transition"
              >
                Log Out
              </button>
            </div>
          ) : currentUser ? (
            // Logged in User Traveler Dropdown / Badge
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView(activeView === 'user' ? 'home' : 'user')}
                className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider hover:bg-amber-500/20 transition flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{activeView === 'user' ? 'Explore Website' : 'My Dashboard'}</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition text-xs font-bold text-slate-200"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black text-xs uppercase">
                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                  <span className="hidden sm:inline-block truncate max-w-[100px]">{currentUser.name}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                </button>

                {/* User Menu Modal / Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-2xl space-y-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="border-b border-slate-800 pb-3">
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{currentUser.name}</span>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span className="truncate">{currentUser.email}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>+91 {currentUser.phone}</span>
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                        <span>SMS OTP Verified</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveView('user');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Open User Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onUserLogout();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <a
                href="#destinations"
                className="text-xs uppercase tracking-wider font-semibold text-slate-300 hover:text-amber-400 transition px-3 py-2 hidden sm:inline-block"
              >
                Explore
              </a>
              <button
                onClick={onLoginClick}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs tracking-wide uppercase shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In / Sign Up</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
