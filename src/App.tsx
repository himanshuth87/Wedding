/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, MapPin, Calendar, Clock, Heart, MessageCircle, Mic } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Assets ---
import logoImg from './assets/logo.png';
import templeImg from './assets/temple.jpg';
import goldFoilImg from './assets/gold_foil.png';
import doorsImg from './assets/palace_doors.png';

// --- Constants & Data ---

const WEDDING_DATE = new Date('2026-06-27T12:30:00');

const EVENTS = [
  {
    day: 'Day 1',
    date: 'Friday · 26th June 2026',
    items: [
      { time: '1:00 PM', name: 'साखरपुडा & Ring Ceremony 💍', desc: 'Attire: Ivory & Gold Ethnic Wear' },
      { time: '1:00 PM', name: 'Lunch 🍽️', desc: '1st Floor Dining Hall · Onwards' },
      { time: '3:00 PM', name: 'सीमंत पूजन (Meet & Greet) 🌸', desc: 'Welcoming the guests' },
      { time: '7:00 PM', name: 'Sangeet Night & DJ Night ✨', desc: 'Attire: Indowestern Glamour' },
      { time: '10:00 PM', name: 'Dinner 🍛', desc: '1st Floor Dining Hall · Onwards' },
    ]
  },
  {
    day: 'Day 2',
    date: 'Saturday · 27th June 2026',
    items: [
      { time: '6:00 AM', name: 'हळद 🌼', desc: 'Attire: Shades of Yellow' },
      { time: '8:00 AM', name: 'सप्तपदी 🪷', desc: 'Sacred Rituals' },
      { time: '11:00 AM', name: 'वरात 🎺', desc: 'Wedding Procession' },
      { time: '12:30 PM', name: 'मंगलाष्टक (Shubh Muhurat) 💒', desc: 'Attire: Maharashtrian Ethnic Wear' },
      { time: '1:00 PM', name: 'Lunch 🍽️', desc: '1st Floor Dining Hall · Onwards' },
      { time: '2:30 PM', name: 'Clicks with the couple 📸', desc: 'Attire: Indowestern (Optional) · Until 3:30pm' },
      { time: '4:00 PM', name: 'Rooms Checkout 🏢', desc: 'Departure with memories' },
    ]
  }
];

const WARDROBE = [
  { icon: '✨', event: 'Ring Ceremony', desc: 'Ivory & Gold Ethnic' },
  { icon: '👗', event: 'Sangeet', desc: 'Indowestern Glamour' },
  { icon: '🌼', event: 'Haldi', desc: 'Shades of Yellow' },
  { icon: '🌺', event: 'Wedding', desc: 'Maharashtrian Ethnic' },
  { icon: '📸', event: 'Clicks', desc: 'Indowestern (Optional)' },
  { icon: '🏢', event: 'Stay', desc: 'Comfortable & Classy' },
];

// --- Components ---

