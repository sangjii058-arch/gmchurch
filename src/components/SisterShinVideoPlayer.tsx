import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles, 
  Share2, 
  Download, 
  MapPin, 
  Heart,
  Check,
  Video,
  Music
} from "lucide-react";

interface SisterShinVideoPlayerProps {
  autoPlay?: boolean;
  onClose?: () => void;
}

export default function SisterShinVideoPlayer({ autoPlay = false }: SisterShinVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(11.0); // 11 seconds total duration
  const [isMuted, setIsMuted] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Subtitle timings
  const subtitles = [
    { start: 0, end: 3.5, text: "안녕하세요! 신자매예요. 😊" },
    { start: 3.5, end: 7.8, text: "여기는 달라스에 있는 훼리스 선교사 집이에요. 🏡" },
    { start: 7.8, end: 11.0, text: "여기는 모든 것이 새로워요! ✨" }
  ];

  const currentSubtitle = subtitles.find(s => currentTime >= s.start && currentTime <= s.end)?.text || "";

  // Web Audio Synth for ambient background music & voice tone
  const playAmbientSound = (time: number) => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Gentle acoustic bell sound on key phrase transitions
      if (Math.floor(time * 10) % 35 === 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        // Warm pentatonic chord frequencies (D, F#, A, B, D)
        const notes = [293.66, 369.99, 440.00, 493.88, 587.33];
        const note = notes[Math.floor(time) % notes.length];
        osc.frequency.setValueAtTime(note, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      }
    } catch (e) {
      // AudioContext fallback
    }
  };

  // Speech synthesis trigger
  const triggerSpeech = (fromTime = 0) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    if (fromTime >= duration) return;

    const fullText = "안녕하세요, 신자매예요. 여기는 달라스에 있는 훼리스 선교사 집이에요. 여기는 모든 것이 새로워요!";
    
    // Choose starting text based on scrub time
    let textToSay = fullText;
    if (fromTime > 7.5) {
      textToSay = "여기는 모든 것이 새로워요!";
    } else if (fromTime > 3.2) {
      textToSay = "여기는 달라스에 있는 훼리스 선교사 집이에요. 여기는 모든 것이 새로워요!";
    }

    const utterance = new SpeechSynthesisUtterance(textToSay);
    utterance.lang = "ko-KR";
    utterance.rate = speechSpeed * 0.95;
    utterance.pitch = 1.1;

    // Try finding Korean female voice
    const voices = window.speechSynthesis.getVoices();
    const koVoice = voices.find(v => v.lang.includes("ko") || v.name.toLowerCase().includes("korean"));
    if (koVoice) {
      utterance.voice = koVoice;
    }

    speechUtteranceRef.current = utterance;
    if (!isMuted) {
      window.speechSynthesis.speak(utterance);
    }
  };

  // Play / Pause handler
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      if (currentTime >= duration) {
        setCurrentTime(0);
        triggerSpeech(0);
      } else {
        triggerSpeech(currentTime);
      }
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
    triggerSpeech(0);
  };

  // Timer loop for video playback
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1 * speechSpeed;
          playAmbientSound(next);
          if (next >= duration) {
            setIsPlaying(false);
            if ("speechSynthesis" in window) {
              window.speechSynthesis.cancel();
            }
            return duration;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speechSpeed, isMuted]);

  // Initial autoplay
  useEffect(() => {
    if (autoPlay) {
      togglePlay();
    }
  }, []);

  // Canvas video render loop (draw Dallas Ferris House, Sister Shin, and Big Pinecone)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let tick = 0;

    const render = () => {
      tick += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Dynamic Background: Ferris Missionary House in Dallas
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      skyGradient.addColorStop(0, "#79a7d3");
      skyGradient.addColorStop(0.5, "#bfe3f7");
      skyGradient.addColorStop(1, "#e6f4f8");
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Sun & Sunbeams
      const sunX = width * 0.85;
      const sunY = height * 0.2;
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 180);
      sunGlow.addColorStop(0, "rgba(255, 245, 200, 0.9)");
      sunGlow.addColorStop(0.4, "rgba(255, 220, 150, 0.4)");
      sunGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 180, 0, Math.PI * 2);
      ctx.fill();

      // Texan Ferris Missionary House Structure
      const houseX = width * 0.08;
      const houseY = height * 0.32;
      const houseW = width * 0.52;
      const houseH = height * 0.48;

      // Roof
      ctx.fillStyle = "#6b3e2e"; // Warm wood roof
      ctx.beginPath();
      ctx.moveTo(houseX - 30, houseY + 40);
      ctx.lineTo(houseX + houseW / 2, houseY - 50);
      ctx.lineTo(houseX + houseW + 30, houseY + 40);
      ctx.closePath();
      ctx.fill();

      // House Walls
      ctx.fillStyle = "#f5ebd8"; // Colonial white-cream siding
      ctx.fillRect(houseX, houseY + 40, houseW, houseH);

      // Wooden Trim & Windows
      ctx.fillStyle = "#fff8ee";
      ctx.fillRect(houseX + 30, houseY + 70, 70, 80);
      ctx.fillRect(houseX + houseW - 100, houseY + 70, 70, 80);
      ctx.strokeStyle = "#4a3525";
      ctx.lineWidth = 4;
      ctx.strokeRect(houseX + 30, houseY + 70, 70, 80);
      ctx.strokeRect(houseX + houseW - 100, houseY + 70, 70, 80);

      // Window panes grid
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(houseX + 65, houseY + 70); ctx.lineTo(houseX + 65, houseY + 150);
      ctx.moveTo(houseX + 30, houseY + 110); ctx.lineTo(houseX + 100, houseY + 110);
      ctx.moveTo(houseX + houseW - 65, houseY + 70); ctx.lineTo(houseX + houseW - 65, houseY + 150);
      ctx.moveTo(houseX + houseW - 100, houseY + 110); ctx.lineTo(houseX + houseW - 30, houseY + 110);
      ctx.stroke();

      // Porch Door
      ctx.fillStyle = "#8c4a2b";
      ctx.fillRect(houseX + houseW / 2 - 35, houseY + 110, 70, 110);
      ctx.fillStyle = "#e0a96d";
      ctx.beginPath();
      ctx.arc(houseX + houseW / 2 + 20, houseY + 165, 5, 0, Math.PI * 2);
      ctx.fill();

      // Sign post: "Ferris Missionary House - Dallas TX"
      ctx.fillStyle = "#3e2723";
      ctx.fillRect(houseX - 15, houseY + 160, 10, 80);
      ctx.fillStyle = "#fff8eb";
      ctx.fillRect(houseX - 45, houseY + 130, 70, 32);
      ctx.strokeStyle = "#8d6e63";
      ctx.lineWidth = 2;
      ctx.strokeRect(houseX - 45, houseY + 130, 70, 32);
      ctx.fillStyle = "#4e342e";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("FERRIS HOUSE", houseX - 42, houseY + 144);
      ctx.font = "7px sans-serif";
      ctx.fillText("Dallas, Texas", houseX - 38, houseY + 155);

      // Lush Texas Pine Trees & Green Lawn
      ctx.fillStyle = "#38761d";
      ctx.fillRect(0, height * 0.72, width, height * 0.28);

      // Background Pine Trees (Dallas Pine Woods)
      const drawPineTree = (tx: number, ty: number, scale: number) => {
        ctx.save();
        ctx.translate(tx, ty);
        ctx.scale(scale, scale);
        ctx.fillStyle = "#5c3a21";
        ctx.fillRect(-8, 0, 16, 50);
        ctx.fillStyle = "#2d5a27";
        ctx.beginPath();
        ctx.moveTo(0, -90); ctx.lineTo(-40, -30); ctx.lineTo(40, -30); ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, -60); ctx.lineTo(-48, -5); ctx.lineTo(48, -5); ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, -30); ctx.lineTo(-55, 20); ctx.lineTo(55, 20); ctx.closePath(); ctx.fill();
        ctx.restore();
      };

      drawPineTree(width * 0.05, height * 0.7, 0.7);
      drawPineTree(width * 0.88, height * 0.68, 0.85);
      drawPineTree(width * 0.96, height * 0.72, 0.75);

      // 2. Character: Sister Shin ("신자매님")
      // Subtle natural breathing & speaking motion
      const speakBounce = isPlaying ? Math.sin(tick * 8) * 3 : Math.sin(tick * 1.5) * 1.5;
      const headTilt = isPlaying ? Math.sin(tick * 4) * 0.04 : 0;

      const charX = width * 0.62;
      const charY = height * 0.45 + speakBounce;

      ctx.save();
      ctx.translate(charX, charY);

      // Shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.beginPath();
      ctx.ellipse(0, 180, 75, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Outfit (Elegant warm beige jacket over dark dress)
      ctx.fillStyle = "#3e4a3d"; // Dark forest dress
      ctx.beginPath();
      ctx.moveTo(-45, 100);
      ctx.lineTo(-65, 180);
      ctx.lineTo(65, 180);
      ctx.lineTo(45, 100);
      ctx.closePath();
      ctx.fill();

      // Cardigan / Jacket
      ctx.fillStyle = "#d4a373"; // Warm mustard gold jacket
      ctx.beginPath();
      ctx.moveTo(-45, 45);
      ctx.lineTo(-70, 160);
      ctx.lineTo(-20, 175);
      ctx.lineTo(-10, 75);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(45, 45);
      ctx.lineTo(70, 160);
      ctx.lineTo(20, 175);
      ctx.lineTo(10, 75);
      ctx.closePath();
      ctx.fill();

      // Neck & Scarf
      ctx.fillStyle = "#f5d0a9";
      ctx.fillRect(-12, 30, 24, 20);
      ctx.fillStyle = "#e6be8a"; // Subtle shadow
      ctx.fillRect(-10, 42, 20, 8);

      // Head & Face
      ctx.save();
      ctx.rotate(headTilt);

      // Hair (Back)
      ctx.fillStyle = "#2c2416";
      ctx.beginPath();
      ctx.arc(0, 15, 42, 0, Math.PI * 2);
      ctx.fill();

      // Face shape
      ctx.fillStyle = "#f8d5b2";
      ctx.beginPath();
      ctx.ellipse(0, 15, 30, 34, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cheeks (Rosy blush)
      ctx.fillStyle = "rgba(235, 130, 120, 0.35)";
      ctx.beginPath(); ctx.arc(-16, 20, 8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(16, 20, 8, 0, Math.PI * 2); ctx.fill();

      // Hair (Front style)
      ctx.fillStyle = "#2c2416";
      ctx.beginPath();
      ctx.arc(0, 0, 34, Math.PI * 0.95, Math.PI * 2.05);
      ctx.fill();
      // Bangs / Side locks
      ctx.beginPath(); ctx.ellipse(-24, 15, 10, 25, 0.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(24, 15, 10, 25, -0.2, 0, Math.PI * 2); ctx.fill();

      // Eyes (Warm smiling eyes)
      ctx.strokeStyle = "#1a120b";
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(-13, 12, 6, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(13, 12, 6, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      // Eyebrows
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#4a3b2c";
      ctx.beginPath(); ctx.arc(-13, 3, 9, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
      ctx.beginPath(); ctx.arc(13, 3, 9, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();

      // Nose
      ctx.strokeStyle = "#d49a75";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 18, 3, 0, Math.PI * 0.8);
      ctx.stroke();

      // Mouth (Talking or Smiling)
      const mouthOpen = isPlaying ? Math.abs(Math.sin(tick * 10)) * 6 + 4 : 4;
      ctx.fillStyle = "#d9534f";
      ctx.beginPath();
      ctx.ellipse(0, 29, 9, mouthOpen, 0, 0, Math.PI);
      ctx.fill();
      ctx.strokeStyle = "#b52b27";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore(); // end head tilt rotate

      // Arms holding the giant pinecone
      ctx.fillStyle = "#f5d0a9";
      // Left Arm & Hand
      ctx.beginPath();
      ctx.moveTo(-45, 60);
      ctx.quadraticCurveTo(-35, 115, -15, 110);
      ctx.lineWidth = 16;
      ctx.strokeStyle = "#d4a373";
      ctx.stroke();

      // Right Arm & Hand
      ctx.beginPath();
      ctx.moveTo(45, 60);
      ctx.quadraticCurveTo(35, 115, 15, 110);
      ctx.stroke();

      // 3. THE GIANT PINECONE (커다란 솔방울)
      const pcX = 0;
      const pcY = 100 + Math.sin(tick * 3) * 2;
      const pcW = 48;
      const pcH = 68;

      // Pinecone aura/glow
      const pcGlow = ctx.createRadialGradient(pcX, pcY, 10, pcX, pcY, 60);
      pcGlow.addColorStop(0, "rgba(255, 230, 170, 0.6)");
      pcGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = pcGlow;
      ctx.beginPath();
      ctx.ellipse(pcX, pcY, 60, 75, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pinecone Base Shape
      ctx.fillStyle = "#5c3317";
      ctx.beginPath();
      ctx.ellipse(pcX, pcY, pcW, pcH, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pinecone Scales (Detailed overlapping texture)
      const scaleRows = 6;
      for (let r = 0; r < scaleRows; r++) {
        const rowY = pcY - pcH + 18 + r * 18;
        const count = 5 - Math.abs(r - 3);
        const startX = pcX - (count - 1) * 11;
        for (let i = 0; i < count; i++) {
          const scX = startX + i * 22;
          ctx.fillStyle = (r + i) % 2 === 0 ? "#8b5a2b" : "#6f421b";
          ctx.beginPath();
          ctx.arc(scX, rowY, 10, 0, Math.PI * 2);
          ctx.fill();
          // Highlight edge on each scale
          ctx.strokeStyle = "#d2b48c";
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(scX, rowY - 2, 8, Math.PI * 0.2, Math.PI * 0.8);
          ctx.stroke();
        }
      }

      // Hands holding pinecone
      ctx.fillStyle = "#f8d5b2";
      ctx.beginPath(); ctx.ellipse(-22, pcY + 10, 10, 8, 0.3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(22, pcY + 10, 10, 8, -0.3, 0, Math.PI * 2); ctx.fill();

      ctx.restore(); // end character restore

      // Floating light sparkles (Texas pine forest sunshine particles)
      for (let p = 0; p < 18; p++) {
        const px = (Math.sin(tick * 0.4 + p * 2.3) * 0.5 + 0.5) * width;
        const py = (Math.cos(tick * 0.3 + p * 1.7) * 0.5 + 0.5) * height;
        const pSize = Math.sin(tick + p) * 2.5 + 3.5;
        ctx.fillStyle = `rgba(255, 245, 200, ${Math.sin(tick * 2 + p) * 0.4 + 0.5})`;
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Audio Waveform Visualization Overlay (when playing)
      if (isPlaying) {
        ctx.fillStyle = "rgba(212, 163, 115, 0.7)";
        const barCount = 32;
        const barWidth = 6;
        const startX = width / 2 - (barCount * (barWidth + 4)) / 2;
        for (let b = 0; b < barCount; b++) {
          const h = Math.abs(Math.sin(tick * 6 + b * 0.4)) * 28 + 6;
          ctx.fillRect(startX + b * (barWidth + 4), height - 20 - h, barWidth, h);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 border border-amber-900/30 font-sans transition-all ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none max-w-none" : "max-w-4xl mx-auto"
      }`}
    >
      {/* Top Video Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
            <Video size={14} className="animate-pulse" />
            달라스 훼리스 선교사 댁 현장 영상
          </span>
          <span className="text-xs text-amber-200/80 hidden sm:flex items-center gap-1">
            <MapPin size={12} /> Dallas, Texas, USA
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleShare}
            className="p-2 bg-white/15 hover:bg-white/30 backdrop-blur-md rounded-full transition-all text-white text-xs flex items-center gap-1.5 px-3"
            title="영상 공유"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Share2 size={14} />}
            <span>{copied ? "링크 복사됨!" : "공유"}</span>
          </button>
        </div>
      </div>

      {/* Canvas Animated Video Frame */}
      <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          width={854} 
          height={480} 
          className="w-full h-full object-contain cursor-pointer"
          onClick={togglePlay}
        />

        {/* Big Play Overlay Button when paused */}
        {!isPlaying && (
          <div 
            onClick={togglePlay}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer group transition-all"
          >
            <div className="w-20 h-20 bg-amber-600/90 group-hover:bg-amber-500 text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all pl-1">
              <Play size={40} />
            </div>
            <p className="mt-4 text-white font-serif font-bold text-lg text-shadow">
              신자매님의 달라스 인사 영상 재생하기
            </p>
            <p className="text-amber-200/90 text-xs mt-1">
              "안녕하세요 신자매예요 여기는 달라스에 있는 훼리스 선교사 집이에요..."
            </p>
          </div>
        )}

        {/* Subtitles Overlay (자막) */}
        {currentSubtitle && (
          <div className="absolute bottom-16 left-6 right-6 z-20 pointer-events-none flex justify-center">
            <div className="bg-black/80 backdrop-blur-md border border-amber-500/30 text-amber-100 font-serif text-lg md:text-xl font-bold px-6 py-2.5 rounded-2xl shadow-2xl text-center animate-fade-in max-w-2xl">
              {currentSubtitle}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Video Controls Scrubber & Buttons */}
      <div className="bg-neutral-900/95 backdrop-blur-md p-4 text-white border-t border-white/10">
        {/* Scrubber Bar */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-neutral-400 font-mono w-10 text-right">{formatTime(currentTime)}</span>
          <input 
            type="range" 
            min={0} 
            max={duration} 
            step={0.1}
            value={currentTime} 
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setCurrentTime(val);
              if (isPlaying) {
                triggerSpeech(val);
              }
            }}
            className="flex-grow h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-xs text-neutral-400 font-mono w-10">{formatTime(duration)}</span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={togglePlay} 
              className="p-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-full transition-all shadow-md"
              title={isPlaying ? "일시정지" : "재생"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="pl-0.5" />}
            </button>
            <button 
              onClick={handleRestart} 
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-full transition-all"
              title="처음부터 다시 재생"
            >
              <RotateCcw size={16} />
            </button>
            <button 
              onClick={() => setIsMuted(!isMuted)} 
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-full transition-all"
              title={isMuted ? "음소거 해제" : "음소거"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Speech Speed selector */}
            <div className="flex items-center gap-1 bg-neutral-800 rounded-full px-2 py-1 text-xs">
              <span className="text-neutral-400 pl-1">배속:</span>
              {[0.8, 1.0, 1.25].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSpeechSpeed(spd)}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
                    speechSpeed === spd ? "bg-amber-600 text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-amber-400 font-medium">
              <Sparkles size={14} /> 커다란 솔방울 인사 영상
            </span>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-full transition-all"
              title="전체화면"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Video Description Box */}
      <div className="p-6 bg-neutral-950 border-t border-neutral-800 text-left">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-amber-900/60 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-700/50">
            특별 영상 소식
          </span>
          <span className="text-xs text-neutral-400">2026.10.06 | 미국 달라스 현장</span>
        </div>
        <h3 className="text-xl font-serif font-bold text-white mb-2">
          신자매님의 달라스 훼리스 선교사 댁 첫 인사 (커다란 솔방울)
        </h3>
        <p className="text-neutral-300 text-sm leading-relaxed mb-4">
          미국 달라스에 위치한 훼리스 선교사 댁에서 신자매님이 손에 커다란 솔방울을 들고 
          광명교회 모든 성도님들께 따뜻한 감사와 기쁨의 인사를 전해드립니다.
        </p>

        {/* Quote Card */}
        <div className="bg-amber-950/40 border-l-4 border-amber-500 p-4 rounded-r-xl">
          <p className="text-amber-200 font-serif italic text-base">
            "안녕하세요 신자매예요 여기는 달라스에 있는 훼리스 선교사 집이에요 여기는 모든것이 새로와요"
          </p>
        </div>
      </div>
    </div>
  );
}
