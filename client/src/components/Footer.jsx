import React from 'react';
import { Compass, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer({ onHostDashboardClick }) {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                <Compass className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-lg font-black text-white">Team Phoenix</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering meaningful travel across India by connecting passionate explorers with local destination hosts.
            </p>
          </div>

          {/* Host Portal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Host Community</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-amber-400 cursor-pointer" onClick={onHostDashboardClick}>Host Dashboard</li>
              <li className="hover:text-amber-400 cursor-pointer">List a New Historical Site</li>
              <li className="hover:text-amber-400 cursor-pointer">Host Guidelines</li>
              <li className="hover:text-amber-400 cursor-pointer">Verification Process</li>
            </ul>
          </div>

          {/* Contact section directly as in your sketch */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Contact Us</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+91 8999515737 / Phoenix Helpdesk</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>support@phoenix.org</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span> Tourism Hub India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© {new Date().getFullYear()}Phoenix Tourism Portal. All rights reserved.</p>
          <p>Designed with React & Tailwind CSS for SIH Tourism Innovation</p>
        </div>
      </div>
    </footer>
  );
}

