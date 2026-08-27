import React from 'react';
import { AlertTriangle, ShieldCheck, Info, Compass } from 'lucide-react';

export default function DisclaimerSection({ theme = 'dark' }) {
  const isLight = theme === 'light';

  const disclaimers = [
    {
      icon: AlertTriangle,
      title: 'Team Pheonix Ai & Information Disclaimer',
      desc: 'AI generated images are prone to errors in images. It is a purely technical glitch and not intented to harm the sentiments of any indivisual or community.'
    },
    {
      icon: AlertTriangle,
      title: 'General Travel & Information Disclaimer',
      desc: 'All destination information, visiting timings, entry fees, and route suggestions provided on this portal are taken from google .Visitors are advised to cross-verify local opening hours and on-ground guidelines prior to traveling.'
    },
    {
      icon: ShieldCheck,
      title: 'Local Regulations & Safety Advice',
      desc: 'Travelers are strictly requested to respect monument guidelines, heritage preservation rules, wildlife reserve norms, and local customs. The platform is not liable for itinerary disruptions, weather advisories, or restricted entries.'
    },
    {
      icon: Compass,
      title: 'Third-Party & Navigation Services',
      desc: 'External links, map directions, transport details, and accommodation references are provided for convenience. Team Phoenix does not endorse or control third-party service providers.'
    }
  ];

  return (
    <section
      className={`py-12 border-t transition-colors duration-300 ${isLight
          ? 'bg-slate-50 border-slate-200'
          : 'bg-slate-950/80 border-slate-800/80'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${isLight
              ? 'bg-white border-slate-200/90 shadow-xl shadow-slate-200/60'
              : 'bg-gradient-to-b from-slate-900/90 to-slate-950 border-amber-500/20 shadow-xl shadow-black/40'
            }`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isLight
                  ? 'bg-amber-50 border border-amber-300/80 text-amber-700'
                  : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                }`}
            >
              <Info className="w-5 h-5" />
            </div>
            <div>
              <span
                className={`text-xs uppercase tracking-widest font-bold ${isLight ? 'text-amber-700' : 'text-amber-400'
                  }`}
              >
                Important Notice
              </span>
              <h3
                className={`text-lg sm:text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'
                  }`}
              >
                Platform & Travel Disclaimers
              </h3>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {disclaimers.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-xl border transition-all duration-200 space-y-2.5 ${isLight
                      ? 'bg-slate-50/80 border-slate-200 hover:border-amber-400/60 hover:bg-white hover:shadow-md'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-amber-500/30'
                    }`}
                >
                  <div
                    className={`flex items-center gap-2.5 ${isLight ? 'text-amber-700' : 'text-amber-400'
                      }`}
                  >
                    <IconComp className="w-4 h-4 shrink-0" />
                    <h4
                      className={`text-sm font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'
                        }`}
                    >
                      {item.title}
                    </h4>
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'
                      }`}
                  >
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div
            className={`mt-6 pt-4 border-t flex flex-col sm:flex-row items-center justify-between text-[11px] gap-2 ${isLight
                ? 'border-slate-200 text-slate-500'
                : 'border-slate-800/60 text-slate-500'
              }`}
          >
            <span>
              By utilizing this portal, you acknowledge and agree to adhere to standard safety and tourism regulations.
            </span>
            <span
              className={`font-semibold ${isLight ? 'text-amber-700' : 'text-amber-400'
                }`}
            >
              SIH Tourism Safety Initiative
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
