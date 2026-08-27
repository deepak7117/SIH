import React from 'react';
import { Star, MapPin, ArrowRight, Compass, Sparkles } from 'lucide-react';

export default function DestinationsGrid({
  places,
  onSelectPlace,
  onResetFilters
}) {
  return (
    <section id="destinations" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" /> Curated By Host Community
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Top Trending Destinations
          </h2>
        </div>
        <p className="text-sm text-slate-400 max-w-md">
          Discover sacred temples, Buddhist caves, and cliff-side Sahyadri treks with detailed host-managed guides.
        </p>
      </div>

      {/* Destinations Grid */}
      {places.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
          <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-lg font-medium text-slate-300">No Top Trending destinations currently marked.</p>
          <p className="text-xs text-slate-500 mt-1">Destinations can be marked as Top Trending from the Admin Dashboard.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {places.map((place) => {
            const placeId = place._id || place.id;

            return (
              <div
                key={placeId}
                onClick={() => onSelectPlace(place)}
                className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-amber-500/50 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-slate-800">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                    {/* Tag badge */}
                    <div className="card-photo-tag absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-amber-400/40 text-[10px] uppercase font-bold tracking-wider text-amber-300 shadow-md">
                      {place.tag}
                    </div>

                    {/* Rating badge */}
                    <div className="card-photo-rating absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-xs font-bold text-white flex items-center gap-1 shadow-md">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{place.rating}</span>
                      <span className="text-[10px] text-slate-300 font-normal">({place.reviews})</span>
                    </div>

                    {/* Location strip */}
                    <div className="card-location-strip absolute bottom-3 left-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-xs font-semibold text-slate-100 shadow-lg">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{place.location}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 id={`card-title-${placeId}`} className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                        {place.name}
                      </h3>
                    </div>

                    {/* Card Description */}
                    <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/60">
                      <p id={`card-desc-${placeId}`} className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {place.description || place.detailedDescription || 'Explore detailed information, history, and travel guide by opening this destination.'}
                      </p>
                    </div>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {Array.isArray(place.highlights) && place.highlights.slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-slate-800/80 text-[11px] font-medium text-slate-300 border border-slate-700/40"
                        >
                          • {item}
                        </span>
                      ))}
                    </div>

                    {/* Dedicated Visual Preview for Google Nearby Places */}
                    {place.nearbyPlaces?.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                        <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Nearby Places (Within 15km):</span>
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono">
                            {place.nearbyPlaces.length} Spots
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {place.nearbyPlaces.slice(0, 2).map((near, idx) => {
                            const navQuery = encodeURIComponent(`${near.name}, ${place.location || 'India'}`);
                            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${navQuery}`;

                            return (
                              <a
                                key={idx}
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                title={`Navigate to ${near.name}`}
                                className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-amber-500/50 hover:bg-slate-900/90 flex items-center justify-between gap-2 transition group/np"
                              >
                                <div className="flex items-center gap-2 overflow-hidden min-w-0">
                                  {near.imageUrl ? (
                                    <img
                                      src={near.imageUrl}
                                      alt={near.name}
                                      className="w-8 h-8 rounded-lg object-cover bg-slate-800 shrink-0"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs shrink-0">
                                      📍
                                    </div>
                                  )}
                                  <div className="overflow-hidden">
                                    <h6 className="text-[11px] font-bold text-slate-200 group-hover/np:text-amber-400 truncate">
                                      {near.name}
                                    </h6>
                                    <p className="text-[10px] text-amber-400/90 font-mono truncate">
                                      {near.distance || 'Nearby'}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-[10px] text-slate-400 group-hover/np:text-amber-400 font-bold shrink-0">
                                  ↗
                                </span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Dedicated Visual Preview for Co-Related Heritage Circuits */}
                    {place.coRelatedPlaces?.length > 0 && (
                      <div className="space-y-1.5 pt-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-blue-400">
                          <span className="flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5" />
                            <span>Co-Related Heritage Circuits:</span>
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono font-semibold">
                            {place.coRelatedPlaces.length} Circuits
                          </span>
                        </div>
                        <div className="space-y-1">
                          {place.coRelatedPlaces.slice(0, 1).map((rel, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-blue-950/20 border border-blue-900/30 flex items-center justify-between gap-2 transition-colors"
                            >
                              <div className="overflow-hidden min-w-0">
                                <p className="text-xs font-bold text-blue-200 truncate">{rel.name}</p>
                                <p className="text-[10px] text-blue-300/80 font-medium truncate">{rel.circuit}</p>
                              </div>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 shrink-0 border border-blue-500/20">
                                Linked
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer / Host info */}
                <div className="px-5 py-3.5 border-t border-slate-800/60 bg-slate-950/40 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Host: <strong className="text-slate-200">{place.host}</strong></span>
                  </div>
                  <button className="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>View Info</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