const ScratchToReveal = ({ children, onReveal }: { children: React.ReactNode, onReveal?: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = goldFoilImg;
    img.onload = () => {
      const resize = () => {
        const rect = canvas.parentElement?.getBoundingClientRect();
        if (rect) {
          canvas.width = rect.width;
          canvas.height = rect.height;
          
          // Draw texture
          const pattern = ctx.createPattern(img, 'repeat');
          if (pattern) {
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else {
            ctx.fillStyle = '#D4AF37';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          
          // Text Overlay
          ctx.font = '600 24px Cinzel';
          ctx.fillStyle = '#610000';
          ctx.textAlign = 'center';
          ctx.fillText('Scratch To Reveal', canvas.width / 2, canvas.height / 2);
        }
      };

      resize();
      window.addEventListener('resize', resize);
      return () => window.removeEventListener('resize', resize);
    };
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isRevealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getPos(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] < 128) transparent++;
    }
    const percent = (transparent / (pixels.length / 4)) * 100;
    if (percent > 45) {
      setIsRevealed(true);
      if (onReveal) onReveal();
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto min-h-[320px] flex items-center justify-center overflow-hidden rounded-xl royal-shadow">
      <div className={`w-full transition-opacity duration-1000 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
      {!isRevealed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-crosshair touch-none z-20"
          onMouseDown={() => setIsDrawing(true)}
          onMouseUp={() => setIsDrawing(false)}
          onMouseLeave={() => setIsDrawing(false)}
          onMouseMove={scratch}
          onTouchStart={() => setIsDrawing(true)}
          onTouchEnd={() => setIsDrawing(false)}
          onTouchMove={scratch}
        />
      )}
    </div>
  );
};

const Countdown = ({ isVisible }: { isVisible: boolean }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      const diff = WEDDING_DATE.getTime() - new Date().getTime();
      if (diff <= 0) {
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg mx-auto mb-12"
    >
      {Object.entries(timeLeft).map(([label, value]) => (
        <motion.div 
          key={label}
          initial={{ y: 20, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          className="bg-white/40 border-none rounded-lg p-5 text-center royal-shadow"
        >
          <div className="font-cinzel text-3xl text-primary leading-none">
            {String(value).padStart(2, '0')}
          </div>
          <div className="text-[10px] tracking-[2px] uppercase text-on-surface/50 mt-1">{label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const Petals = () => {
  const emojis = ['🌸', '🌺', '🌼', '🪷', '❀'];
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="petal text-lg"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 8}s`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        >
          {emojis[Math.floor(Math.random() * emojis.length)]}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleOpen = () => {
    if (isOpened) return;
    setIsOpened(true);
    setTimeout(() => {
      setShowContent(true);
    }, 1500);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const playVoice = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(
      "Anuja and Aditya joyfully invite you to their wedding celebration. " +
      "The festivities take place on the 26th and 27th of June 2026, in Alandi, Pune. " +
      "Please join us and be a part of this divine union. We await you with love."
    );
    msg.rate = 0.85;
    msg.pitch = 1.1;
    window.speechSynthesis.speak(msg);
  };

  return (
    <div className="min-h-screen relative bg-background selection:bg-primary-container selection:text-white">
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_115b9b5c1d.mp3" />

      <AnimatePresence>
        {!showContent && (
          <motion.div
            id="doorPage"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-primary"
            onClick={handleOpen}
          >
            {/* Premium Door Image Background */}
            <div className="absolute inset-0 z-0">
              <img src={doorsImg} alt="Palace Doors" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-primary/80" />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            <motion.p
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="font-devanagari text-gold-light text-xl tracking-[6px] mb-8"
            >
              ॥ श्री गणेशाय नमः ॥
            </motion.p>

            <div className="relative w-[300px] h-[450px] royal-shadow">
              {/* Door Glow */}
              <div className={`absolute top-[80px] left-[20px] right-[20px] h-[345px] z-0 transition-all duration-1500 ${isOpened ? 'door-glow-lit opacity-100' : 'opacity-0'}`} />

              {/* Arch */}
              <div className="absolute top-0 left-0 right-0 h-[85px] bg-gradient-to-br from-secondary via-gold to-secondary rounded-t-[150px] flex flex-col items-center justify-center">
                <span className="text-2xl mt-1">🕉️</span>
              </div>

              {/* Pillars */}
              <div className="absolute top-[80px] left-0 w-5 h-[345px] bg-gradient-to-r from-secondary via-gold to-secondary" />
              <div className="absolute top-[80px] right-0 w-5 h-[345px] bg-gradient-to-r from-secondary via-gold to-secondary" />

              {/* Left Door */}
              <motion.div
                initial={false}
                animate={{ rotateY: isOpened ? -125 : 0 }}
                transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
                className="absolute top-[80px] left-5 w-[130px] h-[345px] bg-gradient-to-b from-[#4A0000] via-primary to-[#2D0000] origin-left overflow-hidden z-10"
              >
                <div className="absolute inset-0 flex flex-col p-4 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex-1 border border-gold/10 rounded-sm relative">
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <Heart className="w-10 h-10 text-gold" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right Door */}
              <motion.div
                initial={false}
                animate={{ rotateY: isOpened ? 125 : 0 }}
                transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
                className="absolute top-[80px] right-5 w-[130px] h-[345px] bg-gradient-to-b from-[#4A0000] via-primary to-[#2D0000] origin-right overflow-hidden z-10"
              >
                <div className="absolute inset-0 flex flex-col p-4 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex-1 border border-gold/10 rounded-sm relative">
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <Heart className="w-10 h-10 text-gold" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Step */}
              <div className="absolute -bottom-[25px] -left-[20px] -right-[20px] h-[25px] bg-gradient-to-r from-secondary via-gold-light to-secondary rounded-b-xl" />
            </div>

            <div className="mt-10 px-8 text-center max-w-sm">
              <p className="font-devanagari text-gold-light/90 text-sm leading-relaxed">
                वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।<br/>
                निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
              </p>
            </div>

            <motion.p
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-8 text-gold-light/40 font-cinzel text-xs tracking-[5px]"
            >
              ✦ Tap to Step Inside ✦
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {!showContent && <div className="fixed inset-0 bg-background -z-10" />}

      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <Petals />

          {/* Floating Controls */}
          <div className="fixed top-6 right-6 z-40 flex items-center gap-3">
             <button
              onClick={toggleMusic}
              className="w-12 h-12 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-primary royal-shadow hover:bg-white/60 transition-all border-none"
            >
              <Music className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
            </button>
          </div>

          {/* Hero Section */}
          <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center p-8 relative overflow-hidden bg-background">
            <div className="absolute top-0 left-0 right-0 h-56 pointer-events-none opacity-80">
              <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                <path d="M0,0 L400,0 L400,100 C350,120 300,80 250,100 C200,120 150,80 100,100 C50,120 0,80 0,100 Z" fill="#D4AF37" opacity="0.1" />
              </svg>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative z-10"
            >
              <p className="font-devanagari text-primary text-2xl font-semibold mb-6 tracking-widest opacity-80">सस्नेह आमंत्रण</p>

              <div className="my-10 flex justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative w-64 h-64 flex items-center justify-center"
                >
                  <img src={logoImg} alt="Anuja & Aditya Monogram" className="w-full h-full object-contain drop-shadow-2xl" />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="font-devanagari text-5xl md:text-7xl text-primary font-bold mb-4 tracking-normal leading-tight">
                  अनुजा आणि आदित्य
                </h1>
                <p className="font-devanagari text-secondary text-3xl mt-4 font-medium tracking-wide">शुभविवाह सोहळा</p>
                <div className="mt-12 flex flex-col items-center">
                   <div className="w-16 h-px bg-gold/30 mb-6" />
                   <p className="font-cinzel text-primary text-xs tracking-[8px] opacity-60">SCROLL TO DISCOVER</p>
                </div>
              </motion.div>
            </motion.div>
          </section>

          <section id="countdown" className="py-24 px-8 bg-primary text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="font-cinzel text-gold-light text-xs tracking-[5px] uppercase mb-3 opacity-60">SAVE THE DATE</p>
              <h2 className="text-4xl font-cinzel text-white mb-6">27 June 2026</h2>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold-light/40 to-transparent mx-auto mb-16" />
              
              <ScratchToReveal onReveal={() => {
                setIsRevealed(true);
                confetti({
                  particleCount: 150,
                  spread: 70,
                  origin: { y: 0.6 },
                  colors: ['#D4AF37', '#fed65b', '#610000']
                });
              }}>
                <div className="flex flex-col items-center">
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    className="font-garamond italic text-gold-light text-3xl mb-10"
                  >
                    27th June 2026
                  </motion.p>
                  <Countdown isVisible={isRevealed} />
                </div>
              </ScratchToReveal>
            </motion.div>
          </section>

          {/* Wardrobe Section */}
          <section id="wardrobe" className="py-24 px-8 bg-background">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-20">
                <p className="font-cinzel text-primary text-xs tracking-[5px] uppercase mb-3 opacity-60">Dress Code</p>
                <h2 className="text-4xl font-cinzel text-primary mb-6">Ceremonial Wardrobe</h2>
                <div className="w-32 h-px bg-gold/20 mx-auto" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {WARDROBE.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/50 border-none rounded-xl p-8 text-center royal-shadow hover:translate-y-[-8px] transition-all duration-500"
                  >
                    <span className="text-5xl mb-6 block">{item.icon}</span>
                    <h3 className="font-cinzel text-base text-primary font-bold mb-3">{item.event}</h3>
                    <p className="font-garamond text-sm text-on-surface/60 italic leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Events Section */}
          <section id="events" className="py-24 px-8 bg-white/30">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-20">
                <p className="font-cinzel text-primary text-xs tracking-[5px] uppercase mb-3 opacity-60">Schedule</p>
                <h2 className="text-4xl font-cinzel text-primary mb-6">The Royal Itinerary</h2>
                <div className="w-32 h-px bg-gold/20 mx-auto" />
              </div>

              {EVENTS.map((day, di) => (
                <div key={di} className="mb-20 last:mb-0">
                  <div className="bg-primary flex flex-col md:flex-row justify-between items-center px-8 py-5 rounded-xl mb-10 royal-shadow">
                    <h3 className="font-cinzel text-xl text-white tracking-widest">{day.day}</h3>
                    <span className="font-garamond text-white/70 italic text-sm">{day.date}</span>
                  </div>
                  <div className="space-y-6">
                    {day.items.map((item, ii) => (
                      <motion.div
                        key={ii}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: ii * 0.05 }}
                        className="flex gap-6 items-start p-6 bg-white/40 rounded-xl royal-shadow hover:bg-white/60 transition-colors group"
                      >
                        <div className="font-cinzel text-xs text-secondary font-bold min-w-[80px] pt-1">{item.time}</div>
                        <div className="w-2.5 h-2.5 rounded-full bg-gold-light border-2 border-primary mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                        <div>
                          <h4 className="font-cinzel text-base text-primary font-bold mb-1">{item.name}</h4>
                          <p className="font-garamond text-sm text-on-surface/60 italic">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Venue Section */}
          <section id="venue" className="py-24 px-8 bg-background">
            <div className="max-w-3xl mx-auto text-center">
              <p className="font-cinzel text-primary text-xs tracking-[5px] uppercase mb-3 opacity-60">विवाह स्थळ</p>
              <h2 className="text-4xl font-cinzel text-primary mb-6">The Sacred Venue</h2>
              <div className="w-32 h-px bg-gold/20 mx-auto mb-16" />

              <div className="bg-white/60 rounded-2xl p-0 relative overflow-hidden royal-shadow">
                <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-gold/5 blur-3xl animate-pulse" />
                <div className="w-full h-[400px] overflow-hidden grayscale-[30%] hover:grayscale-0 transition-all duration-700">
                  <img src={templeImg} alt="Alandi Temple" className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000" />
                </div>
                <div className="p-12">
                  <h3 className="font-devanagari text-4xl text-primary font-bold mb-3">अवधूत बँक्वेट हॉल</h3>
                  <p className="font-garamond text-2xl text-secondary italic mb-6">Avadhoot Banquet Hall</p>
                  <p className="font-devanagari text-xl text-on-surface/70 italic leading-relaxed mb-10">
                    देवाची आळंदी, पुणे
                  </p>
                  <a
                    href="https://maps.google.com/?q=Avadhoot+Banquet+Hall,Alandi,Pune"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-full font-cinzel text-xs tracking-[3px] hover:bg-primary/90 transition-all hover:scale-105 royal-shadow"
                  >
                    <MapPin className="w-4 h-4" /> Open In Google Maps
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* RSVP Section */}
          <section id="rsvp" className="py-32 px-8 bg-primary text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" 
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, #FFD700 0, #FFD700 1px, transparent 1px, transparent 50px)' }} />

            <div className="relative z-10 max-w-2xl mx-auto">
              <p className="font-cinzel text-gold-light text-xs tracking-[6px] uppercase mb-4 opacity-70">Presence & Blessings</p>
              <h2 className="text-4xl font-devanagari text-white mb-6">आपली उपस्थिती व शुभाशिर्वाद लाभावेत ही विनंती</h2>
              <div className="text-5xl mb-10 text-gold-light opacity-60">🙌</div>
              <div className="w-24 h-px bg-gold-light/20 mx-auto mb-12" />

              <div className="space-y-4 mb-16">
                <p className="font-devanagari text-2xl text-gold-light tracking-widest font-bold">शुभेच्छुक</p>
                <p className="font-devanagari text-3xl text-white tracking-widest leading-loose">
                  मुळीक व कुलकर्णी परिवार 💐
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <a
                  href="https://wa.me/80927302812?text=Hi%21%20Confirming%20my%20attendance%20for%20Anuja%20%26%20Aditya%27s%20wedding%20%F0%9F%8C%B8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-10 py-5 rounded-full font-cinzel text-sm tracking-[2px] shadow-2xl hover:scale-105 transition-all"
                >
                  <MessageCircle className="w-5 h-5" /> Confirm On WhatsApp
                </a>
              </div>
            </div>
          </section>

          <footer className="bg-primary/95 py-16 text-center border-t border-gold-light/10">
            <div className="font-cinzel text-2xl text-white mb-3 tracking-widest">
              ANUJA <Heart className="inline w-5 h-5 text-gold-light mx-2 fill-gold-light" /> ADITYA
            </div>
            <div className="font-devanagari text-gold-light text-xl mb-6 tracking-[10px]">॥ शुभ विवाह ॥</div>
            <div className="text-[10px] text-white/30 tracking-[6px] uppercase font-cinzel">26 – 27 JUNE 2026 · ALANDI, PUNE</div>
          </footer>
        </motion.div>
      )}
    </div>
  );
}
