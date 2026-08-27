import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  ExternalLink,
  Globe,
  Star,
  ShieldCheck,
  Clock,
  Sparkles,
  Compass,
  Link as LinkIcon,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Image as ImageIcon,
  Navigation,
  ImageOff,
  PlusCircle,
  Check,
  Loader2,
  Eye,
  Layers,
  Map as MapIcon,
} from 'lucide-react';

export default function PlaceDetailModal({
  place,
  onClose,
  isAdmin = false,
  onSaveToSiteInfo,
  isSavingSite = false,
  isSavedToSite = false
}) {
  if (!place) return null;

  // Detailed Description accordion/dropdown toggle state
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  // Publish state when adding to sites (accessible to users)
  const [publishToUsers, setPublishToUsers] = useState(true);

  // Audio narration state for Detailed Description
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPausedAudio, setIsPausedAudio] = useState(false);
  const audioPlayerRef = React.useRef(null);

  // Cleanup audio on modal close or unmount
  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
    };
  }, []);

  const getActiveLanguage = () => {
    try {
      if (window.__sih_current_lang && window.__sih_current_lang !== 'en') {
        return window.__sih_current_lang;
      }
      const saved = localStorage.getItem('sih_selected_lang');
      if (saved && saved !== 'en') {
        return saved;
      }
      const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
      if (match && match[1]) {
        const parts = match[1].split('/');
        const code = parts[parts.length - 1];
        if (code && code !== 'en' && code !== 'auto') return code;
      }
      const selectElem = document.querySelector('#google_translate_element_hidden select.goog-te-combo');
      if (selectElem && selectElem.value && selectElem.value !== 'en') {
        return selectElem.value;
      }
    } catch (e) {
      console.warn('Lang detect error', e);
    }
    return localStorage.getItem('sih_selected_lang') || 'en';
  };

  const handleTogglePlayDetailedAudio = () => {
    // 1. If currently playing, toggle Pause / Resume
    if (isPlayingAudio && audioPlayerRef.current) {
      if (isPausedAudio) {
        audioPlayerRef.current
          .play()
          .then(() => setIsPausedAudio(false))
          .catch((err) => console.warn('Resume error:', err));
      } else {
        audioPlayerRef.current.pause();
        setIsPausedAudio(true);
      }
      return;
    }

    // 2. Fresh play: Stop existing audio
    handleStopDetailedAudio();

    // Read live translated text from DOM (Google Translate injects <font> or <span> tags)
    const openDescElem = document.getElementById('place-modal-description-text');
    const fallbackDescElem = document.getElementById('place-modal-description-text-fallback');
    const titleElem = document.getElementById('place-modal-title-text');

    const getCleanNodeText = (el) => {
      if (!el) return '';
      // Prefer innerText as it contains what Google Translate mutated in the DOM
      return el.innerText ? el.innerText.trim() : (el.textContent ? el.textContent.trim() : '');
    };

    const titleText = getCleanNodeText(titleElem) || place.name || '';
    
    let descText = getCleanNodeText(openDescElem);
    if (!descText || descText.length === 0) {
      descText = getCleanNodeText(fallbackDescElem);
    }
    if (!descText || descText.length === 0) {
      descText = place.detailedDescription || place.description || '';
    }

    const screenText = `${titleText}. ${descText}`.replace(/\s+/g, ' ').trim();
    if (!screenText) return;

    const currentLang = getActiveLanguage();

    setIsPlayingAudio(true);
    setIsPausedAudio(false);

    // Fetch the audio blob via POST to avoid browser URL length and header size limits (fixes ERR_FAILED 431)
    fetch((import.meta.env.DEV ? 'http://localhost:5001' : '') + '/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: screenText,
        lang: currentLang,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`TTS server responded with status: ${res.status}`);
        }
        return res.blob();
      })
      .then((blob) => {
        const audioBlobUrl = URL.createObjectURL(blob);
        const audio = new Audio();
        audio.src = audioBlobUrl;
        audioPlayerRef.current = audio;

        audio.onplay = () => {
          setIsPlayingAudio(true);
          setIsPausedAudio(false);
        };

        audio.onended = () => {
          setIsPlayingAudio(false);
          setIsPausedAudio(false);
          URL.revokeObjectURL(audioBlobUrl);
          audioPlayerRef.current = null;
        };

        audio.onerror = (err) => {
          console.warn('Audio playback error:', err);
          setIsPlayingAudio(false);
          setIsPausedAudio(false);
          URL.revokeObjectURL(audioBlobUrl);
          audioPlayerRef.current = null;
        };

        return audio.play();
      })
      .catch((err) => {
        console.warn('Detailed description audio error:', err);
        setIsPlayingAudio(false);
        setIsPausedAudio(false);
        audioPlayerRef.current = null;
      });
  };

  const handleStopDetailedAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
  };

  // 3D Map / Satellite / Street View toggle ('none' | 'satellite' | 'map' | 'streetview')
  const [activeMapView, setActiveMapView] = useState(null);

  // Timeline slider index
  const timelineItems = Array.isArray(place.visualTimeline) ? place.visualTimeline : [];
  const [timelineIndex, setTimelineIndex] = useState(0);

  // Nearby & Co-related places
  const nearbyPlaces = Array.isArray(place.nearbyPlaces) ? place.nearbyPlaces : [];
  const coRelatedPlaces = Array.isArray(place.coRelatedPlaces) ? place.coRelatedPlaces : [];

  // Determine web URL if available or generate search URL
  const destinationWebUrl =
    place.webUrl ||
    `https://en.wikipedia.org/wiki/${encodeURIComponent(place.name.replace(/\s+/g, '_'))}`;

  const searchGoogleUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `${place.name} ${place.location} tourism guide timings history`
  )}`;

  const currentTimelineEra = timelineItems[timelineIndex] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header Image */}
        <div className="place-modal-header relative h-64 sm:h-72 w-full bg-slate-800 shrink-0">
          <img
            src={place.image}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/20" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-900 transition shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 font-black text-[11px] tracking-wider uppercase shadow-md flex items-center gap-1">
              <Star className="w-3 h-3 fill-slate-950" /> {place.rating || '4.9'} ({place.reviews || '1.2k'}+ Reviews)
            </span>
          </div>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {place.tag || 'Heritage & Cultural Tourism'}
            </span>
            <h2 id="place-modal-title-text" className="text-2xl sm:text-3xl font-extrabold text-white mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {place.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-white/90 mt-1.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{place.location}</span>
            </div>
          </div>
        </div>

        {/* Body Details */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* About Destination */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>About Destination</span>
            </h4>
            <p id="place-modal-overview-text" className="text-sm text-slate-200 leading-relaxed">
              {place.description}
            </p>
          </div>

          {/* Hidden / Unique History (if stored) */}
          {place.hiddenHistory && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Unique & Hidden History
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{place.hiddenHistory}"
              </p>
            </div>
          )}

          {/* Key Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Best Season</span>
              <span className="text-xs font-extrabold text-white mt-0.5 block">{place.bestTime || 'Oct - March'}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 col-span-2 sm:col-span-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Managed Authority</span>
              <span className="text-xs font-bold text-amber-400 truncate block mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{place.host || 'Registered Tourism Trust / ASI'}</span>
              </span>
            </div>
          </div>

          {/* Interactive 3D / Satellite Map & Street View Explorer */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-amber-400" />
                  <span>3D Map & Street View Navigation</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Explore satellite terrain, live 3D contours, and navigate street-level vistas.
                </p>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveMapView(activeMapView === 'satellite' ? null : 'satellite')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    activeMapView === 'satellite'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>3D / Satellite</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMapView(activeMapView === 'streetview' ? null : 'streetview')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    activeMapView === 'streetview'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Street View 360°</span>
                </button>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${place.name}, ${place.location || 'India'}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 hover:border-amber-500 flex items-center gap-1.5 transition"
                  title="Open in Google Maps"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate</span>
                </a>
              </div>
            </div>

            {/* Embedded Live Map View Container */}
            {activeMapView && (
              <div className="relative w-full h-72 sm:h-80 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 animate-in fade-in zoom-in-95 duration-200">
                <iframe
                  title={`${place.name} 3D Map Explorer`}
                  width="100%"
                  height="100%"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  src={
                    activeMapView === 'satellite'
                      ? `https://maps.google.com/maps?q=${encodeURIComponent(`${place.name}, ${place.location || 'India'}`)}&t=k&z=17&ie=UTF8&iwloc=&output=embed`
                      : `https://maps.google.com/maps?q=${encodeURIComponent(`${place.name}, ${place.location || 'India'}`)}&t=h&z=18&layer=c&cbll=&output=embed`
                  }
                />

                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <a
                    href={
                      activeMapView === 'streetview'
                        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name}, ${place.location || 'India'}`)}`
                        : `https://earth.google.com/web/search/${encodeURIComponent(`${place.name}, ${place.location || 'India'}`)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-slate-700/80 hover:bg-slate-900 flex items-center gap-1 shadow-md"
                  >
                    <span>{activeMapView === 'streetview' ? 'Open Full 360°' : 'Open in Google Earth 3D'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Key Highlights / Key Features */}
          {place.highlights && place.highlights.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Key Features & Highlights</h4>
              <div className="flex flex-wrap gap-2">
                {place.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-300 flex items-center gap-1"
                  >
                    <span className="text-amber-400">✓</span> {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comprehensive Detailed Information (Interactive Collapsible Dropdown + Voice Reader) */}
          <div className="rounded-2xl bg-slate-950/90 border border-slate-800 overflow-hidden transition-all duration-300">
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40">
              
              {/* Accordion Click Area */}
              <div
                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                className="flex items-center gap-2.5 cursor-pointer flex-1 group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition flex items-center gap-1.5">
                    <span>Detailed Description (In-Depth Heritage & Tourist Guide)</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isDescriptionOpen ? 'Click to collapse text view' : 'Click to expand text / listen to audio guide in your selected language'}
                  </p>
                </div>
              </div>

              {/* Dropdown Toggle Action Bar */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {/* Read / Expand Button */}
                <button
                  type="button"
                  onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
                >
                  <span>{isDescriptionOpen ? 'Hide' : 'Read More'}</span>
                  {isDescriptionOpen ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Collapsible Dropdown Body (Visible when Read More is expanded) */}
            <div className={`px-5 pb-5 pt-3 border-t border-slate-800/80 transition-all duration-300 ${isDescriptionOpen ? 'block' : 'hidden'}`}>
              
              {/* Audio Control Bar inside the expanded descriptive information block */}
              <div className="mb-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Voice Audio Narration</span>
                    <span className="text-[10px] text-slate-400 block">Listen to this detailed guide in your selected language</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Listen Audio / Pause / Resume Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePlayDetailedAudio();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
                      isPlayingAudio
                        ? isPausedAudio
                          ? 'bg-amber-500 text-slate-950 shadow-amber-500/20 hover:bg-amber-400'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 animate-pulse'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20 active:scale-95'
                    }`}
                    title={isPlayingAudio ? (isPausedAudio ? 'Resume Audio' : 'Pause Audio') : 'Listen to this detailed guide'}
                  >
                    {isPlayingAudio ? (
                      isPausedAudio ? (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Resume</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause</span>
                        </>
                      )
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen Audio</span>
                      </>
                    )}
                  </button>

                  {/* Stop Audio Button */}
                  {isPlayingAudio && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStopDetailedAudio();
                      }}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition cursor-pointer"
                      title="Stop Audio"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Full Detailed Description Text - Wrapped in stable span to prevent React reconciliation clashes with Google Translate DOM mutations */}
              <div
                id="place-modal-description-text"
                className="text-xs text-slate-300 leading-loose space-y-3 font-normal whitespace-pre-line max-h-96 overflow-y-auto pr-2 custom-scrollbar"
                suppressHydrationWarning
              >
                <span>
                  {place.detailedDescription || place.description || 'Discover history, culture, architectural wonders, and travel advice for this destination.'}
                </span>
              </div>
            </div>

            {/* Permanent translated reference node for Google Translate */}
            <div id="place-modal-description-text-fallback" className="sr-only" aria-hidden="true" suppressHydrationWarning>
              <span>{place.detailedDescription || place.description || ''}</span>
            </div>
          </div>

          {/* Visual Timeline (Year-by-Year Slider) */}
          {timelineItems.length > 0 && currentTimelineEra && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Visual Timeline (Year-by-Year Era Slider)</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">Slide to travel through historical eras of {place.name}</p>
                </div>
                <span className="text-xs font-black text-amber-400 font-mono px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                  {timelineIndex + 1} / {timelineItems.length}
                </span>
              </div>

              {/* Slider Input */}
              <div className="space-y-2">
                <input
                  type="range"
                  min={0}
                  max={timelineItems.length - 1}
                  value={timelineIndex}
                  onChange={(e) => setTimelineIndex(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>{timelineItems[0]?.year}</span>
                  <span>{timelineItems[timelineItems.length - 1]?.year}</span>
                </div>
              </div>

              {/* Active Era Card */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
                {currentTimelineEra.imageUrl && currentTimelineEra.imageUrl.trim() !== '' ? (
                  <img
                    src={currentTimelineEra.imageUrl}
                    alt={currentTimelineEra.title}
                    className="w-full sm:w-36 h-28 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-700/60"
                    onError={(e) => {
                      // If the provided real URL fails to load, gracefully display fallback
                      e.target.style.display = 'none';
                      if (e.target.nextElementSibling) {
                        e.target.nextElementSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}

                {/* Graceful 'Image Not Available' Fallback Box */}
                <div
                  className={`w-full sm:w-36 h-28 rounded-lg bg-slate-950/70 border border-dashed border-slate-700/80 flex-col items-center justify-center p-3 text-center shrink-0 gap-1.5 ${
                    currentTimelineEra.imageUrl && currentTimelineEra.imageUrl.trim() !== '' ? 'hidden' : 'flex'
                  }`}
                >
                  <ImageOff className="w-6 h-6 text-amber-400/70" />
                  <span className="text-[10px] font-bold text-slate-400 leading-tight">
                    Real Image Not Available
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    {currentTimelineEra.year} Era
                  </span>
                </div>

                <div className="space-y-1 text-center sm:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs font-mono">
                      {currentTimelineEra.year}
                    </span>
                    <h5 className="text-sm font-bold text-white">{currentTimelineEra.title}</h5>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentTimelineEra.description}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1">
                <button
                  disabled={timelineIndex === 0}
                  onClick={() => setTimelineIndex((prev) => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-xs text-slate-300 font-semibold flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous Era
                </button>
                <button
                  disabled={timelineIndex === timelineItems.length - 1}
                  onClick={() => setTimelineIndex((prev) => Math.min(timelineItems.length - 1, prev + 1))}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-xs text-slate-300 font-semibold flex items-center gap-1"
                >
                  Next Era <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 3. Nearby Places To Visit */}
          {nearbyPlaces.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>Nearby Places To Visit (Within 15km)</span>
                </h4>
                <span className="text-[10px] text-slate-400">Click to navigate</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nearbyPlaces.map((np, idx) => {
                  // Construct destination query for Google Maps navigation
                  const navQuery = encodeURIComponent(`${np.name}, ${place.location || 'India'}`);
                  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${navQuery}`;

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden min-w-0">
                        {np.imageUrl ? (
                          <img
                            src={np.imageUrl}
                            alt={np.name}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5" />
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <h5 className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                            {np.name}
                          </h5>
                          <p className="text-[11px] text-amber-400 truncate">
                            {np.distance} • <span className="text-slate-400">{np.category}</span>
                          </p>
                        </div>
                      </div>

                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title={`Navigate to ${np.name}`}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 hover:border-amber-500 text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-all shadow-sm"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">Directions</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Co-Related Places */}
          {coRelatedPlaces.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-amber-400" />
                <span>Co-Related Historical Circuits & Heritage Links</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coRelatedPlaces.map((cr, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-white truncate">{cr.name}</h5>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-400 font-bold">
                        {cr.circuit}
                      </span>
                    </div>
                    {cr.connection && (
                      <p className="text-[11px] text-slate-400 leading-snug">{cr.connection}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Web Knowledge & External Pages Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>Live Destination Web Resource</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Explore real-time encyclopedia articles, historical archives, and guide pages on the web.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={destinationWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black tracking-wide uppercase transition shadow-md shadow-amber-500/20"
              >
                <span>Read Web Guide</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={searchGoogleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
                title="Search live web info"
              >
                <span>Google</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
            {/* Admin Quick Save to Sites with Publish Toggle */}
            {isAdmin && onSaveToSiteInfo ? (
              <div className="w-full sm:w-auto flex flex-wrap items-center gap-3">
                {isSavedToSite ? (
                  <span className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Added to Sites Database!</span>
                  </span>
                ) : (
                  <div className="flex flex-wrap items-center gap-3 bg-slate-950/70 p-1.5 px-3 rounded-2xl border border-slate-800">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={publishToUsers}
                        onChange={(e) => setPublishToUsers(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-0 accent-amber-500 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-200">
                        Publish <span className="text-[11px] text-slate-400 font-normal">(Accessible to Users on Website)</span>
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => onSaveToSiteInfo({ ...place, isTopTrending: publishToUsers })}
                      disabled={isSavingSite}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wide shadow-md shadow-amber-500/20 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      {isSavingSite ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving to Sites...</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Add to Sites</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : <div />}

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

