import React, { useRef } from 'react';
import { Play, Square, Upload, Flame, Disc, Radio, AlertTriangle } from 'lucide-react';
import { Track } from '../data/rockData';
import heroStageImg from '../assets/images/rock_band_live_hero_1792126877989.jpg';
import guitarDetailImg from '../assets/images/rock_electric_guitar_1792126878877.jpg';

interface HeroStageProps {
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  adrenaline: number;
  onPlayToggle: () => void;
  onSelectTrack: (track: Track) => void;
  onFileUpload: (file: File) => void;
  onAdrenalineBoost: (amount: number) => void;
}

export const HeroStage: React.FC<HeroStageProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  adrenaline,
  onPlayToggle,
  onSelectTrack,
  onFileUpload,
  onAdrenalineBoost,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <section id="stage" className="relative w-full overflow-hidden bg-black border-b border-neutral-800">
      
      {/* Background Hero Banner with High Contrast Contrast Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroStageImg}
          alt="Japanese Rock Band Live Concert Stage"
          className="w-full h-full object-cover object-center opacity-40 mix-blend-screen scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Measured scrims to satisfy Section 1.F contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080a] via-[#08080a]/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        
        {/* Top Kicker Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff1744] text-white px-2.5 py-1 text-xs font-punch font-extrabold tracking-widest uppercase">
              HIGH VOLTAGE TOUR 2024-2025
            </span>
            <span className="text-neutral-400 text-xs font-punch tracking-widest hidden sm:inline">
              // NO EXCUSES · FULL SPEED PUNK ROCK
            </span>
          </div>

          {/* Adrenaline Tension Meter */}
          <div className="flex items-center gap-3 bg-[#121216]/90 border border-neutral-800 px-4 py-2">
            <div className="flex items-center gap-1.5 text-xs font-punch text-white font-bold">
              <Flame className={`w-4 h-4 ${adrenaline >= 80 ? 'text-[#ff1744] animate-bounce' : 'text-neutral-400'}`} />
              <span>TENSION:</span>
              <span className="tabular-nums text-[#ff1744] text-sm">{adrenaline}%</span>
            </div>
            <div className="w-24 sm:w-36 h-2.5 bg-neutral-800 overflow-hidden relative">
              <div
                className={`h-full transition-all duration-300 ${
                  adrenaline >= 80
                    ? 'bg-gradient-to-r from-[#e60026] via-[#ff1744] to-white shadow-[0_0_10px_#ff1744]'
                    : 'bg-[#e60026]'
                }`}
                style={{ width: `${Math.min(100, adrenaline)}%` }}
              />
            </div>
            {adrenaline >= 100 && (
              <span className="text-[10px] font-punch font-black text-white bg-[#ff1744] px-1.5 py-0.5 animate-pulse">
                OVERDRIVE!
              </span>
            )}
          </div>
        </div>

        {/* Marquee Headline */}
        <div className="mb-8">
          <div className="inline-block text-xs font-punch font-bold tracking-widest text-[#ff1744] uppercase mb-2">
            NEW SINGLE & LIVE ANTHEM
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-rock text-white tracking-tight uppercase leading-none drop-shadow-[0_4px_25px_rgba(255,23,68,0.5)]">
            僕らの今日を
            <br />
            <span className="text-[#ff1744] drop-shadow-[0_4px_30px_rgba(255,23,68,0.8)]">
              取り返せ！
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-neutral-300 font-body leading-relaxed">
            錆びたフェンスを蹴って、始発前の冷たいアスファルトを突き進め。
            笑う声も塞ぐ声も背中で振り切って、転んだ傷さえ連れて行け。壁を越え、今この瞬間の熱狂を掴み取る。
          </p>
        </div>

        {/* Live Audio Control Center Box */}
        <div className="bg-[#0f0f13]/95 border-2 border-neutral-700 p-5 sm:p-7 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left: Track Information & Status */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-neutral-900 border border-neutral-700 shrink-0 overflow-hidden flex items-center justify-center group">
                <img
                  src={guitarDetailImg}
                  alt="Track Cover"
                  className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-110' : ''}`}
                />
                <div className={`absolute inset-0 bg-[#ff1744]/20 ${isPlaying ? 'block animate-pulse' : 'hidden'}`} />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-punch font-bold tracking-widest text-white bg-[#ff1744] px-1.5 py-0.5">
                    {currentTrack.tag}
                  </span>
                  <span className="text-xs font-punch text-neutral-400 tabular-nums">
                    BPM {currentTrack.bpm} · {currentTrack.key}
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-rock text-white tracking-wide">
                  {currentTrack.title}
                </div>
                <div className="text-xs font-punch text-neutral-400 tracking-wider">
                  ARTIST: <span className="text-white font-bold">{currentTrack.artist}</span>
                </div>
              </div>
            </div>

            {/* Right: Master Playback & Upload Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Primary Ignition Play Button */}
              <button
                onClick={() => {
                  onPlayToggle();
                  onAdrenalineBoost(15);
                }}
                className="px-6 sm:px-8 py-3.5 text-sm sm:text-base font-punch font-extrabold tracking-widest text-white bg-[#e60026] hover:bg-[#ff1744] active:scale-95 transition-all shadow-[0_0_30px_rgba(230,0,38,0.6)] flex items-center gap-2.5 cursor-pointer border border-[#ff1744]"
              >
                {isPlaying ? (
                  <>
                    <Square className="w-5 h-5 fill-white" />
                    <span>STOP LIVE RIOT</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-white" />
                    <span>IGNITE LIVE RIOT</span>
                  </>
                )}
              </button>

              {/* Upload Own Audio File */}
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-3.5 text-xs sm:text-sm font-punch font-bold tracking-wider text-neutral-200 bg-[#18181c] hover:bg-[#27272a] hover:text-white border border-neutral-700 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                title="あなたの音源やMP3ファイルをロードしてリアルタイム解析"
              >
                <Upload className="w-4 h-4 text-[#ff1744]" />
                <span>LOAD CUSTOM AUDIO</span>
              </button>
            </div>

          </div>

          {/* Track Switcher Strip */}
          <div className="mt-5 pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-punch text-neutral-400">
              <Disc className="w-4 h-4 text-[#ff1744]" />
              <span>SELECT SETLIST TRACK:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {tracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => onSelectTrack(track)}
                  className={`px-3 py-1.5 text-xs font-punch font-bold tracking-wider border transition-colors cursor-pointer ${
                    currentTrack.id === track.id
                      ? 'bg-white text-black border-white'
                      : 'bg-[#121216] text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  {track.title}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
