import React from 'react';
import { Sparkles, Landmark, Trees, Castle, Mountain, ShieldCheck, Compass, Map } from 'lucide-react';

const iconMap = {
  Sparkles,
  Landmark,
  Trees,
  Castle,
  Mountain,
  ShieldCheck,
  Compass,
  Map,
};

export default function CategoryFilter({ categories, activeCategory, setActiveCategory }) {
  return (
    <section className="sticky top-20 z-40 bg-slate-950/95 backdrop-blur-md border-y border-slate-800 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 justify-start md:justify-center">
          {categories.map((cat) => {
            const IconComp = iconMap[cat.icon] || Compass;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 border ${isActive
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
