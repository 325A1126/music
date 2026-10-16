import React, { useEffect, useState } from 'react';
import { Volume2, Sparkles, Flame, Radio } from 'lucide-react';
import { rockEngine } from '../services/rockAudioEngine';

interface LiveSoundboardProps {
  onAdrenalineBoost: (amount: number) => void;
}

export const LiveSoundboard: React.FC<LiveSoundboardProps> = ({ onAdrenalineBoost }) => {
  const [activePad, setActivePad] = useState<string | null>(null);

  const triggerPad = (id: string, action: () => void, adrenalineCost = 3) => {
    action();
    setActivePad(id);
    onAdrenalineBoost(adrenalineCost);
    setTimeout(() => {
      setActivePad((curr) => (curr === id ? null : curr));
    }, 180);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const key = e.key.toUpperCase();
      if (key === '1') {
        triggerPad('kick', () => rockEngine.triggerKick());
      } else if (key === '2') {
        triggerPad('snare', () => rockEngine.triggerSnare());
      } else if (key === '3') {
        triggerPad('hihat', () => rockEngine.triggerHihat());
      } else if (key === '4') {
        triggerPad('crash', () => rockEngine.triggerCrash(), 5);
      } else if (key === 'Q') {
        triggerPad('chord-e', () => rockEngine.triggerPowerChord(82.41, 0.45));
      } else if (key === 'W') {
        triggerPad('chord-g', () => rockEngine.triggerPowerChord(98.0, 0.45));
      } else if (key === 'E') {
        triggerPad('chord-a', () => rockEngine.triggerPowerChord(110.0, 0.45));
      } else if (key === 'R') {
        triggerPad('pickslide', () => rockEngine.triggerPickSlide(), 6);
      } else if (e.code === 'Space') {
        e.preventDefault();
        triggerPad('chant', () => rockEngine.triggerCrowdChant(), 8);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const pads = [
    {
      id: 'kick',
      name: 'HEAVY BASS KICK',
      sub: '心臓を抉るバスドラム',
      key: '1',
      category: 'DRUMS',
      action: () => rockEngine.triggerKick(),
      boost: 3,
    },
    {
      id: 'snare',
      name: 'CRACK SNARE',
      sub: '炸裂スネアクラック',
      key: '2',
      category: 'DRUMS',
      action: () => rockEngine.triggerSnare(),
      boost: 3,
    },
    {
      id: 'hihat',
      name: 'TIGHT HI-HAT',
      sub: '鋭角ハイハット',
      key: '3',
      category: 'DRUMS',
      action: () => rockEngine.triggerHihat(),
      boost: 2,
    },
    {
      id: 'crash',
      name: 'CRASH CYMBAL',
      sub: '大音量クラッシュシンバル',
      key: '4',
      category: 'DRUMS',
      action: () => rockEngine.triggerCrash(),
      boost: 6,
    },
    {
      id: 'chord-e',
      name: 'POWER CHORD [E5]',
      sub: '歪み重層E5コード',
      key: 'Q',
      category: 'GUITAR',
      action: () => rockEngine.triggerPowerChord(82.41, 0.5),
      boost: 4,
    },
    {
      id: 'chord-g',
      name: 'POWER CHORD [G5]',
      sub: '咆哮G5コード',
      key: 'W',
      category: 'GUITAR',
      action: () => rockEngine.triggerPowerChord(98.0, 0.5),
      boost: 4,
    },
    {
      id: 'chord-a',
      name: 'POWER CHORD [A5]',
      sub: '疾走A5コード',
      key: 'E',
      category: 'GUITAR',
      action: () => rockEngine.triggerPowerChord(110.0, 0.5),
      boost: 4,
    },
    {
      id: 'pickslide',
      name: 'PICK SLIDE FX',
      sub: '激痛ピックスライド',
      key: 'R',
      category: 'GUITAR',
      action: () => rockEngine.triggerPickSlide(),
      boost: 7,
    },
    {
      id: 'chant',
      name: 'CROWD ROAR [OI!]',
      sub: 'フロア大合唱シャウト',
      key: 'SPACE',
      category: 'VOCAL/CROWD',
      action: () => rockEngine.triggerCrowdChant(),
      boost: 9,
      spanFull: true,
    },
  ];

  return (
    <section id="soundboard" className="relative bg-[#0d0d10] border border-neutral-800 p-4 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-punch tracking-widest text-[#ff1744] mb-1">
            <Radio className="w-4 h-4" />
            <span>INSTANT PERFORMANCE PADS // KEYBOARD JAM SESSION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-rock text-white tracking-wide">
            ライブ・サウンドボード
          </h2>
        </div>

        <div className="text-xs font-punch text-neutral-400">
          SHORTCUTS: <span className="text-white font-bold">[1-4]</span> DRUMS · <span className="text-[#ff1744] font-bold">[Q W E R]</span> GUITARS · <span className="text-white font-bold">[SPACE]</span> SHOUT
        </div>
      </div>

      {/* Grid of Sound Pads */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {pads.map((pad) => {
          const isTriggered = activePad === pad.id;
          return (
            <button
              key={pad.id}
              onClick={() => triggerPad(pad.id, pad.action, pad.boost)}
              className={`relative p-4 sm:p-5 text-left border transition-all duration-150 cursor-pointer select-none ${
                pad.spanFull ? 'col-span-2 sm:col-span-4 bg-gradient-to-r from-[#7f0013] to-[#e60026] text-white border-[#ff1744]' : 'bg-[#121216] border-neutral-800 hover:border-neutral-700'
              } ${
                isTriggered
                  ? 'scale-[0.98] border-white bg-white text-black shadow-[0_0_25px_rgba(255,23,68,0.8)]'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span
                  className={`text-[10px] font-punch font-bold tracking-widest px-2 py-0.5 border ${
                    isTriggered
                      ? 'border-black text-black'
                      : pad.spanFull
                      ? 'border-white/50 text-white'
                      : 'border-neutral-800 text-neutral-400'
                  }`}
                >
                  {pad.category}
                </span>

                <span
                  className={`font-mono text-xs font-black px-2 py-0.5 border ${
                    isTriggered
                      ? 'bg-black text-white border-black'
                      : 'bg-[#1c1c22] text-[#ff1744] border-neutral-700'
                  }`}
                >
                  {pad.key}
                </span>
              </div>

              <div
                className={`font-punch font-extrabold text-sm sm:text-base tracking-wide ${
                  isTriggered ? 'text-black' : 'text-white'
                }`}
              >
                {pad.name}
              </div>

              <div
                className={`text-xs mt-1 font-body ${
                  isTriggered ? 'text-neutral-800' : 'text-neutral-500'
                }`}
              >
                {pad.sub}
              </div>

              {/* High Voltage Corner Accent */}
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 ${
                  isTriggered ? 'bg-black' : 'bg-[#ff1744]'
                }`}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
};
