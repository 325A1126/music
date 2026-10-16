import React from 'react';
import { Calendar, MapPin, Clock, Ticket, AlertCircle } from 'lucide-react';
import { TourDate } from '../data/rockData';
import crowdLiveImg from '../assets/images/rock_livehouse_crowd_1792126879278.jpg';

interface TourScheduleProps {
  dates: TourDate[];
  onReserve: (tour: TourDate) => void;
}

export const TourSchedule: React.FC<TourScheduleProps> = ({ dates, onReserve }) => {
  return (
    <section id="tour" className="relative bg-[#09090c] border border-neutral-800 p-4 sm:p-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-punch tracking-widest text-[#ff1744] mb-1">
            <Calendar className="w-4 h-4" />
            <span>NATIONWIDE LIVE HOUSE TOUR 2025</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-rock text-white tracking-wide">
            JAPAN TOUR SCHEDULE
          </h2>
        </div>

        <div className="text-xs font-punch text-neutral-400">
          ALL SHOWS INCLUDE 1 SPECIAL LIVE CASSETTE TAPE
        </div>
      </div>

      {/* Tour Stops List */}
      <div className="space-y-3">
        {dates.map((tour) => {
          const isFew = tour.status === 'few';
          const isSoldOut = tour.status === 'soldout';

          return (
            <div
              key={tour.id}
              className="p-4 sm:p-6 bg-[#101014] border border-neutral-800 hover:border-neutral-600 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* Date & City */}
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-16 sm:w-20 text-center py-2 bg-[#18181f] border border-neutral-700 shrink-0">
                  <div className="text-xs font-punch text-neutral-400 uppercase">DATE</div>
                  <div className="text-sm sm:text-base font-punch font-extrabold text-white">
                    {tour.date.split(' ')[0]}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base sm:text-xl font-rock text-white tracking-wide group-hover:text-[#ff1744] transition-colors">
                      {tour.city}
                    </span>
                    {isFew && (
                      <span className="text-[10px] font-punch font-bold text-white bg-[#e60026] px-2 py-0.5 animate-pulse">
                        FEW LEFT
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-punch text-neutral-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#ff1744]" />
                      <strong className="text-neutral-200">{tour.venue}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{tour.doors}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-800">
                <div className="text-left md:text-right">
                  <div className="text-[10px] font-punch text-neutral-500">TICKET</div>
                  <div className="text-sm font-punch font-bold text-white">{tour.ticketPrice}</div>
                </div>

                <button
                  disabled={isSoldOut}
                  onClick={() => onReserve(tour)}
                  className={`px-5 py-2.5 text-xs font-punch font-extrabold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSoldOut
                      ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                      : 'bg-white hover:bg-[#ff1744] hover:text-white text-black active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>{isSoldOut ? 'SOLD OUT' : 'GET TICKETS'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* High Tension Crowd Banner Preview */}
      <div className="mt-8 relative overflow-hidden border border-neutral-800 h-40 sm:h-52">
        <img
          src={crowdLiveImg}
          alt="Livehouse crowd"
          className="w-full h-full object-cover object-center grayscale contrast-150"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-6">
          <div className="text-xs font-punch text-[#ff1744] tracking-widest uppercase mb-1">
            MOSHPIT & SINGALONG NOTICE
          </div>
          <div className="text-lg sm:text-2xl font-rock text-white tracking-wide">
            「壁を越えろ。怪我も言い訳も捨てて、会場で全部吐き出せ。」
          </div>
        </div>
      </div>
    </section>
  );
};
