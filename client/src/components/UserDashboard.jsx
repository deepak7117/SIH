import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import {
  Search,
  QrCode,
  History,
  BookOpen,
  Award,
  PhoneCall,
  User,
  Compass,
  ArrowRight,
  Sparkles,
  Camera,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Clock,
  Gift,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  LogOut,
  Mail,
  Smartphone,
  Headphones,
  BellRing,
  Menu,
  Trash2
} from 'lucide-react';

import { nashikPlaces } from '../data/tourismData';
import {
  fetchUserHistoryApi,
  deleteUserHistoryApi,
  clearUserHistoryApi,
  updateUserRewardPointsApi,
  lookupPlaceByQrApi
} from '../services/api';

export default function UserDashboard({
  currentUser,
  onLogout,
  onExploreDestinations,
  onSelectPlace,
  places = [],
  onRecordSearch
}) {
  const [activeTab, setActiveTab] = useState('history');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(true);

  // Real camera-based QR scanner state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanFrameRef = useRef(null);

  const userIdentifier = currentUser?.phone || currentUser?.email || 'guest';
  const userStorageKey = `sih_travel_history_${userIdentifier}`;
  const pointsStorageKey = `sih_reward_points_${userIdentifier}`;

  // Reward points balance state (persisted in DB & localStorage independently from history deletions)
  const [rewardPoints, setRewardPoints] = useState(() => {
    try {
      const savedPoints = localStorage.getItem(pointsStorageKey);
      if (savedPoints !== null) {
        return parseInt(savedPoints, 10) || 0;
      }
    } catch (e) {
      console.warn('Could not read reward points from storage', e);
    }
    return 0;
  });

  // Real search & travel history (synced with MongoDB Atlas & localStorage)
  const [travelHistory, setTravelHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(userStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read travel history from storage', e);
    }
    return [];
  });

  // Fetch real history & reward points directly from MongoDB Atlas on load/user switch
  useEffect(() => {
    const loadDbHistory = async () => {
      try {
        const res = await fetchUserHistoryApi(userIdentifier);
        if (res?.success) {
          if (Array.isArray(res.history)) {
            setTravelHistory(res.history);
            localStorage.setItem(userStorageKey, JSON.stringify(res.history));
          }

          // Calculate history points sum
          const historyPts = (res.history || []).reduce((acc, item) => {
            const pts = parseInt((item.points || '').replace(/[^\d]/g, ''), 10) || 0;
            return acc + pts;
          }, 0);

          // Use the highest between DB points and history sum
          const currentLocal = parseInt(localStorage.getItem(pointsStorageKey) || '0', 10);
          const finalPoints = Math.max(res.rewardPoints || 0, historyPts, currentLocal);
          setRewardPoints(finalPoints);
          localStorage.setItem(pointsStorageKey, finalPoints.toString());
        }
      } catch (err) {
        console.warn('Could not fetch MongoDB history (using local storage fallback):', err.message);
      }
    };
    loadDbHistory();
  }, [userIdentifier, userStorageKey, pointsStorageKey]);

  // Sync points when new items added to history
  useEffect(() => {
    const historyPts = travelHistory.reduce((acc, item) => {
      const pts = parseInt((item.points || '').replace(/[^\d]/g, ''), 10) || 0;
      return acc + pts;
    }, 0);

    setRewardPoints((prev) => {
      const updated = Math.max(prev, historyPts);
      localStorage.setItem(pointsStorageKey, updated.toString());
      updateUserRewardPointsApi(userIdentifier, updated).catch(() => {});
      return updated;
    });
  }, [travelHistory, userIdentifier, pointsStorageKey]);

  // Delete individual history item (from MongoDB & local state, keeps earned points)
  const handleDeleteHistoryItem = async (historyId, e) => {
    if (e) e.stopPropagation();
    const itemToDelete = travelHistory.find((item) => item.id === historyId);
    setTravelHistory((prev) => {
      const updated = prev.filter((item) => item.id !== historyId);
      try {
        localStorage.setItem(userStorageKey, JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save updated history', err);
      }
      return updated;
    });

    if (itemToDelete?._dbId || historyId) {
      try {
        await deleteUserHistoryApi(itemToDelete?._dbId || historyId);
      } catch (err) {
        console.warn('Could not delete from MongoDB:', err.message);
      }
    }
  };

  // Clear all travel history (from MongoDB & local storage, preserves reward points)
  const handleClearAllHistory = async () => {
    if (travelHistory.length === 0) return;
    if (window.confirm('Are you sure you want to clear your travel and search history? (Your earned Reward Points balance will remain safe!)')) {
      setTravelHistory([]);
      try {
        localStorage.removeItem(userStorageKey);
        await clearUserHistoryApi(userIdentifier);
      } catch (e) {
        console.warn('Could not clear history from MongoDB', e);
      }
    }
  };

  // Total points balance is rewardPoints
  const totalPoints = rewardPoints;

  // Dynamic rewards based on real points balance
  const rewardsList = [
    {
      title: 'Free Audio Guide Pass',
      badge: 'Bronze Tier',
      pointsReq: '50 pts',
      requiredVal: 50,
      unlocked: totalPoints >= 50,
      desc: 'Free multi-language audio commentary across all Nashik temple circuits.'
    },
    {
      title: 'Heritage Monolith Fast-Track Entry',
      badge: 'Silver Tier',
      pointsReq: '100 pts',
      requiredVal: 100,
      unlocked: totalPoints >= 100,
      desc: 'Priority queue admission at Pandavleni Buddhist Caves & Museum.'
    },
    {
      title: 'Sula Vineyard 15% Tasting Discount',
      badge: 'Gold Tier',
      pointsReq: '200 pts',
      requiredVal: 200,
      unlocked: totalPoints >= 200,
      desc: 'Instant 15% discount on wine tasting sessions at Sula & York Vineyards.'
    },
    {
      title: 'VIP Kumbh Ghat Aarti Access',
      badge: 'Platinum Tier',
      pointsReq: '350 pts',
      requiredVal: 350,
      unlocked: totalPoints >= 350,
      desc: 'Reserved front-row seating at Ramkund Godavari evening Maha Aarti.'
    }
  ];

  // User Guide Articles
  const guideArticles = [
    {
      title: 'How to use "Tap to Scan" QR at Tourism Sites',
      summary: 'Scan monument QR boards placed at entrance gates of Nashik heritage places to get instant audio guide, AR view & earn tourist reward points.'
    },
    {
      title: 'Kumbh Mela & Godavari Ghat Walking Route',
      summary: 'Recommended morning walking route starting from Ramkund towards Kapaleshwar & Sita Gufa with optimal photo spots.'
    },
    {
      title: 'Trekking Brahmagiri & Anjaneri Safety Guide',
      summary: 'Essential monsoon safety checklist, recommended shoes, emergency helpline numbers, and sunrise timing.'
    }
  ];

  // Filter places for search bar
  const searchedPlaces = places.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stops the live camera feed & the scanning loop
  const stopCameraScan = () => {
    if (scanFrameRef.current) {
      cancelAnimationFrame(scanFrameRef.current);
      scanFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Make sure the camera is always released when leaving the scan tab / unmounting
  useEffect(() => {
    if (activeTab !== 'scan') {
      stopCameraScan();
    }
  }, [activeTab]);

  useEffect(() => {
    return () => stopCameraScan();
  }, []);

  // Called once a QR code has been decoded from the live camera feed —
  // verifies it against the codes generated by an admin for a real place
  const handleQrDetected = async (qrValue) => {
    stopCameraScan();
    setIsScanning(true);
    setScanResult(null);

    try {
      const place = await lookupPlaceByQrApi(qrValue);
      setScanResult({
        placeName: place.name,
        location: place.location,
        pointsEarned: 50,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setTravelHistory((prev) => [
        {
          id: 'h_' + Date.now(),
          placeId: place._id || place.id,
          title: place.name,
          image: place.image,
          location: place.location,
          date: 'Just now (' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ')',
          points: '+50 pts',
          category: place.tag || 'Heritage',
          status: 'Verified via QR',
          placeData: place
        },
        ...prev
      ]);

      // Briefly show the "Visit Verified" confirmation, then open the place's
      // detail card — scanning a QR should land the visitor on that place,
      // not just award points.
      setTimeout(() => {
        if (onSelectPlace) onSelectPlace(place);
      }, 1200);
    } catch (err) {
      setCameraError(err.message || 'This QR code is not recognized. Please scan an official monument QR generated by an admin.');
    } finally {
      setIsScanning(false);
    }
  };

  // Reads frames from the live video feed and looks for a QR code in each one
  const scanVideoFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data) {
        handleQrDetected(code.data);
        return;
      }
    }

    scanFrameRef.current = requestAnimationFrame(scanVideoFrame);
  };

  // Opens the device camera and starts scanning for an admin-generated QR code
  const handleSimulateScan = async () => {
    setScanResult(null);
    setCameraError('');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera is not supported on this device or browser.');
      return;
    }

    if (window.isSecureContext === false) {
      setCameraError('Camera access needs a secure (HTTPS) connection. Please open this site over HTTPS.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      // The <video> element mounts once cameraActive flips to true. We attach
      // the stream from a callback ref (see attachVideoRef below) instead of a
      // setTimeout, so it fires exactly when the node is actually in the DOM
      // instead of racing React's render.
      setCameraActive(true);
    } catch (err) {
      setCameraError('Camera access denied. Please allow camera permission to scan the QR code.');
    }
  };

  // Callback ref: fires the instant the <video> element mounts/unmounts.
  // This is what reliably wires the live camera stream to the <video> tag
  // and kicks off the QR scanning loop — no race with React's render cycle.
  const attachVideoRef = (node) => {
    videoRef.current = node;
    if (node && streamRef.current) {
      node.srcObject = streamRef.current;
      node.play().catch(() => {});
      if (!scanFrameRef.current) {
        scanFrameRef.current = requestAnimationFrame(scanVideoFrame);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Card with Greeting & Live Search Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* User Greeting */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Traveler Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex flex-wrap items-center gap-2">
                <span>Hi,</span>
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  @{currentUser?.name || 'Traveler'}
                </span>
                <span className="text-xl sm:text-2xl text-slate-400 font-normal">ready to explore?</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Welcome to your smart Maharashtra tourism hub. Scan monument QRs, collect reward points, explore offline guides, and plan visits.
              </p>
            </div>

            {/* Live Search Bar */}
            <div className="w-full lg:w-96 space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Search Destinations
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search temples, forts, caves, vineyards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-inner transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Search Dropdown / Live Results */}
          {searchQuery && (
            <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {searchedPlaces.slice(0, 3).map((place) => (
                <div
                  key={place._id || place.id}
                  onClick={() => {
                    if (onRecordSearch) onRecordSearch(place);
                    if (onSelectPlace) onSelectPlace(place);
                  }}
                  className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-400/50 cursor-pointer transition flex items-center gap-3"
                >
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-white truncate">{place.name}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">{place.location}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Grid: Left Tabs / Menu & Right Content Area (Exact Layout from Sketch) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT MENU (Dropdown Format) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-xl space-y-2">
              
              {/* Dropdown Header Trigger */}
              <button
                type="button"
                onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Menu className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Menu Options Dropdown
                    </p>
                    <p className="text-xs font-bold text-white flex items-center gap-1.5 capitalize">
                      <span>Active: {activeTab === 'scan' ? 'Tap to Scan' : activeTab === 'guide' ? 'User Guide' : activeTab}</span>
                    </p>
                  </div>
                </div>
                <div className={`p-1.5 rounded-lg bg-slate-900 text-slate-400 transition-transform duration-200 ${isMenuDropdownOpen ? 'rotate-180 text-amber-400' : ''}`}>
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </button>

              {/* Dropdown Menu Items List */}
              {isMenuDropdownOpen && (
                <div className="space-y-1.5 pt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* 1. Tap to Scan / QR Scanner Tab */}
                  <button
                    onClick={() => setActiveTab('scan')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition duration-200 ${
                      activeTab === 'scan'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <QrCode className="w-5 h-5" />
                      <span>Tap to Scan / Scan Me</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </button>

                  {/* 2. History */}
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition duration-200 ${
                      activeTab === 'history'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <History className="w-5 h-5" />
                      <span>History</span>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-950/60 font-mono">
                      {travelHistory.length}
                    </span>
                  </button>

                  {/* 3. User Guide */}
                  <button
                    onClick={() => setActiveTab('guide')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition duration-200 ${
                      activeTab === 'guide'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5" />
                      <span>User Guide</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </button>

                  {/* 4. Rewards */}
                  <button
                    onClick={() => setActiveTab('rewards')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition duration-200 ${
                      activeTab === 'rewards'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5" />
                      <span>Rewards</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                      {totalPoints} Pts
                    </span>
                  </button>

                  {/* 5. Contact Us */}
                  <button
                    onClick={() => setActiveTab('contact')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition duration-200 ${
                      activeTab === 'contact'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <PhoneCall className="w-5 h-5" />
                      <span>Contact Us</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Right Box on Sketch: User Info Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black text-lg">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{currentUser?.name || 'Verified Traveler'}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </h3>
                  <p className="text-xs text-slate-400">{currentUser?.email || 'traveler@tourism.in'}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                    Mobile Phone
                  </span>
                  <span className="font-mono font-medium">+91 {currentUser?.phone || '9579039845'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    SMS Verification
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[11px]">
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    Explorer Points
                  </span>
                  <span className="font-bold text-amber-400">{totalPoints} Pts</span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out of Traveler Account</span>
              </button>
            </div>
          </div>

          {/* RIGHT PANEL (Main Dynamic Area based on Sketch) */}
          <div className="lg:col-span-8 space-y-6">

            {/* TAB 1: TAP TO SCAN / SCAN ME (Centerpiece of the sketch) */}
            {activeTab === 'scan' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-center relative overflow-hidden">
                <div className="space-y-2 max-w-md mx-auto">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Tap to Scan Monument QR
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Scan the official QR code at any Nashik monument, temple or museum to verify your visit & claim reward points.
                  </p>
                </div>

                {/* Big Circular QR Scanner Target from the Sketch */}
                <div className="flex flex-col items-center justify-center py-4">
                  <div
                    className="relative group cursor-pointer"
                    onClick={!cameraActive ? handleSimulateScan : undefined}
                  >
                    {/* Outer animated radar / ripple ring */}
                    <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-30 group-hover:opacity-60 blur-xl transition duration-500 animate-pulse"></div>
                    
                    {/* Outer Circle Ring */}
                    <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-slate-950 border-4 border-amber-500/40 group-hover:border-amber-400 flex items-center justify-center p-4 shadow-2xl transition duration-300">
                      {/* Inner Target Square */}
                      <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-3xl border-2 border-dashed border-amber-400/80 bg-slate-900/90 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                        {cameraActive ? (
                          <>
                            <video
                              ref={attachVideoRef}
                              autoPlay
                              muted
                              playsInline
                              className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                            />
                            <canvas ref={canvasRef} className="hidden" />
                            {/* Scanning laser beam animation over the live feed */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-bounce"></div>
                          </>
                        ) : isScanning ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-[11px] font-bold text-amber-400">Scanning...</span>
                          </div>
                        ) : (
                          <>
                            <QrCode className="w-16 h-16 text-amber-400 group-hover:scale-110 transition duration-300" />
                            {/* Scanning laser beam animation */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-bounce"></div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* "Scan Me" Button & Instruction */}
                  <div className="mt-6 space-y-3">
                    {cameraActive ? (
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
                          <Camera className="w-4 h-4" />
                          Point your camera at the monument's QR code
                        </span>
                        <button
                          onClick={stopCameraScan}
                          className="px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition duration-200"
                        >
                          Cancel Scan
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleSimulateScan}
                        disabled={isScanning}
                        className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
                      >
                        {isScanning ? 'Processing QR Code...' : 'Tap to Scan / Scan Me'}
                      </button>
                    )}
                    <p className="text-[11px] text-slate-500">
                      Camera QR scanner or instant NFC beacon check-in supported
                    </p>
                    {cameraError && (
                      <p className="text-[11px] text-rose-400 font-semibold max-w-xs mx-auto">
                        {cameraError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Scan Result Feedback Card */}
                {scanResult && (
                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-left max-w-md mx-auto animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{scanResult.placeName}</h4>
                        <p className="text-xs text-slate-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>{scanResult.location}</span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-emerald-500/20 flex justify-between items-center text-xs">
                      <span className="text-emerald-400 font-semibold">Visit Verified at {scanResult.timestamp}</span>
                      <span className="font-bold text-amber-400">+{scanResult.pointsEarned} Points Added!</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: ITINERARY (My Travel Plan) */}
            {activeTab === 'itinerary' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Compass className="w-5 h-5 text-amber-400" />
                      <span>My Planned Nashik Itinerary (2-Day Route)</span>
                    </h2>
                    <p className="text-xs text-slate-400">Curated smart route with best travel timings & audio guides</p>
                  </div>
                  <button
                    onClick={onExploreDestinations}
                    className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition self-start sm:self-auto"
                  >
                    + Add More Places
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Day 1 */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                        Day 1: Spiritual & Heritage Circuit
                      </span>
                      <span className="text-xs text-slate-400 font-mono">08:00 AM – 06:00 PM</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">1</span>
                          <span className="font-bold text-white">Trimbakeshwar Temple & Kushavarta Kund</span>
                        </div>
                        <span className="text-slate-400">08:00 AM</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">2</span>
                          <span className="font-bold text-white">Brahmagiri Hill Nature Walk</span>
                        </div>
                        <span className="text-slate-400">11:30 AM</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">3</span>
                          <span className="font-bold text-white">Panchavati, Sita Gufa & Ramkund Aarti</span>
                        </div>
                        <span className="text-slate-400">04:30 PM</span>
                      </div>
                    </div>
                  </div>

                  {/* Day 2 */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/20">
                        Day 2: Vineyards & Scenic Forts
                      </span>
                      <span className="text-xs text-slate-400 font-mono">09:30 AM – 07:00 PM</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">1</span>
                          <span className="font-bold text-white">Pandavleni Caves & Heritage Rock Cut</span>
                        </div>
                        <span className="text-slate-400">09:30 AM</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">2</span>
                          <span className="font-bold text-white">Sula Vineyards Wine Tour & Lunch</span>
                        </div>
                        <span className="text-slate-400">01:30 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: HISTORY */}
            {activeTab === 'history' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <History className="w-5 h-5 text-amber-400" />
                      <span>Search & Exploration History</span>
                    </h2>
                    <p className="text-xs text-slate-400">Recently searched and explored heritage places</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 font-bold">
                      {travelHistory.length} Places Explored
                    </span>
                    {travelHistory.length > 0 && (
                      <button
                        onClick={handleClearAllHistory}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 transition flex items-center gap-1"
                        title="Clear all search history"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear All</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {travelHistory.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                        <History className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-300">No search history recorded yet.</p>
                      <p className="text-xs text-slate-500">
                        Search any destination from the top search bar or dashboard to save it here!
                      </p>
                    </div>
                  ) : (
                    travelHistory.map((item) => {
                      const matchedPlace = item.placeData || places.find(p => (p._id || p.id) === item.placeId || p.name === item.title);
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (matchedPlace && onSelectPlace) {
                              onSelectPlace(matchedPlace);
                            }
                          }}
                          className={`p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500/40 hover:bg-slate-900/60 transition ${
                            matchedPlace ? 'cursor-pointer group' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            {item.image || matchedPlace?.image ? (
                              <img
                                src={item.image || matchedPlace?.image}
                                alt={item.title}
                                className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0 group-hover:scale-105 transition"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5" />
                              </div>
                            )}
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition">
                                  {item.title}
                                </h4>
                                <span className="text-[10px] font-semibold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                                  {item.category}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
                                {item.location || matchedPlace?.location ? (
                                  <span className="flex items-center gap-1 text-slate-300">
                                    <MapPin className="w-3 h-3 text-amber-400" />
                                    <span>{item.location || matchedPlace?.location}</span>
                                  </span>
                                ) : null}
                                <span>•</span>
                                <span className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                                  <Clock className="w-3 h-3" /> {item.date}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                                {item.points}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 hover:text-rose-400 text-slate-500 transition"
                                title="Delete from history"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">{item.status}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: USER GUIDE */}
            {activeTab === 'guide' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                    <span>Traveler User Guide & Nashik Manual</span>
                  </h2>
                  <p className="text-xs text-slate-400">Everything you need to know about exploring Nashik seamlessly</p>
                </div>

                <div className="space-y-4">
                  {guideArticles.map((article, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 hover:border-amber-500/30 transition"
                    >
                      <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span>{article.title}</span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed pl-7">
                        {article.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SMART AUDIO TOURS & AR GUIDE */}
            {activeTab === 'audio' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Headphones className="w-5 h-5 text-amber-400" />
                      <span>Smart Audio Guides & 3D AR Monument Experience</span>
                    </h2>
                    <p className="text-xs text-slate-400">Listen to historical narrations in English, Hindi & Marathi</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold self-start sm:self-auto">
                    GPS Auto-Detect On
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-bold">
                        Spiritual Heritage
                      </span>
                      <span className="text-xs text-slate-400 font-mono">14 Mins Audio</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Trimbakeshwar Temple & Kushavarta Tale</h4>
                    <p className="text-xs text-slate-400">Listen to the story of Sage Gautama, Godavari descent and the ancient Jyotirlinga architecture.</p>
                    <button className="w-full py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold transition flex items-center justify-center gap-2">
                      <Headphones className="w-3.5 h-3.5" />
                      <span>Play Audio Guide (EN / HI / MR)</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-orange-500/10 text-orange-400 text-[10px] font-bold">
                        Archaeological Caves
                      </span>
                      <span className="text-xs text-slate-400 font-mono">18 Mins Audio</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Pandavleni 24 Buddhist Rock-Cut Caves</h4>
                    <p className="text-xs text-slate-400">Discover 2,000-year-old Hinayana Buddhist monasteries, inscriptions and water cisterns.</p>
                    <button className="w-full py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold transition flex items-center justify-center gap-2">
                      <Headphones className="w-3.5 h-3.5" />
                      <span>Play Audio Guide (EN / HI / MR)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: REWARDS */}
            {activeTab === 'rewards' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-400" />
                      <span>Explorer Rewards & Badges</span>
                    </h2>
                    <p className="text-xs text-slate-400">Earn points by scanning monument QRs and searching destinations</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-slate-400">Current Balance</p>
                    <span className="text-lg font-black text-amber-400 font-mono">{totalPoints} Pts</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {rewardsList.map((reward, i) => (
                    <div
                      key={i}
                      className={`p-5 rounded-2xl border space-y-3 flex flex-col justify-between ${
                        reward.unlocked
                          ? 'bg-slate-950 border-amber-500/30'
                          : 'bg-slate-950/50 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {reward.badge}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-400">
                            {reward.pointsReq}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{reward.title}</h4>
                        <p className="text-xs text-slate-400">{reward.desc}</p>
                      </div>

                      <button
                        disabled={!reward.unlocked}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                          reward.unlocked
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 shadow'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {reward.unlocked ? 'Redeem Voucher' : 'Locked (Needs Points)'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: CONTACT US */}
            {activeTab === 'contact' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 text-amber-400" />
                    <span>Nashik Tourism Helpline & Contact Us</span>
                  </h2>
                  <p className="text-xs text-slate-400">24x7 Tourist assistance, guide booking & emergency support</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <p className="text-[11px] text-slate-400 font-semibold">Toll-Free Tourist Helpline</p>
                    <p className="text-base font-black text-amber-400 font-mono">1800-233-7733</p>
                    <p className="text-[11px] text-slate-500">Available 24x7 in Marathi, Hindi & English</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <p className="text-[11px] text-slate-400 font-semibold">Official Email Desk</p>
                    <p className="text-sm font-bold text-white">support@nashiktourism.gov.in</p>
                    <p className="text-[11px] text-slate-500">Response within 2 business hours</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <p className="text-[11px] text-slate-400 font-semibold">District Tourist Facilitation Center</p>
                    <p className="text-xs font-bold text-white">MTDC Tourist Complex, Old Agra Road, Nashik</p>
                    <p className="text-[11px] text-slate-500">Open 09:00 AM – 07:00 PM</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <p className="text-[11px] text-slate-400 font-semibold">Police & Emergency Helpline</p>
                    <p className="text-base font-black text-rose-400 font-mono">112 / 100</p>
                    <p className="text-[11px] text-slate-500">Immediate emergency assistance</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Explore Nashik Destinations CTA */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-sm font-bold text-white">Want to explore all trending tourist places?</h4>
                <p className="text-xs text-slate-400">Discover top temples, waterfalls, historic forts & wineries in Nashik.</p>
              </div>
              <button
                onClick={onExploreDestinations}
                className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition shrink-0 flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <span>Explore Places</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
