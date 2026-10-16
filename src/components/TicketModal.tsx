import React, { useState } from 'react';
import { X, Ticket, Check, Printer, QrCode, ShieldCheck } from 'lucide-react';
import { TourDate } from '../data/rockData';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTour?: TourDate | null;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  selectedTour,
}) => {
  const [attendeeName, setAttendeeName] = useState<string>('RIOT ATTENDEE');
  const [ticketTier, setTicketTier] = useState<'ARENA MOSHPIT' | 'VIP ALL ACCESS'>('ARENA MOSHPIT');
  const [isReserved, setIsReserved] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentVenue = selectedTour ? selectedTour.venue : 'SHIBUYA CYCLONE, TOKYO';
  const currentDate = selectedTour ? selectedTour.date : '2025.04.18 (FRI)';
  const currentCity = selectedTour ? selectedTour.city : 'TOKYO';
  const currentPrice = selectedTour ? selectedTour.ticketPrice : '¥4,500 (+1D)';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f0f13] border-2 border-neutral-700 shadow-[0_0_50px_rgba(255,23,68,0.3)] p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white cursor-pointer p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-punch tracking-widest text-[#ff1744] uppercase mb-1">
            <Ticket className="w-4 h-4" />
            <span>OFFICIAL STAGE ENTRY PASS // FAST PASS RESERVATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-rock text-white tracking-wide">
            ツアー入場パス・ジェネレーター
          </h2>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-punch text-neutral-400 mb-1">
              ATTENDEE NAME (お名前 / ハンドルネーム)
            </label>
            <input
              type="text"
              value={attendeeName}
              onChange={(e) => setAttendeeName(e.target.value.toUpperCase())}
              maxLength={24}
              className="w-full bg-[#181820] border border-neutral-700 px-3 py-2 text-sm font-punch font-bold text-white focus:border-[#ff1744] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-punch text-neutral-400 mb-1">
              ACCESS PASS TIER
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTicketTier('ARENA MOSHPIT')}
                className={`py-2 text-xs font-punch font-bold border transition-colors cursor-pointer ${
                  ticketTier === 'ARENA MOSHPIT'
                    ? 'bg-[#ff1744] text-white border-[#ff1744]'
                    : 'bg-[#181820] text-neutral-400 border-neutral-700 hover:text-white'
                }`}
              >
                MOSHPIT ARENA
              </button>
              <button
                type="button"
                onClick={() => setTicketTier('VIP ALL ACCESS')}
                className={`py-2 text-xs font-punch font-bold border transition-colors cursor-pointer ${
                  ticketTier === 'VIP ALL ACCESS'
                    ? 'bg-[#ff1744] text-white border-[#ff1744]'
                    : 'bg-[#181820] text-neutral-400 border-neutral-700 hover:text-white'
                }`}
              >
                VIP ALL ACCESS
              </button>
            </div>
          </div>
        </div>

        {/* The Rock Ticket Graphic Layout (Black, Red, White) */}
        <div className="relative bg-[#141418] border-2 border-white text-white p-5 sm:p-6 mb-6 shadow-2xl overflow-hidden">
          
          {/* Top Danger Bar */}
          <div className="h-2 w-full bg-danger-stripe mb-4" />

          <div className="flex flex-col sm:flex-row justify-between gap-6">
            
            {/* Left Ticket Main Body */}
            <div className="flex-1 border-b sm:border-b-0 sm:border-r border-dashed border-neutral-600 pb-4 sm:pb-0 sm:pr-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-punch tracking-widest text-[#ff1744] font-bold">
                  TOKYO RIOT 2024-2025 JAPAN TOUR
                </span>
                <span className="text-xs font-mono font-bold text-neutral-400">
                  NO. TR-8921-X
                </span>
              </div>

              <div className="text-2xl sm:text-3xl font-rock tracking-wide text-white mb-2">
                僕らの今日を取り返せ
              </div>

              <div className="grid grid-cols-2 gap-4 my-3 text-xs font-punch">
                <div>
                  <div className="text-neutral-500">CITY & VENUE</div>
                  <div className="font-bold text-white text-sm">{currentCity} // {currentVenue}</div>
                </div>
                <div>
                  <div className="text-neutral-500">DATE & TIME</div>
                  <div className="font-bold text-white text-sm">{currentDate}</div>
                </div>
                <div>
                  <div className="text-neutral-500">HOLDER NAME</div>
                  <div className="font-bold text-[#ff1744] text-sm">{attendeeName || 'RIOT GUEST'}</div>
                </div>
                <div>
                  <div className="text-neutral-500">PASS TIER</div>
                  <div className="font-bold text-white text-sm">{ticketTier}</div>
                </div>
              </div>

              {/* Barcode Simulation */}
              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                <div className="font-mono text-[9px] tracking-widest text-neutral-500">
                  ||||| ||| ||||||| |||| || |||||| |||||||| |||| ||| ||||||
                </div>
                <div className="text-xs font-punch font-bold text-white">
                  {currentPrice}
                </div>
              </div>
            </div>

            {/* Right Perforated Stub */}
            <div className="w-full sm:w-36 flex flex-col justify-between items-center text-center pt-2 sm:pt-0">
              <div className="text-[10px] font-punch font-bold text-neutral-400">
                ENTRY STUB
              </div>

              {/* QR Code Graphic Box */}
              <div className="w-20 h-20 bg-white p-2 flex items-center justify-center my-2">
                <QrCode className="w-full h-full text-black" />
              </div>

              <div className="text-[10px] font-mono text-[#ff1744] font-bold">
                STAGE-01
              </div>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-punch font-bold text-neutral-300 bg-[#1e1e24] hover:bg-[#2a2a34] border border-neutral-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>PRINT PASS</span>
          </button>

          <button
            onClick={() => {
              setIsReserved(true);
              setTimeout(() => {
                setIsReserved(false);
                onClose();
              }, 1600);
            }}
            className="px-6 py-2.5 text-xs font-punch font-extrabold tracking-wider uppercase text-white bg-[#e60026] hover:bg-[#ff1744] shadow-[0_0_20px_rgba(230,0,38,0.5)] flex items-center gap-2 cursor-pointer transition-all"
          >
            {isReserved ? (
              <>
                <Check className="w-4 h-4" />
                <span>CONFIRMED!</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>CONFIRM RESERVATION</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
