import React, { useRef, useEffect } from 'react';
import { Flame, Mic2, VolumeX, Sparkles } from 'lucide-react';
import { LyricLine } from '../data/rockData';

interface SynchronizedLyricsProps {
  lyrics: LyricLine[];
  currentTime: number;
  duration: number;
  onLineClick: (start: number) => void;
  onChantShout: () => void;
}

export const SynchronizedLyrics: React.FC<SynchronizedLyricsProps> = ({
  lyrics,
  currentTime,
  duration,
  onLineClick,
  onChantShout,
}) => {
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  // Find active line based on current time
  const activeLine = lyrics.find(
    (line) => currentTime >= line.start && currentTime < line.end
  ) || lyrics[0];

  useEffect(() => {
    if (currentTime > 0 && activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeLine?.id]);

  return (
    <section id="lyrics" className="relative bg-[#0d0d10] border border-neutral-800 p-4 sm:p-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-punch tracking-widest text-[#ff1744] mb-1">
            <Mic2 className="w-4 h-4" />
            <span>SYNCED STAGE TELEPROMPTER // LIVE LYRICS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-rock text-white tracking-wide">
            歌詞シンクロナイザー
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onChantShout}
            className="px-4 py-2 text-xs font-punch font-bold tracking-wider text-white bg-gradient-to-r from-[#e60026] to-[#b7091a] hover:from-[#ff1744] hover:to-[#e60026] active:scale-95 transition-all shadow-[0_0_20px_rgba(230,0,38,0.5)] flex items-center gap-2 cursor-pointer border border-[#ff1744]"
          >
            <Flame className="w-4 h-4 text-white animate-bounce" />
            <span>CROWD SHOUT [OI! OI!]</span>
          </button>
        </div>
      </div>

      {/* Prompter Banner for Currently Singing Lyric */}
      <div className="relative mb-6 p-5 sm:p-7 bg-[#141418] border-2 border-[#ff1744] overflow-hidden rock-glow-red">
        <div className="absolute top-0 right-0 px-3 py-1 bg-[#ff1744] text-white text-[11px] font-punch font-bold tracking-widest">
          NOW SINGING
        </div>

        <div className="text-xl sm:text-3xl md:text-4xl font-rock text-white tracking-wide leading-tight mb-2 drop-shadow-[0_2px_10px_rgba(255,23,68,0.7)]">
          {activeLine ? activeLine.text : '準備完了 // 音を鳴らせ'}
        </div>

        {activeLine?.subText && (
          <div className="text-xs sm:text-sm font-punch tracking-wider text-[#ff708f] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#ff1744] rounded-full inline-block" />
            <span>{activeLine.subText}</span>
          </div>
        )}
      </div>

      {/* Scrollable Lyric Stream */}
      <div className="max-h-[360px] overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
        {lyrics.map((line) => {
          const isActive = currentTime >= line.start && currentTime < line.end;
          const isPassed = currentTime >= line.end;

          return (
            <div
              key={line.id}
              ref={isActive ? activeLineRef : null}
              onClick={() => onLineClick(line.start)}
              className={`p-3.5 sm:p-4 transition-all duration-200 cursor-pointer border ${
                isActive
                  ? 'bg-[#1e1315] border-[#ff1744] text-white pl-5 scale-[1.01] shadow-[inset_4px_0_0_#ff1744]'
                  : isPassed
                  ? 'bg-[#0f0f13]/60 border-neutral-800/80 text-neutral-400 hover:text-neutral-200'
                  : 'bg-[#0f0f13] border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div
                    className={`font-rock tracking-wide text-sm sm:text-lg ${
                      isActive
                        ? 'text-white'
                        : line.isChorus
                        ? 'text-neutral-200 font-bold'
                        : 'text-neutral-400'
                    }`}
                  >
                    {line.text}
                  </div>
                  {line.subText && (
                    <div className="text-xs font-punch tracking-wide text-neutral-500 mt-0.5">
                      {line.subText}
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-xs font-punch tabular-nums font-bold ${
                      isActive ? 'text-[#ff1744]' : 'text-neutral-600'
                    }`}
                  >
                    {Math.floor(line.start / 60)}:
                    {(line.start % 60).toString().padStart(2, '0')}
                  </span>
                  {line.isChorus && (
                    <div className="text-[10px] font-punch text-[#ff1744] font-bold tracking-wider">
                      CHORUS
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Timeline Hint */}
      <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-punch text-neutral-500">
        <span>CLICK ANY LINE TO JUMP // HIGH TENSION SINGALONG</span>
        <span className="tabular-nums font-bold text-neutral-400">
          {Math.floor(currentTime / 60)}:{(Math.floor(currentTime) % 60).toString().padStart(2, '0')} / 01:46
        </span>
      </div>
    </section>
  );
};
