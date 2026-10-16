import React from 'react';
import { Volume2, Ticket, Flame } from 'lucide-react';

interface RockHeaderProps {
  onOpenTicket: () => void;
  adrenaline: number;
}

export const RockHeader: React.FC<RockHeaderProps> = ({ onOpenTicket, adrenaline }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#08080a]/95 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#stage" 
          className="text-xl sm:text-2xl font-punch font-extrabold tracking-wider text-white hover:text-[#ff1744] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-2.5 h-6 bg-[#ff1744] inline-block skew-x-[-12deg]" />
          <span>RECLAIM THE DAY</span>
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-punch font-bold tracking-widest text-neutral-400">
          <a href="#stage" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            STAGE LIVE
          </a>
          <a href="#lyrics" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            SYNC LYRICS
          </a>
          <a href="#amprack" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            AMP & RIG
          </a>
          <a href="#soundboard" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            LIVE SOUNDBOARD
          </a>
          <a href="#tour" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            TOUR DATES
          </a>
          <a href="#merch" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            OFFICIAL MERCH
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Adrenaline Quick Gauge */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-punch text-neutral-300">
            <Flame className={`w-4 h-4 ${adrenaline > 70 ? 'text-[#ff1744] animate-pulse' : 'text-neutral-500'}`} />
            <span className="tabular-nums font-bold text-white">{adrenaline}%</span>
          </div>

          <button
            onClick={onOpenTicket}
            className="px-4 py-2 text-xs font-punch font-bold tracking-wider text-white bg-[#e60026] hover:bg-[#ff1744] active:scale-95 transition-all shadow-[0_0_15px_rgba(230,0,38,0.4)] whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>GET TOUR PASS</span>
          </button>
        </div>

      </div>
    </header>
  );
};
