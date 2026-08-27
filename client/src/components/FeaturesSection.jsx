import React from 'react';
import { ShieldCheck, Compass, Map } from 'lucide-react';

const iconMap = {
  ShieldCheck,
  Compass,
  Map,
};

export default function FeaturesSection({ features }) {
  return (
    <section className="py-16 bg-slate-900/60 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            Platform Features
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Empowering Travelers & Local Hosts
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const FeatIcon = iconMap[feat.icon] || ShieldCheck;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <FeatIcon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
