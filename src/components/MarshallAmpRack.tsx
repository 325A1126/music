import React, { useState } from 'react';
import { Sliders, Zap, Volume2, ShieldAlert } from 'lucide-react';
import { rockEngine } from '../services/rockAudioEngine';

interface MarshallAmpRackProps {
  onAdrenalineBoost: (amount: number) => void;
}

export const MarshallAmpRack: React.FC<MarshallAmpRackProps> = ({ onAdrenalineBoost }) => {
  const [gain, setGain] = useState<number>(75);
  const [bass, setBass] = useState<number>(6.0);
  const [mid, setMid] = useState<number>(3.5);
  const [treble, setTreble] = useState<number>(5.0);
  const [presence, setPresence] = useState<number>(4.0);
  const [master, setMaster] = useState<number>(85);
  const [boostEnabled, setBoostEnabled] = useState<boolean>(true);

  const handleGainChange = (newVal: number) => {
    setGain(newVal);
    rockEngine.setDrive(boostEnabled ? newVal * 1.5 : newVal);
    onAdrenalineBoost(1);
  };

  const handleBassChange = (newVal: number) => {
    setBass(newVal);
    rockEngine.setEq(newVal, mid, treble);
  };

  const handleMidChange = (newVal: number) => {
    setMid(newVal);
    rockEngine.setEq(bass, newVal, treble);
  };

  const handleTrebleChange = (newVal: number) => {
    setTreble(newVal);
    rockEngine.setEq(bass, mid, newVal);
  };

  const handleMasterChange = (newVal: number) => {
    setMaster(newVal);
    rockEngine.setMasterVolume(newVal / 100);
  };

  const toggleBoost = () => {
    const next = !boostEnabled;
    setBoostEnabled(next);
    rockEngine.setDrive(next ? gain * 1.5 : gain);
    onAdrenalineBoost(8);
  };

  return (
    <section id="amprack" className="relative bg-[#0b0b0e] border-2 border-neutral-800 p-4 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      {/* Amp Head Top Trim / Leather Texture & Logo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-punch tracking-widest text-[#ff1744] mb-1">
            <Sliders className="w-4 h-4" />
            <span>TUBE AMPLIFIER & EFFECTS RIG // 100W HIGH-GAIN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-rock text-white tracking-wide">
            歪みアンプ＆トーン・スタック
          </h2>
        </div>

        {/* Vintage Red Jewel Pilot Lamp */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#121216] px-3 py-1.5 border border-neutral-800">
            <div
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                boostEnabled
                  ? 'bg-[#ff1744] shadow-[0_0_15px_#ff1744] ring-2 ring-white/50 animate-pulse'
                  : 'bg-neutral-700'
              }`}
            />
            <span className="text-xs font-punch font-bold tracking-widest text-neutral-300">
              {boostEnabled ? 'BOOST ON' : 'CLEAN/CRUNCH'}
            </span>
          </div>

          <button
            onClick={toggleBoost}
            className={`px-3.5 py-1.5 text-xs font-punch font-bold tracking-wider uppercase border transition-all cursor-pointer ${
              boostEnabled
                ? 'bg-[#ff1744] text-white border-[#ff1744] shadow-[0_0_15px_rgba(255,23,68,0.5)]'
                : 'bg-[#18181c] text-neutral-400 border-neutral-700 hover:text-white'
            }`}
          >
            OVERDRIVE HOT SWITCH
          </button>
        </div>
      </div>

      {/* Brushed Brass / Gold-Black Faceplate */}
      <div className="bg-gradient-to-b from-[#18181c] via-[#101014] to-[#0a0a0d] border border-neutral-700 p-5 sm:p-6 rounded-sm">
        
        {/* Amp Brand Wordmark */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 mb-6">
          <div className="font-rock text-xl sm:text-2xl text-white tracking-widest flex items-center gap-2">
            <span className="text-[#ff1744]">TOKYO RIOT</span>
            <span className="text-xs font-punch tracking-widest text-neutral-500 font-normal">
              CUSTOM 100W ALL-TUBE HEAD
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-punch text-neutral-500">
            <span>INPUT: ACTIVE HIGH</span>
            <span aria-hidden="true">·</span>
            <span>CAB: 4x12 V30</span>
          </div>
        </div>

        {/* Rotary Knobs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
          {/* GAIN */}
          <div className="flex flex-col items-center text-center p-3 bg-[#0d0d10] border border-neutral-800/80 hover:border-[#ff1744]/60 transition-colors">
            <span className="text-xs font-punch font-bold tracking-wider text-neutral-400 mb-2">
              GAIN / DRIVE
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={gain}
              onChange={(e) => handleGainChange(Number(e.target.value))}
              className="w-full accent-[#ff1744] cursor-pointer mb-2"
            />
            <div className="font-punch text-base font-bold text-white tabular-nums">
              {gain}
              <span className="text-xs text-neutral-500 ml-0.5">%</span>
            </div>
          </div>

          {/* BASS */}
          <div className="flex flex-col items-center text-center p-3 bg-[#0d0d10] border border-neutral-800/80 hover:border-neutral-700 transition-colors">
            <span className="text-xs font-punch font-bold tracking-wider text-neutral-400 mb-2">
              BASS
            </span>
            <input
              type="range"
              min="-10"
              max="15"
              step="0.5"
              value={bass}
              onChange={(e) => handleBassChange(Number(e.target.value))}
              className="w-full accent-white cursor-pointer mb-2"
            />
            <div className="font-punch text-base font-bold text-white tabular-nums">
              {bass > 0 ? `+${bass}` : bass}
              <span className="text-xs text-neutral-500 ml-0.5">dB</span>
            </div>
          </div>

          {/* MIDDLE */}
          <div className="flex flex-col items-center text-center p-3 bg-[#0d0d10] border border-neutral-800/80 hover:border-neutral-700 transition-colors">
            <span className="text-xs font-punch font-bold tracking-wider text-neutral-400 mb-2">
              MIDDLE
            </span>
            <input
              type="range"
              min="-10"
              max="15"
              step="0.5"
              value={mid}
              onChange={(e) => handleMidChange(Number(e.target.value))}
              className="w-full accent-white cursor-pointer mb-2"
            />
            <div className="font-punch text-base font-bold text-white tabular-nums">
              {mid > 0 ? `+${mid}` : mid}
              <span className="text-xs text-neutral-500 ml-0.5">dB</span>
            </div>
          </div>

          {/* TREBLE */}
          <div className="flex flex-col items-center text-center p-3 bg-[#0d0d10] border border-neutral-800/80 hover:border-neutral-700 transition-colors">
            <span className="text-xs font-punch font-bold tracking-wider text-neutral-400 mb-2">
              TREBLE
            </span>
            <input
              type="range"
              min="-10"
              max="15"
              step="0.5"
              value={treble}
              onChange={(e) => handleTrebleChange(Number(e.target.value))}
              className="w-full accent-white cursor-pointer mb-2"
            />
            <div className="font-punch text-base font-bold text-white tabular-nums">
              {treble > 0 ? `+${treble}` : treble}
              <span className="text-xs text-neutral-500 ml-0.5">dB</span>
            </div>
          </div>

          {/* PRESENCE */}
          <div className="flex flex-col items-center text-center p-3 bg-[#0d0d10] border border-neutral-800/80 hover:border-neutral-700 transition-colors">
            <span className="text-xs font-punch font-bold tracking-wider text-neutral-400 mb-2">
              PRESENCE
            </span>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={presence}
              onChange={(e) => setPresence(Number(e.target.value))}
              className="w-full accent-white cursor-pointer mb-2"
            />
            <div className="font-punch text-base font-bold text-white tabular-nums">
              {presence}
            </div>
          </div>

          {/* MASTER */}
          <div className="flex flex-col items-center text-center p-3 bg-[#0d0d10] border-2 border-[#ff1744]/40 hover:border-[#ff1744] transition-colors">
            <span className="text-xs font-punch font-bold tracking-wider text-[#ff1744] mb-2 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5" />
              <span>MASTER</span>
            </span>
            <input
              type="range"
              min="0"
              max="120"
              value={master}
              onChange={(e) => handleMasterChange(Number(e.target.value))}
              className="w-full accent-[#ff1744] cursor-pointer mb-2"
            />
            <div className="font-punch text-base font-bold text-white tabular-nums">
              {master}
              <span className="text-xs text-neutral-500 ml-0.5">%</span>
            </div>
          </div>
        </div>

        {/* Warning Badge & Tip */}
        <div className="mt-5 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs font-punch text-neutral-500">
          <div className="flex items-center gap-2 text-neutral-400">
            <ShieldAlert className="w-4 h-4 text-[#ff1744]" />
            <span>REAL-TIME BIQUAD DSP // ノブの調整はリアルタイムに出力波形と音質へ即時反映されます</span>
          </div>
          <span className="hidden md:inline font-mono text-[11px] text-neutral-600">
            OVERSAMPLING: 4X LINEAR
          </span>
        </div>

      </div>
    </section>
  );
};
