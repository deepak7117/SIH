import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DestinationsGrid from './components/DestinationsGrid';
import FeaturesSection from './components/FeaturesSection';
import DisclaimerSection from './components/DisclaimerSection';
import PlaceDetailModal from './components/PlaceDetailModal';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import Footer from './components/Footer';

import { features, heroSlides, nashikPlaces } from './data/tourismData';
import { searchTouristDestinations } from './data/indiaWebPlaces';
import {
  fetchPlacesApi,
  createPlaceApi,
  updatePlaceApi,
  deletePlaceApi,
  generateLivePlaceApi,
  saveUserHistoryApi
} from './services/api';

export default function App() {
  // Theme state: dark by default, persists in localStorage
  const [theme, setTheme] = useState(() => localStorage.getItem('sih_theme') || 'dark');

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('sih_theme', nextTheme);
  };

  const [placesList, setPlacesList] = useState(nashikPlaces);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userRole, setUserRole] = useState('traveler');
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('home'); // 'home' | 'admin' | 'user'
  const [currentSlide, setCurrentSlide] = useState(0);

  // Helper to record genuinely searched destinations into MongoDB Atlas & user's local history
  const recordPlaceSearchHistory = async (place) => {
    if (!place) return;
    const userIdentifier = currentUser?.phone || currentUser?.email || 'guest';
    const userKey = `sih_travel_history_${userIdentifier}`;
    const newEntry = {
      id: 'search_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      placeId: place._id || place.id,
      title: place.name,
      image: place.image,
      location: place.location,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', Today',
      points: '+25 pts',
      category: place.tag || 'Searched Destination',
      status: 'Searched & Explored',
      placeData: place
    };

    // 1. Save locally for instant offline UI responsiveness
    try {
      const existing = JSON.parse(localStorage.getItem(userKey) || '[]');
      localStorage.setItem(userKey, JSON.stringify([newEntry, ...existing]));
    } catch (e) {
      console.warn('Could not record local history', e);
    }

    // 2. Persist directly to MongoDB Atlas
    try {
      await saveUserHistoryApi({
        userId: currentUser?.id || currentUser?._id || userIdentifier,
        userIdentifier,
        placeId: place._id || place.id,
        title: place.name,
        image: place.image,
        location: place.location,
        points: '+25 pts',
        category: place.tag || 'Searched Destination',
        status: 'Searched & Explored',
        placeData: place
      });
    } catch (e) {
      console.warn('Backend history sync notice (saved locally):', e.message);
    }
  };

  // Load places live from MongoDB on startup
  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const livePlaces = await fetchPlacesApi();
        if (livePlaces && livePlaces.length > 0) {
          setPlacesList(livePlaces);
        }
      } catch (err) {
        console.warn('Backend offline or loading fallback data:', err.message);
      }
    };
    loadPlaces();
  }, []);

  // Check for stored admin & user session
  useEffect(() => {
    const storedAdmin = localStorage.getItem('sih_admin_session');
    if (storedAdmin) {
      try {
        setCurrentAdmin(JSON.parse(storedAdmin));
      } catch (e) {
        localStorage.removeItem('sih_admin_session');
      }
    }

    const storedUser = localStorage.getItem('sih_user_session');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('sih_user_session');
      }
    }
  }, []);

  // Auto rotate hero slides every 4.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Top Trending Destinations: directly driven by Admin checkbox marks (never collapsed/altered by navbar search)
  const trendingPlaces = placesList.filter((p) => p.isTopTrending !== false);


  // Admin CRUD Handlers communicating with MongoDB API
  const handleAddPlace = async (newPlaceData) => {
    if (!currentAdmin?.token) return;
    const saved = await createPlaceApi(newPlaceData, currentAdmin.token);
    setPlacesList((prev) => [saved, ...prev]);
  };

  const handleUpdatePlace = async (id, updatedData) => {
    if (!currentAdmin?.token) return;
    const updated = await updatePlaceApi(id, updatedData, currentAdmin.token);
    setPlacesList((prev) =>
      prev.map((p) => ((p._id || p.id) === (updated._id || updated.id) ? updated : p))
    );
  };

  const handleDeletePlace = async (placeId) => {
    try {
      if (currentAdmin?.token) {
        await deletePlaceApi(placeId, currentAdmin.token);
      }
      setPlacesList((prev) => prev.filter((p) => (p._id || p.id) !== placeId && p.name !== placeId));
    } catch (err) {
      alert(`Delete Error: ${err.message}`);
      // Still remove from UI view if desired
      setPlacesList((prev) => prev.filter((p) => (p._id || p.id) !== placeId && p.name !== placeId));
    }
  };

  // Auth Success Handlers
  const handleAdminLoginSuccess = (adminData) => {
    setCurrentAdmin(adminData);
    localStorage.setItem('sih_admin_session', JSON.stringify(adminData));
    setActiveView('admin');
  };

  const handleUserLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('sih_user_session', JSON.stringify(userData));
    setActiveView('user');
  };

  const handleAdminLogout = () => {
    setCurrentAdmin(null);
    localStorage.removeItem('sih_admin_session');
    setActiveView('home');
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sih_user_session');
    setActiveView('home');
  };

  // Live AI Destination Generation Handler
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiGeneratingPlaceName, setAiGeneratingPlaceName] = useState('');

  const handleGenerateLivePlace = async (query) => {
    try {
      setIsGeneratingAi(true);
      setAiGeneratingPlaceName(query);
      const res = await generateLivePlaceApi(query);
      if (res?.place) {
        // Record in search history
        recordPlaceSearchHistory(res.place);
        // Open directly in modal viewer
        setActiveView('home');
        setSelectedPlace(res.place);
      }
    } catch (err) {
      alert(`AI Generation Notice: ${err.message}`);
    } finally {
      setIsGeneratingAi(false);
      setAiGeneratingPlaceName('');
    }
  };

  // Save AI Generated Place into Database / Site Info
  const [isSavingAiSite, setIsSavingAiSite] = useState(false);
  const [savedAiSiteIds, setSavedAiSiteIds] = useState(new Set());

  const handleSaveAiPlaceToSiteInfo = async (placeToSave) => {
    if (!currentAdmin?.token) {
      alert('Admin authentication required to add destination to database.');
      return;
    }
    try {
      setIsSavingAiSite(true);
      // Clean temporary AI id if present so MongoDB generates a real _id
      const { _id, id, _aiModelUsed, ...cleanPlaceData } = placeToSave;
      const saved = await createPlaceApi(cleanPlaceData, currentAdmin.token);
      setPlacesList((prev) => [saved, ...prev]);
      setSavedAiSiteIds((prev) => new Set(prev).add(placeToSave.name));
      // Update selectedPlace to the newly saved DB record
      setSelectedPlace(saved);
      const isPublished = placeToSave.isTopTrending !== false;
      alert(
        isPublished
          ? `✅ "${placeToSave.name}" added to Sites & Published to visitors successfully!`
          : `✅ "${placeToSave.name}" added to Sites database as Draft/Hidden (not visible on homepage).`
      );
    } catch (err) {
      alert(`Error adding to database: ${err.message}`);
    } finally {
      setIsSavingAiSite(false);
    }
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-amber-500 selection:text-slate-950 transition-colors duration-300 ${theme} ${
      theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* AI Generation Floating Status Modal / Toast */}
      {isGeneratingAi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/50 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto animate-pulse">
              <span className="text-2xl">✨</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Generating Destination Card</h3>
              <p className="text-xs text-amber-400 font-medium font-mono">"{aiGeneratingPlaceName}"</p>
              <p className="text-[11px] text-slate-400 pt-2">
                Consulting Google Gemini AI to discover nearby spots within 15km, heritage circuits, historical milestones & audio guides...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 1. Header / Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placesList={placesList}
        onSelectPlace={(place) => {
          recordPlaceSearchHistory(place);
          setSelectedPlace(place);
        }}
        onLoginClick={() => {
          setUserRole('traveler');
          setIsLoginModalOpen(true);
        }}
        currentAdmin={currentAdmin}
        currentUser={currentUser}
        activeView={activeView}
        setActiveView={setActiveView}
        onAdminLogout={handleAdminLogout}
        onUserLogout={handleUserLogout}
        onGenerateLivePlace={handleGenerateLivePlace}
        isGeneratingAi={isGeneratingAi}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* View Switch: Admin Dashboard vs User Dashboard vs Main Website */}
      {activeView === 'admin' ? (
        <AdminDashboard
          places={placesList}
          onAddPlace={handleAddPlace}
          onUpdatePlace={handleUpdatePlace}
          onDeletePlace={handleDeletePlace}
          onLogout={() => {
            if (currentAdmin) handleAdminLogout();
            else setActiveView('home');
          }}
          adminUser={currentAdmin || { name: 'Super Admin', email: 'admin1@tourism.in', department: 'Nashik Municipal Tourism Board' }}
        />
      ) : activeView === 'user' ? (
        <UserDashboard
          currentUser={currentUser || { name: 'Bhavin Shinde', email: 'traveler@tourism.in', phone: '9579039845' }}
          places={placesList}
          onLogout={() => {
            if (currentUser) handleUserLogout();
            else setActiveView('home');
          }}
          onExploreDestinations={() => setActiveView('home')}
          onSelectPlace={(place) => {
            recordPlaceSearchHistory(place);
            setSelectedPlace(place);
          }}
          onRecordSearch={recordPlaceSearchHistory}
        />
      ) : (
        <>
          {/* 2. Hero Background Slideshow & Let Know Our India with bottom stats */}
          <HeroSection
            heroSlides={heroSlides}
            currentSlide={currentSlide}
            theme={theme}
          />

          {/* 3. Top Trending Destinations Grid (Live MongoDB Data & Admin Selected) */}
          <DestinationsGrid
            places={trendingPlaces}
            onSelectPlace={(place) => setSelectedPlace(place)}
          />

          {/* 4. Features Section */}
          <FeaturesSection features={features} theme={theme} />

          {/* 4.1 Platform Disclaimers */}
          <DisclaimerSection theme={theme} />

          {/* 6. Contact & Footer */}
          <Footer
            onHostDashboardClick={() => {
              if (currentAdmin) {
                setActiveView('admin');
              } else {
                setUserRole('admin');
                setIsLoginModalOpen(true);
              }
            }}
          />
        </>
      )}

      {/* 5. Destination Details Modal — rendered outside the view switch so it also
          opens over the Admin/User dashboards (e.g. right after a QR scan). */}
      <PlaceDetailModal
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
        isAdmin={!!currentAdmin}
        onSaveToSiteInfo={handleSaveAiPlaceToSiteInfo}
        isSavingSite={isSavingAiSite}
        isSavedToSite={selectedPlace ? savedAiSiteIds.has(selectedPlace.name) : false}
      />

      {/* 7. Auth / Role Modal (Connected to MongoDB with SMS OTP) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        userRole={userRole}
        setUserRole={setUserRole}
        onAdminLoginSuccess={handleAdminLoginSuccess}
        onUserLoginSuccess={handleUserLoginSuccess}
      />
    </div>
  );
}
