/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { RockHeader } from './components/RockHeader';
import { HeroStage } from './components/HeroStage';
import { AudioVisualizerCanvas } from './components/AudioVisualizerCanvas';
import { SynchronizedLyrics } from './components/SynchronizedLyrics';
import { MarshallAmpRack } from './components/MarshallAmpRack';
import { LiveSoundboard } from './components/LiveSoundboard';
import { BandMemberShowcase } from './components/BandMemberShowcase';
import { TourSchedule } from './components/TourSchedule';
import { MerchStore } from './components/MerchStore';
import { TicketModal } from './components/TicketModal';
import { RockFooter } from './components/RockFooter';
import { TRACK_LIST, TOUR_DATES, Track, TourDate } from './data/rockData';
import { rockEngine } from './services/rockAudioEngine';

export default function App() {
  const [tracks] = useState<Track[]>(TRACK_LIST);
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACK_LIST[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(106); // 1:46 default length
  const [adrenaline, setAdrenaline] = useState<number>(65);

  // Modals & Tour Selection
  const [isTicketModalOpen, setIsTicketModalOpen] = useState<boolean>(false);
  const [selectedTour, setSelectedTour] = useState<TourDate | null>(TOUR_DATES[0]);

  // Boost adrenaline gauge and slowly decay
  const handleAdrenalineBoost = useCallback((amount: number) => {
    setAdrenaline((prev) => Math.min(100, prev + amount));
  }, []);

  useEffect(() => {
    const decayInterval = setInterval(() => {
      setAdrenaline((prev) => (prev > 30 ? prev - 1 : prev));
    }, 1500);
    return () => clearInterval(decayInterval);
  }, []);

  // Play / Stop Master Audio Controller
  const handlePlayToggle = () => {
    if (isPlaying) {
      rockEngine.stopSequencer();
      rockEngine.pauseExternalAudio();
      setIsPlaying(false);
    } else {
      const extAudio = rockEngine.getAudioElement();
      if (extAudio && extAudio.src) {
        rockEngine.playExternalAudio();
        setIsPlaying(true);
      } else {
        // Start full rock sequencer
        rockEngine.startSongSequencer(
          currentTrack.id,
          (step, beatTime) => {
            setCurrentTime(beatTime % duration);
          },
          () => {
            setIsPlaying(false);
            setCurrentTime(0);
          }
        );
        setIsPlaying(true);
      }
    }
  };

  const handleSelectTrack = (track: Track) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    if (isPlaying) {
      rockEngine.stopSequencer();
      rockEngine.startSongSequencer(
        track.id,
        (step, beatTime) => {
          setCurrentTime(beatTime % duration);
        },
        () => {
          setIsPlaying(false);
          setCurrentTime(0);
        }
      );
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      await rockEngine.loadAudioFile(file);
      const extAudio = rockEngine.getAudioElement();
      if (extAudio) {
        extAudio.ontimeupdate = () => {
          setCurrentTime(extAudio.currentTime);
          setDuration(extAudio.duration || 106);
        };
        extAudio.onended = () => {
          setIsPlaying(false);
          setCurrentTime(0);
        };
        rockEngine.playExternalAudio();
        setIsPlaying(true);
      }
      handleAdrenalineBoost(25);
    } catch (e) {
      console.error('Audio load error:', e);
    }
  };

  const handleLineClick = (startTime: number) => {
    setCurrentTime(startTime);
    const extAudio = rockEngine.getAudioElement();
    if (extAudio && extAudio.src) {
      extAudio.currentTime = startTime;
    }
    rockEngine.triggerPowerChord(82.41, 0.4);
    handleAdrenalineBoost(5);
  };

  const handleChantShout = () => {
    rockEngine.triggerCrowdChant();
    handleAdrenalineBoost(10);
  };

  const handleReserveTour = (tour: TourDate) => {
    setSelectedTour(tour);
    setIsTicketModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col font-body selection:bg-[#ff1744] selection:text-white">
      {/* Top Bar */}
      <RockHeader
        onOpenTicket={() => setIsTicketModalOpen(true)}
        adrenaline={adrenaline}
      />

      {/* Main Content Sections */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* 1. Hero Stage & Ignition Controller */}
        <HeroStage
          tracks={tracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          adrenaline={adrenaline}
          onPlayToggle={handlePlayToggle}
          onSelectTrack={handleSelectTrack}
          onFileUpload={handleFileUpload}
          onAdrenalineBoost={handleAdrenalineBoost}
        />

        {/* 2. Real-Time FFT Visualizer Canvas */}
        <AudioVisualizerCanvas
          isPlaying={isPlaying}
          onAdrenalineBoost={handleAdrenalineBoost}
        />

        {/* 3. Synced Teleprompter Lyrics for the song */}
        <SynchronizedLyrics
          lyrics={currentTrack.lyrics}
          currentTime={currentTime}
          duration={duration}
          onLineClick={handleLineClick}
          onChantShout={handleChantShout}
        />

        {/* 4. Marshall Tube Amp Rack & Tone EQ */}
        <MarshallAmpRack onAdrenalineBoost={handleAdrenalineBoost} />

        {/* 5. Live Jam Performance Soundboard */}
        <LiveSoundboard onAdrenalineBoost={handleAdrenalineBoost} />

        {/* 6. Band Lineup & Stage Roles */}
        <BandMemberShowcase onAdrenalineBoost={handleAdrenalineBoost} />

        {/* 7. Nationwide Tour Dates & Ticket Reservations */}
        <TourSchedule
          dates={TOUR_DATES}
          onReserve={handleReserveTour}
        />

        {/* 8. Official Band Tour Merch */}
        <MerchStore onAdrenalineBoost={handleAdrenalineBoost} />
      </main>

      {/* Ticket Generator Modal */}
      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        selectedTour={selectedTour}
      />

      {/* Footer */}
      <RockFooter />
    </div>
  );
}
