import React from 'react';
import { Volume2, Shield } from 'lucide-react';

export const RockFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#050507] border-t border-neutral-800 text-neutral-400 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-4 bg-[#ff1744] inline-block skew-x-[-12deg]" />
            <span className="font-punch font-extrabold text-xl text-white tracking-widest">
              RECLAIM THE DAY
            </span>
          </div>
          <p className="text-xs font-punch text-neutral-500">
            HIGH VOLTAGE JAPANESE ROCK EXPERIENCE // TOKYO RIOT OFFICIAL
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 text-xs font-punch font-bold tracking-wider text-neutral-400">
          <a href="#stage" className="hover:text-white transition-colors">STAGE LIVE</a>
          <a href="#lyrics" className="hover:text-white transition-colors">SYNC LYRICS</a>
          <a href="#amprack" className="hover:text-white transition-colors">AMP & RIG</a>
          <a href="#soundboard" className="hover:text-white transition-colors">SOUNDBOARD</a>
          <a href="#tour" className="hover:text-white transition-colors">TOUR DATES</a>
          <a href="#merch" className="hover:text-white transition-colors">OFFICIAL MERCH</a>
        </div>

        {/* Audio Advisory */}
        <div className="flex items-center gap-2 text-xs font-punch text-neutral-500 border border-neutral-800 px-3 py-1.5 bg-[#0a0a0d]">
          <Volume2 className="w-4 h-4 text-[#ff1744]" />
          <span>LOUD GUITAR ADVISORY: 爆音推奨</span>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-neutral-900 text-center text-xs font-punch text-neutral-600">
        &copy; 2024-2025 TOKYO RIOT & RECLAIM THE DAY. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
};
