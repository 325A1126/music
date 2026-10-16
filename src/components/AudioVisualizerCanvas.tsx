import React, { useEffect, useRef, useState } from 'react';
import { Activity, BarChart2, Gauge, Zap } from 'lucide-react';
import { rockEngine } from '../services/rockAudioEngine';

interface AudioVisualizerCanvasProps {
  isPlaying: boolean;
  onAdrenalineBoost: (amount: number) => void;
}

export const AudioVisualizerCanvas: React.FC<AudioVisualizerCanvasProps> = ({ isPlaying, onAdrenalineBoost }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<'spectrum' | 'waveform' | 'vu'>('spectrum');
  const [strobeActive, setStrobeActive] = useState<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);

  // Peak tracking for spectrum
  const peaksRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let destroyed = false;

    const render = () => {
      if (destroyed) return;

      const width = canvas.width;
      const height = canvas.height;
      const analyser = rockEngine.getAnalyser();

      // Clear with dark carbon background
      ctx.fillStyle = '#0a0a0d';
      ctx.fillRect(0, 0, width, height);

      // Subtle grid lines for high-precision audio rack aesthetic
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (!analyser || !isPlaying) {
        // Idle heartbeat pulse line
        const time = Date.now() * 0.003;
        ctx.beginPath();
        ctx.strokeStyle = '#e60026';
        ctx.lineWidth = 2;
        ctx.moveTo(0, height / 2);
        for (let x = 0; x < width; x += 5) {
          const y = height / 2 + Math.sin(x * 0.02 + time) * 6;
          ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.fillStyle = '#71717a';
        ctx.font = '12px Oswald, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('STANDBY // IGNITE AUDIO FOR REAL-TIME STAGE TELEMETRY', width / 2, height / 2 + 30);

        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      if (mode === 'spectrum') {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        // Group into 48 bold display bars
        const numBars = 48;
        const step = Math.floor(bufferLength / numBars);
        const barWidth = (width / numBars) - 3;

        if (peaksRef.current.length !== numBars) {
          peaksRef.current = new Array(numBars).fill(0);
        }

        let totalEnergy = 0;

        for (let i = 0; i < numBars; i++) {
          let sum = 0;
          for (let j = 0; j < step; j++) {
            sum += dataArray[i * step + j];
          }
          const avg = sum / step;
          totalEnergy += avg;

          const barHeight = (avg / 255) * (height - 24);
          const x = i * (barWidth + 3) + 2;
          const y = height - barHeight - 4;

          // Peak falloff
          if (barHeight > peaksRef.current[i]) {
            peaksRef.current[i] = barHeight;
          } else {
            peaksRef.current[i] = Math.max(0, peaksRef.current[i] - 1.8);
          }

          // Red-to-White gradient for high tension
          const grad = ctx.createLinearGradient(0, height, 0, y);
          grad.addColorStop(0, '#7f0013');
          grad.addColorStop(0.6, '#e60026');
          grad.addColorStop(0.9, '#ff1744');
          grad.addColorStop(1, '#ffffff');

          ctx.fillStyle = grad;
          ctx.fillRect(x, y, barWidth, barHeight);

          // White peak cap line
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, height - peaksRef.current[i] - 6, barWidth, 2);
        }
      } else if (mode === 'waveform') {
        const bufferLength = analyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#ffffff';
        ctx.shadowColor = '#ff1744';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      } else if (mode === 'vu') {
        // Dual Analog VU Meter Rendering
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        let sumL = 0;
        let sumR = 0;
        const half = Math.floor(bufferLength / 2);
        for (let i = 0; i < half; i++) sumL += dataArray[i];
        for (let i = half; i < bufferLength; i++) sumR += dataArray[i];

        const valL = Math.min(1, (sumL / (half * 255)) * 1.5);
        const valR = Math.min(1, (sumR / (half * 255)) * 1.5);

        const meterW = (width - 60) / 2;
        const meterH = height - 30;

        const drawMeter = (xOffset: number, value: number, label: string) => {
          // Face plate
          ctx.fillStyle = '#121216';
          ctx.strokeStyle = '#27272a';
          ctx.lineWidth = 1.5;
          ctx.fillRect(xOffset, 15, meterW, meterH);
          ctx.strokeRect(xOffset, 15, meterW, meterH);

          // Arc scale
          const centerX = xOffset + meterW / 2;
          const centerY = 15 + meterH + 20;
          const radius = meterH * 0.85;

          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, Math.PI * 1.2, Math.PI * 1.8);
          ctx.strokeStyle = '#52525b';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Red danger zone
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, Math.PI * 1.62, Math.PI * 1.8);
          ctx.strokeStyle = '#ff1744';
          ctx.lineWidth = 4;
          ctx.stroke();

          // Needle
          const needleAngle = Math.PI * 1.2 + value * (Math.PI * 0.6);
          const needleX = centerX + Math.cos(needleAngle) * radius;
          const needleY = centerY + Math.sin(needleAngle) * radius;

          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(needleX, needleY);
          ctx.strokeStyle = value > 0.8 ? '#ff1744' : '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Center pivot cap
          ctx.beginPath();
          ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
          ctx.fillStyle = '#ff1744';
          ctx.fill();

          // Label
          ctx.fillStyle = '#a1a1aa';
          ctx.font = '12px Oswald, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`CHANNEL ${label}  [${Math.round(value * 100)}%]`, centerX, 35);

          // Clip indicator
          if (value > 0.88) {
            ctx.beginPath();
            ctx.arc(xOffset + meterW - 20, 30, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#ff1744';
            ctx.shadowColor = '#ff1744';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        };

        drawMeter(20, valL, 'L - GUITAR');
        drawMeter(width / 2 + 10, valR, 'R - DRUMS & BASS');
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      destroyed = true;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, mode]);

  return (
    <div className={`relative bg-[#0c0c0e] border border-neutral-800 p-3 sm:p-4 ${strobeActive ? 'ring-2 ring-[#ff1744]' : ''}`}>
      {/* Top Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-neutral-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#ff1744] rotate-45" />
          <span className="text-xs font-punch font-bold tracking-wider text-white">
            MASTER STAGE SPECTRUM ANALYZER
          </span>
          <span className="text-neutral-500 text-xs font-punch tracking-widest hidden sm:inline">
            // 48-BAND DUAL FFT
          </span>
        </div>

        {/* Visualizer Mode Selectors */}
        <div className="flex items-center gap-1 bg-[#141418] p-1 border border-neutral-800">
          <button
            onClick={() => setMode('spectrum')}
            className={`px-2.5 py-1 text-xs font-punch font-bold tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
              mode === 'spectrum' ? 'bg-[#e60026] text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3 h-3" />
            <span>SPECTRUM</span>
          </button>
          <button
            onClick={() => setMode('waveform')}
            className={`px-2.5 py-1 text-xs font-punch font-bold tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
              mode === 'waveform' ? 'bg-[#e60026] text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>WAVEFORM</span>
          </button>
          <button
            onClick={() => setMode('vu')}
            className={`px-2.5 py-1 text-xs font-punch font-bold tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
              mode === 'vu' ? 'bg-[#e60026] text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Gauge className="w-3 h-3" />
            <span>VU METERS</span>
          </button>
          <button
            onClick={() => {
              setStrobeActive((prev) => !prev);
              onAdrenalineBoost(5);
            }}
            className={`px-2 py-1 text-xs font-punch font-bold tracking-wider flex items-center gap-1 transition-colors cursor-pointer ${
              strobeActive ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'
            }`}
            title="Toggle Stage Strobe FX"
          >
            <Zap className="w-3 h-3 text-[#ff1744]" />
            <span>STROBE</span>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={220}
        className="w-full h-44 sm:h-56 block bg-[#0a0a0d] border border-neutral-800/80"
      />
    </div>
  );
};
