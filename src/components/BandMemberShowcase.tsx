import React from 'react';
import { Users, Volume2, Mic, Music, Disc } from 'lucide-react';
import { BAND_MEMBERS } from '../data/rockData';
import { rockEngine } from '../services/rockAudioEngine';

interface BandMemberShowcaseProps {
  onAdrenalineBoost: (amount: number) => void;
}

export const BandMemberShowcase: React.FC<BandMemberShowcaseProps> = ({ onAdrenalineBoost }) => {
  const handleMemberSolo = (role: string) => {
    if (role.includes('VOCAL')) {
      rockEngine.triggerCrowdChant();
      onAdrenalineBoost(8);
    } else if (role.includes('GUITAR')) {
      rockEngine.triggerPickSlide();
      setTimeout(() => rockEngine.triggerPowerChord(82.41, 0.6), 200);
      onAdrenalineBoost(8);
    } else if (role.includes('BASS')) {
      rockEngine.triggerPowerChord(55.0, 0.7); // Low A
      onAdrenalineBoost(6);
    } else if (role.includes('DRUMS')) {
      rockEngine.triggerCrash();
      rockEngine.triggerSnare();
      rockEngine.triggerKick();
      onAdrenalineBoost(8);
    }
  };

  return (
    <section className="relative bg-[#0b0b0e] border border-neutral-800 p-4 sm:p-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-punch tracking-widest text-[#ff1744] mb-1">
            <Users className="w-4 h-4" />
            <span>BAND LINEUP & RIOT ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-rock text-white tracking-wide">
            THE MEMBERS
          </h2>
        </div>
        <div className="text-xs font-punch text-neutral-400">
          CLICK CARD TO HEAR SIGNATURE STAGE ATTACK
        </div>
      </div>

      {/* 4 Member Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BAND_MEMBERS.map((member) => (
          <div
            key={member.name}
            onClick={() => handleMemberSolo(member.role)}
            className="p-5 bg-[#121216] border border-neutral-800 hover:border-[#ff1744] transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-punch font-bold tracking-widest text-[#ff1744] uppercase">
                  {member.role}
                </span>
                <span className="w-2 h-2 bg-neutral-700 group-hover:bg-[#ff1744] group-hover:shadow-[0_0_8px_#ff1744] transition-all" />
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl sm:text-3xl font-rock text-white group-hover:text-[#ff1744] transition-colors">
                  {member.name}
                </span>
                <span className="text-sm font-rock text-neutral-500">
                  [{member.kanji}]
                </span>
              </div>

              <p className="text-xs font-body text-neutral-300 italic mb-4 leading-relaxed border-l-2 border-[#ff1744] pl-2.5">
                {member.quote}
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-800/80 text-[11px] font-punch text-neutral-400">
              <div className="text-[10px] text-neutral-500 font-bold mb-0.5">GEAR SPEC:</div>
              <div>{member.gear}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
