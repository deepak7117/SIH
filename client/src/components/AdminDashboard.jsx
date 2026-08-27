import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Trash2,
  Edit3,
  MapPin,
  Star,
  LogOut,
  CheckCircle,
  Building,
  ShieldCheck,
  X,
  Loader2,
  LayoutDashboard,
  Map,
  Image as ImageIcon,
  MessageSquare,
  Users,
  Eye,
  ChevronRight,
  Menu,
  Sparkles,
  TrendingUp,
  FileCheck,
  Clock,
  ExternalLink,
  RefreshCw,
  Save,
  Check,
  Database as DatabaseIcon,
  ImageOff,
  Globe
} from 'lucide-react';
import { fetchAdminUsersApi, getPlaceQrPreviewApi, generatePlaceQrApi, getPlaceQrDownloadUrl } from '../services/api';

export default function AdminDashboard({
  places = [],
  onAddPlace,
  onUpdatePlace,
  onDeletePlace,
  onLogout,
  adminUser
}) {
  // Navigation Tabs matching sketch: Overview | Site Info | Monument Photo | Reviews | Users Info
  const [activeTab, setActiveTab] = useState('overview');
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  // Live Real Users loaded from MongoDB
  const [liveUsers, setLiveUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Modal State for adding / editing site
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);

  // Live QR preview + download state for the "Advanced Site Features" panel
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState('');

  useEffect(() => {
    const placeId = editingPlace?._id || editingPlace?.id;
    if (!placeId) {
      setQrDataUrl(null);
      setQrError('');
      return;
    }
    let cancelled = false;
    setQrLoading(true);
    setQrError('');
    getPlaceQrPreviewApi(placeId)
      .then((data) => {
        if (!cancelled) setQrDataUrl(data.qrDataUrl);
      })
      .catch((err) => {
        if (!cancelled) {
          setQrDataUrl(null);
          setQrError(err.message || 'This place has no QR code yet.');
        }
      })
      .finally(() => {
        if (!cancelled) setQrLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [editingPlace?._id, editingPlace?.id]);

  async function handleGenerateQr() {
    const placeId = editingPlace?._id || editingPlace?.id;
    if (!placeId || !adminUser?.token) return;
    setQrLoading(true);
    setQrError('');
    try {
      const { qrDataUrl: freshQr } = await generatePlaceQrApi(placeId, adminUser.token);
      setQrDataUrl(freshQr);
    } catch (err) {
      setQrError(err.message || 'Failed to generate QR code');
    } finally {
      setQrLoading(false);
    }
  }
  const [saveAllSuccess, setSaveAllSuccess] = useState(false);

  // Selected Site & Custom Config Data
  const [selectedSite, setSelectedSite] = useState(null);
  const [siteCustomData, setSiteCustomData] = useState({});

  // Load Real Registered Users directly from MongoDB on mount
  const loadLiveUsers = async () => {
    if (!adminUser?.token) return;
    try {
      setIsLoadingUsers(true);
      const data = await fetchAdminUsersApi(adminUser.token);
      setLiveUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Could not load live registered users:', err.message);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadLiveUsers();
  }, [adminUser?.token]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    location: '',
    image: '',
    rating: 4.8,
    reviews: 100,
    description: '',
    bestTime: '',
    host: 'Nashik Municipal Tourism Board',
    highlights: '',
    isTopTrending: true,
    hiddenHistory: '',
    historyContent: [],
    visualTimeline: [],
    nearbyPlaces: [],
    coRelatedPlaces: []
  });

  // State for sub-modals / item creators / editors
  const [openSubSection, setOpenSubSection] = useState(null); // 'history' | 'timeline' | 'nearby' | 'corelated' | null
  const [editingTimelineIndex, setEditingTimelineIndex] = useState(null);
  const [editingNearbyIndex, setEditingNearbyIndex] = useState(null);
  const [editingCoRelatedIndex, setEditingCoRelatedIndex] = useState(null);

  const [historyForm, setHistoryForm] = useState({ language: 'English', mediaType: 'audio', title: '', mediaUrl: '', narrator: '', duration: '' });
  const [timelineForm, setTimelineForm] = useState({ year: '', title: '', imageUrl: '', description: '' });
  const [nearbyForm, setNearbyForm] = useState({ name: '', distance: '2.5 km', imageUrl: '', category: 'Heritage' });
  const [coRelatedForm, setCoRelatedForm] = useState({ name: '', circuit: 'Ramayana Circuit', imageUrl: '', connection: 'Shared pilgrimage & heritage route' });

  // Safe Places array fallback
  const safePlaces = Array.isArray(places) ? places : [];

  // Auto-select first site by default so the bottom panel is always visible immediately
  useEffect(() => {
    if (!selectedSite && safePlaces.length > 0) {
      setSelectedSite(safePlaces[0]);
    }
  }, [safePlaces, selectedSite]);

  // Calculate real metrics directly from MongoDB data
  let totalReviewsCount = 0;
  let averageRating = '5.0';
  try {
    totalReviewsCount = safePlaces.reduce((acc, p) => acc + (Number(p?.reviews) || 0), 0);
    if (safePlaces.length > 0) {
      const sum = safePlaces.reduce((acc, p) => acc + (Number(p?.rating) || 0), 0);
      averageRating = (sum / safePlaces.length).toFixed(1);
    }
  } catch (e) {
    console.error('Error calculating metrics:', e);
  }

  const handleOpenAdd = () => {
    setEditingPlace(null);
    setOpenSubSection(null);
    setEditingTimelineIndex(null);
    setEditingNearbyIndex(null);
    setEditingCoRelatedIndex(null);
    setFormData({
      name: '',
      tag: '',
      location: '',
      image: '',
      rating: 4.8,
      reviews: 100,
      description: '',
      detailedDescription: '',
      bestTime: '',
      host: 'Nashik Municipal Tourism Board',
      highlights: '',
      isTopTrending: true,
      isPublished: true,
      hiddenHistory: '',
      historyContent: [],
      visualTimeline: [],
      nearbyPlaces: [],
      coRelatedPlaces: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (place) => {
    setEditingPlace(place);
    setOpenSubSection(null);
    setEditingTimelineIndex(null);
    setEditingNearbyIndex(null);
    setEditingCoRelatedIndex(null);
    const hl = Array.isArray(place.highlights)
      ? place.highlights.join(', ')
      : typeof place.highlights === 'string'
      ? place.highlights
      : '';

    setFormData({
      name: place.name || '',
      tag: place.tag || '',
      location: place.location || '',
      image: place.image || '',
      rating: place.rating || 4.8,
      reviews: place.reviews || 100,
      description: place.description || '',
      detailedDescription: place.detailedDescription || '',
      bestTime: place.bestTime || '',
      host: place.host || 'Nashik Municipal Tourism Board',
      highlights: hl,
      isTopTrending: place.isTopTrending !== false,
      isPublished: place.isPublished !== false,
      hiddenHistory: place.hiddenHistory || '',
      historyContent: Array.isArray(place.historyContent) ? place.historyContent : [],
      visualTimeline: Array.isArray(place.visualTimeline) ? [...place.visualTimeline].sort((a,b) => parseInt(a.year || 0) - parseInt(b.year || 0)) : [],
      nearbyPlaces: Array.isArray(place.nearbyPlaces) ? place.nearbyPlaces : [],
      coRelatedPlaces: Array.isArray(place.coRelatedPlaces) ? place.coRelatedPlaces : []
    });
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (place, e) => {
    if (e) e.stopPropagation();
    const newPublishStatus = place.isPublished === false ? true : false;
    try {
      await onUpdatePlace(place._id || place.id, {
        ...place,
        isPublished: newPublishStatus
      });
    } catch (error) {
      alert(`Failed to update Publish status: ${error.message}`);
    }
  };

  const handleToggleTrending = async (place, e) => {
    if (e) e.stopPropagation();
    const newStatus = place.isTopTrending === false ? true : false;
    try {
      await onUpdatePlace(place._id || place.id, {
        ...place,
        isTopTrending: newStatus
      });
    } catch (error) {
      alert(`Failed to update Top Trending status: ${error.message}`);
    }
  };

  // Add Item to History Content
  const handleAddHistoryContent = () => {
    if (!historyForm.title.trim()) {
      alert('Please enter a title for history commentary');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      historyContent: [...(prev.historyContent || []), { ...historyForm }]
    }));
    setHistoryForm({ language: 'English', mediaType: 'audio', title: '', mediaUrl: '', narrator: '', duration: '' });
    setOpenSubSection(null);
  };

  // Remove History Content Item
  const handleRemoveHistoryContent = (index) => {
    setFormData((prev) => ({
      ...prev,
      historyContent: prev.historyContent.filter((_, i) => i !== index)
    }));
  };

  // Start Editing Timeline Item
  const handleStartEditTimeline = (item, index) => {
    setTimelineForm({
      year: item.year || '',
      title: item.title || '',
      imageUrl: item.imageUrl || '',
      description: item.description || ''
    });
    setEditingTimelineIndex(index);
    setOpenSubSection('timeline');
  };

  // Add or Save Item to Visual Timeline (sorted by year automatically)
  const handleAddTimelineItem = () => {
    if (!timelineForm.year.trim() || !timelineForm.title.trim()) {
      alert('Please specify at least Year and Title for timeline event');
      return;
    }
    let updated;
    if (editingTimelineIndex !== null) {
      updated = [...(formData.visualTimeline || [])];
      updated[editingTimelineIndex] = { ...timelineForm };
    } else {
      updated = [...(formData.visualTimeline || []), { ...timelineForm }];
    }
    updated.sort((a, b) => (parseInt(a.year) || 0) - (parseInt(b.year) || 0));
    setFormData((prev) => ({
      ...prev,
      visualTimeline: updated
    }));
    setTimelineForm({ year: '', title: '', imageUrl: '', description: '' });
    setEditingTimelineIndex(null);
    setOpenSubSection(null);
  };

  // Remove Timeline Item
  const handleRemoveTimelineItem = (index) => {
    if (editingTimelineIndex === index) {
      setEditingTimelineIndex(null);
      setTimelineForm({ year: '', title: '', imageUrl: '', description: '' });
    }
    setFormData((prev) => ({
      ...prev,
      visualTimeline: prev.visualTimeline.filter((_, i) => i !== index)
    }));
  };

  // Start Editing Nearby Place
  const handleStartEditNearby = (item, index) => {
    setNearbyForm({
      name: item.name || '',
      distance: item.distance || '2.5 km',
      imageUrl: item.imageUrl || '',
      category: item.category || 'Heritage'
    });
    setEditingNearbyIndex(index);
    setOpenSubSection('nearby');
  };

  // Add or Save Nearby Place Item
  const handleAddNearbyPlace = () => {
    if (!nearbyForm.name.trim()) {
      alert('Please specify nearby place name');
      return;
    }
    let updated;
    if (editingNearbyIndex !== null) {
      updated = [...(formData.nearbyPlaces || [])];
      updated[editingNearbyIndex] = { ...nearbyForm };
    } else {
      updated = [...(formData.nearbyPlaces || []), { ...nearbyForm }];
    }
    setFormData((prev) => ({
      ...prev,
      nearbyPlaces: updated
    }));
    setNearbyForm({ name: '', distance: '2.5 km', imageUrl: '', category: 'Heritage' });
    setEditingNearbyIndex(null);
    setOpenSubSection(null);
  };

  // Remove Nearby Place
  const handleRemoveNearbyPlace = (index) => {
    if (editingNearbyIndex === index) {
      setEditingNearbyIndex(null);
      setNearbyForm({ name: '', distance: '2.5 km', imageUrl: '', category: 'Heritage' });
    }
    setFormData((prev) => ({
      ...prev,
      nearbyPlaces: prev.nearbyPlaces.filter((_, i) => i !== index)
    }));
  };

  // Start Editing Co-Related Place
  const handleStartEditCoRelated = (item, index) => {
    setCoRelatedForm({
      name: item.name || '',
      circuit: item.circuit || 'Ramayana Circuit',
      imageUrl: item.imageUrl || '',
      connection: item.connection || 'Shared pilgrimage & heritage route'
    });
    setEditingCoRelatedIndex(index);
    setOpenSubSection('corelated');
  };

  // Add or Save Co-Related Place
  const handleAddCoRelatedPlace = () => {
    if (!coRelatedForm.name.trim()) {
      alert('Please specify related monument name');
      return;
    }
    let updated;
    if (editingCoRelatedIndex !== null) {
      updated = [...(formData.coRelatedPlaces || [])];
      updated[editingCoRelatedIndex] = { ...coRelatedForm };
    } else {
      updated = [...(formData.coRelatedPlaces || []), { ...coRelatedForm }];
    }
    setFormData((prev) => ({
      ...prev,
      coRelatedPlaces: updated
    }));
    setCoRelatedForm({ name: '', circuit: 'Ramayana Circuit', imageUrl: '', connection: 'Shared pilgrimage & heritage route' });
    setEditingCoRelatedIndex(null);
    setOpenSubSection(null);
  };

  // Remove Co-Related Place
  const handleRemoveCoRelatedPlace = (index) => {
    if (editingCoRelatedIndex === index) {
      setEditingCoRelatedIndex(null);
      setCoRelatedForm({ name: '', circuit: 'Ramayana Circuit', imageUrl: '', connection: 'Shared pilgrimage & heritage route' });
    }
    setFormData((prev) => ({
      ...prev,
      coRelatedPlaces: prev.coRelatedPlaces.filter((_, i) => i !== index)
    }));
  };

  // Save / Sync all destinations changes into MongoDB database
  const handleSaveAllPlaces = async () => {
    try {
      setIsSavingAll(true);
      for (const place of safePlaces) {
        const placeId = place._id || place.id;
        if (onUpdatePlace && placeId) {
          await onUpdatePlace(placeId, {
            ...place,
            isTopTrending: place.isTopTrending !== false,
            nearbyPlaces: place.nearbyPlaces || [],
            historyContent: place.historyContent || [],
            visualTimeline: place.visualTimeline || [],
            coRelatedPlaces: place.coRelatedPlaces || [],
            hiddenHistory: place.hiddenHistory || ''
          });
        }
      }
      setSaveAllSuccess(true);
      setTimeout(() => setSaveAllSuccess(false), 3500);
    } catch (err) {
      alert(`Error saving all destination changes to database: ${err.message}`);
    } finally {
      setIsSavingAll(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedData = {
      ...formData,
      highlights: typeof formData.highlights === 'string'
        ? formData.highlights.split(',').map((h) => h.trim()).filter(Boolean)
        : formData.highlights
    };

    try {
      if (editingPlace) {
        await onUpdatePlace(editingPlace._id || editingPlace.id, formattedData);
      } else {
        await onAddPlace(formattedData);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert(`Error saving place to database: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Card (Matches App Name: BhavinShinde & Admin Dashboard Header) */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Incredible India • Admin Suite
              </span>
              <span className="text-xs text-slate-400">({adminUser?.department || 'Nashik Municipal Tourism'})</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Live tourism portal management synced in real-time with MongoDB Atlas.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10">
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wide shadow-lg shadow-amber-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Destination</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-3 rounded-full bg-slate-900 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 border border-slate-800 text-slate-300 font-semibold text-xs transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Left Dropdown Sidebar & Right Content Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT SIDEBAR (Collapsible Dropdown matching sketch: Overview, Site Info, Monument Photo, Reviews, Users Info) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-xl space-y-2">
              
              {/* Dropdown Header Toggle */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Menu className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Admin Navigation
                    </p>
                    <p className="text-xs font-bold text-white capitalize">
                      Active: {activeTab === 'overview' ? 'Overview' : activeTab === 'siteinfo' ? 'Site Info' : activeTab === 'photos' ? 'Monument Photo' : activeTab === 'reviews' ? 'Reviews' : 'Users Info'}
                    </p>
                  </div>
                </div>
                <div className={`p-1.5 rounded-lg bg-slate-900 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-amber-400' : ''}`}>
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </button>

              {/* Collapsible Menu List */}
              {isDropdownOpen && (
                <div className="space-y-1.5 pt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  
                  {/* 1. Overview */}
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition duration-200 ${
                      activeTab === 'overview'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Overview</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </button>

                  {/* 2. Site Info */}
                  <button
                    onClick={() => setActiveTab('siteinfo')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition duration-200 ${
                      activeTab === 'siteinfo'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Map className="w-5 h-5" />
                      <span>Site Info</span>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-950/60 font-mono">
                      {safePlaces.length}
                    </span>
                  </button>

                  {/* 3. Monument Photo */}
                  <button
                    onClick={() => setActiveTab('photos')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition duration-200 ${
                      activeTab === 'photos'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ImageIcon className="w-5 h-5" />
                      <span>Monument Photo</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </button>

                  {/* 4. Reviews */}
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition duration-200 ${
                      activeTab === 'reviews'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5" />
                      <span>Reviews</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                      {safePlaces.length}
                    </span>
                  </button>

                  {/* 5. Users Info */}
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition duration-200 ${
                      activeTab === 'users'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5" />
                      <span>Users Info</span>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-950/60 font-mono">
                      {liveUsers.length}
                    </span>
                  </button>

                </div>
              )}
            </div>

            {/* Admin Profile Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black text-lg">
                  A
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{adminUser?.name || 'Administrator'}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </h3>
                  <p className="text-xs text-slate-400">{adminUser?.email || 'admin1@tourism.in'}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Department</span>
                  <span className="font-semibold text-white">{adminUser?.department || 'Tourism Office'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Database</span>
                  <span className="text-emerald-400 font-mono">MongoDB Atlas (Live)</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT MAIN CONTENT PANEL */}
          <div className="lg:col-span-8 space-y-6">

            {/* TAB 1: OVERVIEW (Matches Sketch 4 Stat Boxes: Published Site No, Registered User No, Total Reviews, Pending Monument Photo) */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 4 Stat Boxes from Hand-Drawn Sketch (Real DB Values) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Box 1: Published Site No */}
                  <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2 relative overflow-hidden group hover:border-amber-500/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Published Site No.
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                        <MapPin className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-4xl font-black text-white font-mono">
                      {safePlaces.length}
                    </div>
                    <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                      <TrendingUp className="w-3.5 h-3.5" /> Real-time active sites in database
                    </p>
                  </div>

                  {/* Box 2: Registered User No */}
                  <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2 relative overflow-hidden group hover:border-amber-500/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Registered User No.
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-4xl font-black text-white font-mono">
                      {isLoadingUsers ? <Loader2 className="w-8 h-8 animate-spin text-amber-400" /> : liveUsers.length}
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Live MongoDB user accounts
                    </p>
                  </div>

                  {/* Box 3: Total Reviews */}
                  <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2 relative overflow-hidden group hover:border-amber-500/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Total Reviews
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-4xl font-black text-white font-mono">
                      {totalReviewsCount}
                    </div>
                    <p className="text-[11px] text-amber-400 flex items-center gap-1 font-medium">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {averageRating} / 5.0 Average Live Rating
                    </p>
                  </div>

                  {/* Box 4: Pending Monument Photo */}
                  <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2 relative overflow-hidden group hover:border-amber-500/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Pending Monument Photo
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-4xl font-black text-amber-400 font-mono">
                      {safePlaces.filter(p => !p.image).length}
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-400" /> {safePlaces.filter(p => !!p.image).length} / {safePlaces.length} active images verified
                    </p>
                  </div>

                </div>

                {/* Quick Manage Destinations List */}
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Map className="w-4 h-4 text-amber-400" />
                      <span>Recently Managed Destinations</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('siteinfo')}
                      className="text-xs font-bold text-amber-400 hover:underline"
                    >
                      View All Sites →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {safePlaces.slice(0, 4).map((place) => (
                      <div
                        key={place._id || place.id}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center gap-3"
                      >
                        <img
                          src={place.image}
                          alt={place.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-white truncate">{place.name}</h4>
                          <p className="text-[11px] text-slate-400 truncate">{place.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SITE INFO (Full CRUD place management from MongoDB) */}
            {activeTab === 'siteinfo' && (
              <div className="space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Map className="w-5 h-5 text-amber-400" />
                        <span>Site Information & Destination Database</span>
                      </h2>
                      <p className="text-xs text-slate-400">Click any site to inspect and configure advanced features below</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
                      <button
                        onClick={handleOpenAdd}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow flex items-center gap-1.5 transition hover:scale-105"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add New Site</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {safePlaces.map((place) => {
                      const placeKey = place._id || place.id;
                      const isTrending = place.isTopTrending !== false;
                      const isPublished = place.isPublished !== false;
                      return (
                        <div
                          key={placeKey}
                          onClick={() => handleOpenEdit(place)}
                          className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-500/50 hover:bg-slate-900/60 transition cursor-pointer group"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={place.image}
                              alt={place.name}
                              className="w-16 h-16 rounded-xl object-cover bg-slate-800 shrink-0 group-hover:scale-105 transition duration-200"
                            />
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10">
                                  {place.tag}
                                </span>
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {place.rating}
                                </span>
                                {isPublished ? (
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                                    <Globe className="w-3 h-3 text-emerald-400" /> Published
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center gap-1">
                                    <span>🔒</span> Draft / Hidden
                                  </span>
                                )}
                                {isTrending && isPublished && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-cyan-400" /> Top Trending
                                  </span>
                                )}
                              </div>
                              <h3 className="text-sm font-bold text-white">{place.name}</h3>
                              <p className="text-xs text-slate-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-500" /> {place.location}
                              </p>

                              {/* Live Database Data Summary Badges & Previews on Admin Card */}
                              <div className="space-y-1.5 pt-1.5">
                                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                                  {place.nearbyPlaces?.length > 0 && (
                                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold flex items-center gap-1">
                                      <span>📍</span> {place.nearbyPlaces.length} Nearby Places
                                    </span>
                                  )}
                                  {place.coRelatedPlaces?.length > 0 && (
                                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold flex items-center gap-1">
                                      <span>🔗</span> {place.coRelatedPlaces.length} Circuits
                                    </span>
                                  )}
                                  {place.visualTimeline?.length > 0 && (
                                    <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold flex items-center gap-1">
                                      <span>⏳</span> {place.visualTimeline.length} Timeline Eras
                                    </span>
                                  )}
                                </div>

                                {/* Names preview */}
                                {place.nearbyPlaces?.length > 0 && (
                                  <p className="text-[11px] text-slate-400">
                                    <strong className="text-amber-400/90 font-medium">Nearby Stops:</strong>{' '}
                                    {place.nearbyPlaces.map(n => `${n.name} (${n.distance})`).join(', ')}
                                  </p>
                                )}
                                {place.coRelatedPlaces?.length > 0 && (
                                  <p className="text-[11px] text-slate-400">
                                    <strong className="text-blue-400/90 font-medium">Circuits:</strong>{' '}
                                    {place.coRelatedPlaces.map(c => `${c.name} - ${c.circuit}`).join(', ')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                            {/* Fast Toggle Button for Published Status (Checkbox style matching Top Trending) */}
                            <button
                              type="button"
                              onClick={(e) => handleTogglePublish(place, e)}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                                isPublished
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                              }`}
                              title={isPublished ? 'Published: Accessible to users in search bar. Click to hide.' : 'Hidden: Not accessible in user search bar. Click to publish.'}
                            >
                              <input
                                type="checkbox"
                                checked={isPublished}
                                onChange={() => {}} // Handled by button onClick
                                className="w-3.5 h-3.5 rounded text-emerald-500 bg-slate-900 border-slate-700 pointer-events-none accent-emerald-500"
                              />
                              <span>{isPublished ? 'Published' : 'Hidden'}</span>
                            </button>

                            {/* Fast Toggle Button for Top Trending */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleTrending(place, e)}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                                isTrending
                                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                              }`}
                              title={isTrending ? 'Click to unmark from Top Trending' : 'Click to mark as Top Trending'}
                            >
                              <input
                                type="checkbox"
                                checked={isTrending}
                                onChange={() => {}} // Handled by button onClick
                                className="w-3.5 h-3.5 rounded text-amber-500 bg-slate-900 border-slate-700 pointer-events-none accent-amber-500"
                              />
                              <span>{isTrending ? 'Trending' : 'Not Trending'}</span>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEdit(place);
                              }}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to delete "${place.name}" from MongoDB?`)) {
                                  onDeletePlace(placeKey);
                                }
                              }}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 hover:text-rose-400 text-xs font-semibold text-slate-400 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* BOTTOM ACTION BAR: Save All Site Changes to Database */}
                  <div className="pt-6 mt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/60 -mx-6 -mb-6 p-6 rounded-b-3xl">
                    <div className="space-y-0.5 text-center sm:text-left">
                      <h4 className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                        <DatabaseIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Sync & Persist All Site Information</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Commit all {safePlaces.length} destination timelines, nearby stops, and audio commentaries across all slides directly to MongoDB Atlas.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {saveAllSuccess && (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                          <Check className="w-4 h-4" />
                          <span>All Saved to MongoDB!</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={handleSaveAllPlaces}
                        disabled={isSavingAll}
                        className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
                      >
                        {isSavingAll ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving All to Database...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save All Site Changes To DB</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MONUMENT PHOTO (Photo Gallery & Upload verification) */}
            {activeTab === 'photos' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-amber-400" />
                    <span>Monument Photo Gallery & Media Vault</span>
                  </h2>
                  <p className="text-xs text-slate-400">High-resolution photography for Nashik heritage attractions</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {safePlaces.map((place) => (
                    <div
                      key={place._id || place.id}
                      className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800"
                    >
                      <img
                        src={place.image}
                        alt={place.name}
                        className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90"></div>
                      <div className="absolute bottom-3 left-3 right-3 space-y-1">
                        <p className="text-xs font-bold text-white truncate">{place.name}</p>
                        <p className="text-[10px] text-amber-400">{place.tag}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: REVIEWS (Live place reviews from MongoDB) */}
            {activeTab === 'reviews' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-amber-400" />
                      <span>Tourist Reviews & Rating Analytics</span>
                    </h2>
                    <p className="text-xs text-slate-400">Live aggregated reviews across all published places in MongoDB</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-amber-400 font-mono">
                      {totalReviewsCount} Total Reviews
                    </span>
                    <p className="text-[11px] text-slate-400">Avg {averageRating} / 5.0 ★</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {safePlaces.map((place) => (
                    <div
                      key={place._id || place.id}
                      className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={place.image}
                          alt={place.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white">{place.name}</h4>
                          <p className="text-xs text-slate-400">{place.location} • <span className="text-amber-400">{place.tag}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{place.rating || 4.8} / 5.0</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">{place.reviews || 0} reviews</span>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: USERS INFO (Real Registered Traveler Accounts from MongoDB Atlas) */}
            {activeTab === 'users' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-amber-400" />
                      <span>Live Registered Travelers & Accounts</span>
                    </h2>
                    <p className="text-xs text-slate-400">Real MongoDB Atlas database records created via SMS OTP sign up</p>
                  </div>
                  <button
                    onClick={loadLiveUsers}
                    className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-amber-400 text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                    <span>Refresh Users</span>
                  </button>
                </div>

                {isLoadingUsers ? (
                  <div className="p-12 text-center flex flex-col items-center gap-2 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                    <span className="text-xs">Fetching users from MongoDB Atlas...</span>
                  </div>
                ) : liveUsers.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 space-y-2">
                    <Users className="w-8 h-8 mx-auto text-slate-600" />
                    <h4 className="text-sm font-bold text-white">No registered users in database yet</h4>
                    <p className="text-xs text-slate-500">When users sign up via the Traveler Portal with SMS OTP, their live records will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {liveUsers.map((user) => (
                      <div
                        key={user._id || user.id}
                        className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black text-sm uppercase">
                            {user.name ? user.name.charAt(0) : 'U'}
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {user.isPhoneVerified && (
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                              )}
                            </h4>
                            <p className="text-xs text-slate-400">{user.email}</p>
                            <p className="text-[11px] text-slate-500 font-mono">+91 {user.phone}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-500 block">Joined</span>
                            <span className="text-xs text-slate-300 font-mono">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
                            </span>
                          </div>
                          <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                            {user.isPhoneVerified ? 'SMS OTP Verified' : 'Registered'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Add / Edit Destination Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">
                {editingPlace ? 'Edit Destination in MongoDB' : 'Add New Historical Destination to MongoDB'}
              </h3>
              <p className="text-xs text-slate-400">
                Data saved here will be stored permanently in MongoDB Atlas.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Place Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Trimbakeshwar Shiva Temple"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Badge / Tagline</label>
                  <input
                    type="text"
                    required
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="e.g. Jyotirlinga & Ancient Heritage"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Trimbak, Nashik"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Best Time to Visit</label>
                  <input
                    type="text"
                    required
                    value={formData.bestTime}
                    onChange={(e) => setFormData({ ...formData, bestTime: e.target.value })}
                    placeholder="e.g. Oct - Mar"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Short Overview (Summary)</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short 2-3 sentence overview..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-400 mb-1 flex items-center justify-between">
                  <span>Detailed Description (Full In-Depth 50-Line Heritage Narrative)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Stored in Database</span>
                </label>
                <textarea
                  rows={8}
                  value={formData.detailedDescription || ''}
                  onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                  placeholder="Detailed multi-paragraph history, architecture, spiritual significance, rituals, festival dates, timings, entry tickets, and traveler guidelines..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Key Highlights (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="e.g. 12 Jyotirlingas, Brahmagiri Hill, Kushavarta Kund"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Top Trending Destinations Checkbox */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <label htmlFor="isTopTrendingCheckbox" className="text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Show in "Top Trending Destinations"</span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    When checked, this destination appears in the Top Trending Destinations section on the home page. Unchecked destinations are hidden from trending.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="isTopTrendingCheckbox"
                  checked={formData.isTopTrending}
                  onChange={(e) => setFormData({ ...formData, isTopTrending: e.target.checked })}
                  className="w-5 h-5 rounded text-amber-500 bg-slate-950 border-slate-700 focus:ring-0 cursor-pointer accent-amber-500 shrink-0"
                />
              </div>

              {/* When Editing a specific site, show the extended features inside the Edit dialog */}
              {editingPlace && (
                <div className="pt-6 mt-6 border-t border-slate-800 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400">
                      Advanced Site Features & Media Configuration
                    </h4>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                      Interactive Modules
                    </span>
                  </div>

                  {/* QR Code Section */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
                    <div className="bg-white p-2 rounded-xl shrink-0 w-20 h-20 flex items-center justify-center">
                      {qrLoading ? (
                        <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                      ) : qrDataUrl ? (
                        <img src={qrDataUrl} alt={`QR code for ${editingPlace.name}`} className="w-16 h-16 object-contain" />
                      ) : (
                        <svg className="w-16 h-16 opacity-20" viewBox="0 0 100 100" fill="black">
                          <path d="M0 0h30v30H0zM5 5h20v20H5zM10 10h10v10H10zM70 0h30v30H70zM75 5h20v20H75zM80 10h10v10H80zM0 70h30v30H0zM5 75h20v20H5zM10 80h10v10H10zM35 10h10v10H35zM50 10h10v10H50zM35 25h25v10H35zM10 35h10v25H10zM25 35h10v10H25zM25 50h10v10H25zM70 35h10v10H70zM85 35h15v10H85zM70 50h25v10H70zM35 70h10v25H35zM50 70h10v10H50zM50 85h10v10H50zM70 70h10v10H70zM85 70h15v25H85zM70 85h10v10H70z" />
                        </svg>
                      )}
                    </div>
                    <div className="space-y-1.5 text-center sm:text-left">
                      <p className="text-xs text-slate-300">
                        Visitors scan this from their dashboard to jump straight to this site.
                      </p>
                      {editingPlace.qrCodeValue && (
                        <p className="text-[10px] font-mono text-slate-500 break-all">{editingPlace.qrCodeValue}</p>
                      )}
                      {qrError && <p className="text-[11px] text-rose-400">{qrError}</p>}
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                        {qrDataUrl ? (
                          <a
                            href={getPlaceQrDownloadUrl(editingPlace._id || editingPlace.id)}
                            download
                            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition"
                          >
                            Download QR
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={handleGenerateQr}
                            disabled={qrLoading}
                            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition disabled:opacity-50"
                          >
                            {qrLoading ? 'Generating…' : 'Generate QR'}
                          </button>
                        )}
                        {qrDataUrl && (
                          <button
                            type="button"
                            onClick={handleGenerateQr}
                            disabled={qrLoading}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs shadow transition disabled:opacity-50"
                          >
                            Regenerate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Unique / hidden history */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-200">
                      Unique / hidden history
                    </label>
                    <textarea
                      rows={3}
                      value={formData.hiddenHistory}
                      onChange={(e) => setFormData({ ...formData, hiddenHistory: e.target.value })}
                      placeholder="Enter hidden history and local folklore..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <div className="flex flex-wrap items-center gap-5 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.isPublished !== false}
                          onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-0 accent-emerald-500"
                        />
                        <span className="text-xs font-semibold text-slate-200">
                          Published <span className="text-slate-400 font-normal">(Accessible to users in Search Bar)</span>
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.isTopTrending !== false}
                          onChange={(e) => setFormData({ ...formData, isTopTrending: e.target.checked })}
                          className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-0 accent-amber-500"
                        />
                        <span className="text-xs font-semibold text-slate-200">
                          Top Trending <span className="text-slate-400 font-normal">(Featured on Homepage)</span>
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* 4 Feature Action Accordions */}
                  <div className="space-y-4 pt-2">
                    


                    {/* 2. Visual Timeline (year-by-year slider) */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <h5 className="text-xs font-bold text-white flex items-center gap-2">
                            <span>Visual Timeline (year-by-year slider)</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono">
                              {formData.visualTimeline?.length || 0} milestones
                            </span>
                          </h5>
                          <p className="text-[10px] text-slate-400">
                            Give each photo a year — visitors get a drag-to-slide timeline that jumps to the closest photo as they move the pointer. Photos are kept sorted by year automatically in MongoDB.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setOpenSubSection(openSubSection === 'timeline' ? null : 'timeline')}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shrink-0"
                        >
                          {openSubSection === 'timeline' ? '✕ Close' : '+ Add Timeline Era'}
                        </button>
                      </div>

                      {/* Add / Edit Timeline Item Form */}
                      {openSubSection === 'timeline' && (
                        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 space-y-3 animate-in fade-in">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-amber-400">
                              {editingTimelineIndex !== null ? `Edit Era Milestone #${editingTimelineIndex + 1}` : 'Add Historical Era Photo & Year'}
                            </p>
                            {editingTimelineIndex !== null && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                                Editing Mode
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Year / Century (e.g. 1755, 1200 BCE, 1920)</label>
                              <input
                                type="text"
                                placeholder="e.g. 1755"
                                value={timelineForm.year}
                                onChange={(e) => setTimelineForm({ ...timelineForm, year: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Milestone Title</label>
                              <input
                                type="text"
                                placeholder="e.g. Peshwa Balaji Baji Rao Reconstruction"
                                value={timelineForm.title}
                                onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Historical Photo / Era Image URL</label>
                            <div className="space-y-1.5">
                              <input
                                type="url"
                                placeholder="https://... (or leave empty if real image not available)"
                                value={timelineForm.imageUrl}
                                onChange={(e) => setTimelineForm({ ...timelineForm, imageUrl: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                              />
                              {timelineForm.imageUrl && timelineForm.imageUrl.trim() !== '' && (
                                <div className="flex items-center gap-2 pt-1">
                                  <img
                                    src={timelineForm.imageUrl}
                                    alt="Preview"
                                    className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-700"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                  <span className="text-[11px] text-slate-400">Image preview loaded</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Era Description</label>
                            <textarea
                              rows={2}
                              placeholder="Describe what occurred during this era..."
                              value={timelineForm.description}
                              onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenSubSection(null);
                                setEditingTimelineIndex(null);
                                setTimelineForm({ year: '', title: '', imageUrl: '', description: '' });
                              }}
                              className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleAddTimelineItem}
                              className="px-4 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow"
                            >
                              {editingTimelineIndex !== null ? 'Save Changes' : 'Add Era Milestone'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Render Visual Timeline Items */}
                      {formData.visualTimeline && formData.visualTimeline.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {formData.visualTimeline.map((item, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3 text-xs hover:border-slate-700 transition">
                              {item.imageUrl && item.imageUrl.trim() !== '' ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.title}
                                  className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-700/60"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    if (e.target.nextElementSibling) {
                                      e.target.nextElementSibling.style.display = 'flex';
                                    }
                                  }}
                                />
                              ) : null}
                              <div
                                className={`w-12 h-12 rounded-lg bg-slate-950 border border-dashed border-slate-700 flex-col items-center justify-center text-center shrink-0 p-1 ${
                                  item.imageUrl && item.imageUrl.trim() !== '' ? 'hidden' : 'flex'
                                }`}
                              >
                                <ImageOff className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-[7px] text-slate-400 font-bold leading-tight mt-0.5">No Img</span>
                              </div>
                              <div className="flex-1 min-w-0 space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                                    {item.year}
                                  </span>
                                  <span className="font-bold text-white truncate">{item.title}</span>
                                </div>
                                <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  title="Edit era image & details"
                                  onClick={() => handleStartEditTimeline(item, idx)}
                                  className="text-slate-400 hover:text-amber-400 p-1 rounded-lg hover:bg-slate-800 transition"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  title="Delete timeline item"
                                  onClick={() => handleRemoveTimelineItem(idx)}
                                  className="text-slate-400 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 3. Nearby Places To Visit */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-white flex items-center gap-2">
                            <span>Nearby Places To Visit</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono">
                              {formData.nearbyPlaces?.length || 0} places
                            </span>
                          </h5>
                          <p className="text-[10px] text-slate-400">Recommended stops within 15km stored in database</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (openSubSection === 'nearby') {
                              setOpenSubSection(null);
                              setEditingNearbyIndex(null);
                            } else {
                              setEditingNearbyIndex(null);
                              setNearbyForm({ name: '', distance: '2.5 km', imageUrl: '', category: 'Heritage' });
                              setOpenSubSection('nearby');
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                        >
                          {openSubSection === 'nearby' ? '✕ Close' : '+ Add Nearby Place'}
                        </button>
                      </div>

                      {/* Add / Edit Nearby Place Form */}
                      {openSubSection === 'nearby' && (
                        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 space-y-3 animate-in fade-in">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-amber-400">
                              {editingNearbyIndex !== null ? `Edit Nearby Attraction #${editingNearbyIndex + 1}` : 'Add Nearby Attraction'}
                            </p>
                            {editingNearbyIndex !== null && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                                Editing Mode
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Place Name</label>
                              <input
                                type="text"
                                placeholder="e.g. Kushavarta Kund"
                                value={nearbyForm.name}
                                onChange={(e) => setNearbyForm({ ...nearbyForm, name: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Distance</label>
                              <input
                                type="text"
                                placeholder="e.g. 500 meters or 4.2 km"
                                value={nearbyForm.distance}
                                onChange={(e) => setNearbyForm({ ...nearbyForm, distance: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Category</label>
                              <input
                                type="text"
                                placeholder="e.g. Holy Water Reservoir"
                                value={nearbyForm.category}
                                onChange={(e) => setNearbyForm({ ...nearbyForm, category: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Nearby Attraction Image URL</label>
                            <div className="space-y-1.5">
                              <input
                                type="url"
                                placeholder="https://..."
                                value={nearbyForm.imageUrl}
                                onChange={(e) => setNearbyForm({ ...nearbyForm, imageUrl: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                              />
                              {nearbyForm.imageUrl && nearbyForm.imageUrl.trim() !== '' && (
                                <div className="flex items-center gap-2 pt-1">
                                  <img
                                    src={nearbyForm.imageUrl}
                                    alt="Preview"
                                    className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-700"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                  <span className="text-[11px] text-slate-400">Image preview loaded</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenSubSection(null);
                                setEditingNearbyIndex(null);
                                setNearbyForm({ name: '', distance: '2.5 km', imageUrl: '', category: 'Heritage' });
                              }}
                              className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleAddNearbyPlace}
                              className="px-4 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow"
                            >
                              {editingNearbyIndex !== null ? 'Save Changes' : 'Add Nearby Place'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Render Nearby Places */}
                      {formData.nearbyPlaces && formData.nearbyPlaces.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {formData.nearbyPlaces.map((item, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs hover:border-slate-700 transition">
                              {item.imageUrl && item.imageUrl.trim() !== '' ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-700/60"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    if (e.target.nextElementSibling) {
                                      e.target.nextElementSibling.style.display = 'flex';
                                    }
                                  }}
                                />
                              ) : null}
                              <div
                                className={`w-10 h-10 rounded-lg bg-slate-950 border border-dashed border-slate-700 flex-col items-center justify-center text-center shrink-0 p-0.5 ${
                                  item.imageUrl && item.imageUrl.trim() !== '' ? 'hidden' : 'flex'
                                }`}
                              >
                                <ImageOff className="w-3 h-3 text-slate-500" />
                                <span className="text-[6px] text-slate-400 font-bold leading-tight">No Img</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-white truncate">{item.name}</p>
                                <p className="text-[11px] text-amber-400">{item.distance} • <span className="text-slate-400">{item.category}</span></p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  title="Edit nearby place image & details"
                                  onClick={() => handleStartEditNearby(item, idx)}
                                  className="text-slate-400 hover:text-amber-400 p-1 rounded-lg hover:bg-slate-800 transition"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  title="Delete nearby place"
                                  onClick={() => handleRemoveNearbyPlace(idx)}
                                  className="text-slate-400 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 4. Co-Related Places */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-white flex items-center gap-2">
                            <span>Co-Related Places</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono">
                              {formData.coRelatedPlaces?.length || 0} links
                            </span>
                          </h5>
                          <p className="text-[10px] text-slate-400">Monuments sharing historical heritage circuits stored in database</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (openSubSection === 'corelated') {
                              setOpenSubSection(null);
                              setEditingCoRelatedIndex(null);
                            } else {
                              setEditingCoRelatedIndex(null);
                              setCoRelatedForm({ name: '', circuit: 'Ramayana Circuit', imageUrl: '', connection: 'Shared pilgrimage & heritage route' });
                              setOpenSubSection('corelated');
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                        >
                          {openSubSection === 'corelated' ? '✕ Close' : '+ Link Related Place'}
                        </button>
                      </div>

                      {/* Add / Edit Co-Related Place Form */}
                      {openSubSection === 'corelated' && (
                        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 space-y-3 animate-in fade-in">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-amber-400">
                              {editingCoRelatedIndex !== null ? `Edit Related Monument #${editingCoRelatedIndex + 1}` : 'Link Co-Related Historical Monument'}
                            </p>
                            {editingCoRelatedIndex !== null && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                                Editing Mode
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Place Name</label>
                              <input
                                type="text"
                                placeholder="e.g. Grishneshwar Jyotirlinga (Verul)"
                                value={coRelatedForm.name}
                                onChange={(e) => setCoRelatedForm({ ...coRelatedForm, name: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Circuit / Route</label>
                              <input
                                type="text"
                                placeholder="e.g. 12 Jyotirlinga Circuit / Maharashtra Heritage"
                                value={coRelatedForm.circuit}
                                onChange={(e) => setCoRelatedForm({ ...coRelatedForm, circuit: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Monument Image URL</label>
                            <div className="space-y-1.5">
                              <input
                                type="url"
                                placeholder="https://..."
                                value={coRelatedForm.imageUrl}
                                onChange={(e) => setCoRelatedForm({ ...coRelatedForm, imageUrl: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                              />
                              {coRelatedForm.imageUrl && coRelatedForm.imageUrl.trim() !== '' && (
                                <div className="flex items-center gap-2 pt-1">
                                  <img
                                    src={coRelatedForm.imageUrl}
                                    alt="Preview"
                                    className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-700"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                  <span className="text-[11px] text-slate-400">Image preview loaded</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Heritage Connection / Synergy</label>
                            <input
                              type="text"
                              placeholder="e.g. Connected through River Godavari and Ahilyabai Holkar restorations"
                              value={coRelatedForm.connection}
                              onChange={(e) => setCoRelatedForm({ ...coRelatedForm, connection: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenSubSection(null);
                                setEditingCoRelatedIndex(null);
                                setCoRelatedForm({ name: '', circuit: 'Ramayana Circuit', imageUrl: '', connection: 'Shared pilgrimage & heritage route' });
                              }}
                              className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleAddCoRelatedPlace}
                              className="px-4 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow"
                            >
                              {editingCoRelatedIndex !== null ? 'Save Changes' : 'Link Place'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Render Co-Related Places */}
                      {formData.coRelatedPlaces && formData.coRelatedPlaces.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {formData.coRelatedPlaces.map((item, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs hover:border-slate-700 transition">
                              {item.imageUrl && item.imageUrl.trim() !== '' ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-700/60"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    if (e.target.nextElementSibling) {
                                      e.target.nextElementSibling.style.display = 'flex';
                                    }
                                  }}
                                />
                              ) : null}
                              <div
                                className={`w-10 h-10 rounded-lg bg-slate-950 border border-dashed border-slate-700 flex-col items-center justify-center text-center shrink-0 p-0.5 ${
                                  item.imageUrl && item.imageUrl.trim() !== '' ? 'hidden' : 'flex'
                                }`}
                              >
                                <ImageOff className="w-3 h-3 text-slate-500" />
                                <span className="text-[6px] text-slate-400 font-bold leading-tight">No Img</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-white truncate">{item.name}</p>
                                <p className="text-[11px] text-amber-400">{item.circuit}</p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  title="Edit related place image & details"
                                  onClick={() => handleStartEditCoRelated(item, idx)}
                                  className="text-slate-400 hover:text-amber-400 p-1 rounded-lg hover:bg-slate-800 transition"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  title="Delete related place"
                                  onClick={() => handleRemoveCoRelatedPlace(idx)}
                                  className="text-slate-400 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wide shadow-lg shadow-amber-500/25 transition flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingPlace ? 'Save Changes' : 'Add Destination'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
