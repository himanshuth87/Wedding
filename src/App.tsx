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
import doorsImg from './assets/ceremony_doors.png';
import ganpatiImg from './assets/ganpati.png';
import scrollImg from './assets/scroll.png';

// --- Constants & Data ---

const WEDDING_DATE = new Date('2026-06-27T12:30:00');

const EVENTS = [
  {
    day: 'Day 1 | 26th June',
    items: [
      { id: 1, time: '1:00 PM', name: 'साखरपुडा & Ring Ceremony 💍', desc: 'Attire: Ivory & Gold Ethnic Wear' },
      { id: 2, time: '1:00 PM', name: 'Lunch 🍽️', desc: '1st Floor Dining Hall · Onwards' },
      { id: 3, time: '3:00 PM', name: 'सीमंत पूजन (Meet & Greet) 🌸', desc: 'Welcoming the guests' },
      { id: 4, time: '7:00 PM', name: 'Sangeet & DJ Night ✨', desc: 'Attire: Indowestern Glamour' },
      { id: 5, time: '10:00 PM', name: 'Dinner 🍛', desc: '1st Floor Dining Hall · Onwards' },
    ]
  },
  {
    day: 'Day 2 | 27th June',
    items: [
      { id: 1, time: '6:00 AM', name: 'हळद 🌼', desc: 'Attire: Shades of Yellow' },
      { id: 2, time: '8:00 AM', name: 'सप्तपदी 🪷', desc: 'Sacred Rituals' },
      { id: 3, time: '11:00 AM', name: 'वरात 🎺', desc: 'Wedding Procession' },
      { id: 4, time: '12:30 PM', name: 'मंगलाष्टक (Shubh Muhurat) 💒', desc: 'Attire: Maharashtrian Ethnic Wear' },
      { id: 5, time: '1:00 PM', name: 'Lunch 🍽️', desc: '1st Floor Dining Hall · Onwards' },
      { id: 6, time: '2:30 PM', name: 'Clicks with the couple 📸', desc: 'Attire: Indowestern (Optional)' },
      { id: 7, time: '4:00 PM', name: 'Rooms Checkout 🏢', desc: 'Departure with memories' },
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
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 flex cursor-pointer overflow-hidden bg-primary"
            onClick={handleOpen}
          >
            {/* Background revealed during opening */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 z-0 text-center bg-primary">
               <motion.div
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={isOpened ? { opacity: 0.2, scale: 1 } : { opacity: 0 }}
                 className="absolute inset-0 blur-xl"
               >
                 <img src={ganpatiImg} alt="" className="w-full h-full object-contain p-20" />
               </motion.div>
               <motion.div
                 animate={{ opacity: [0.3, 0.7, 0.3] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="relative z-10 text-gold-light font-devanagari text-2xl tracking-[10px]"
               >
                 ॥ श्री गणेशाय नमः ॥
               </motion.div>
            </div>

            {/* Left Door */}
            <motion.div 
              animate={isOpened ? { x: '-100%' } : { x: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="w-1/2 h-full relative z-10 border-r border-gold/20"
            >
              <img src={doorsImg} alt="" className="w-full h-full object-cover object-left" />
              <div className="absolute inset-0 bg-black/10" />
            </motion.div>
            
            {/* Right Door */}
            <motion.div 
              animate={isOpened ? { x: '100%' } : { x: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="w-1/2 h-full relative z-10 border-l border-gold/20"
            >
              <img src={doorsImg} alt="" className="w-full h-full object-cover object-right" />
              <div className="absolute inset-0 bg-black/10" />
            </motion.div>

            <div className="absolute bottom-16 left-0 right-0 z-20 text-center">
              <motion.p
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-gold-light text-xs tracking-[8px] uppercase font-cinzel"
              >
                Tap To Enter
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showContent && <div className="fixed inset-0 bg-primary -z-10" />}

      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <Petals />

          {/* Section 1: Ganpati Shloka Card (Burgundy) */}
          <section className="min-h-screen bg-primary flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="max-w-xl w-full"
            >
              <div className="inline-block border border-gold-light/40 px-8 py-3 mb-10 rounded-sm">
                <p className="font-devanagari text-gold-light text-xl tracking-widest shloka-glow">॥ श्री गणेशाय नमः ॥</p>
              </div>
              
              <div className="mb-12 flex justify-center">
                <motion.img 
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  src={ganpatiImg} 
                  alt="Ganesha" 
                  className="w-56 h-56 object-contain drop-shadow-[0_0_50px_rgba(212,175,55,0.4)]"
                />
              </div>

              <div className="space-y-6">
                <h2 className="font-devanagari text-3xl text-gold-light leading-relaxed font-bold tracking-wide">
                  वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।<br />
                  निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
                </h2>
                <div className="w-24 h-px bg-gold-light/20 mx-auto my-8" />
                <p className="font-garamond text-gold-light/60 italic text-xl max-w-sm mx-auto leading-relaxed">
                  O Lord, please make me free from obstacles in all my works at all times.
                </p>
              </div>
            </motion.div>

            <button
              onClick={toggleMusic}
              className="absolute bottom-10 right-10 z-[100] bg-gold-light/10 p-5 rounded-full text-gold-light backdrop-blur-md border border-gold-light/20 shadow-2xl hover:scale-110 transition-all"
            >
              {isPlaying ? <Music className="w-6 h-6 animate-pulse" /> : <Music className="w-6 h-6 opacity-40" />}
            </button>
          </section>

          {/* Section 2: Affectionately Invited (Cream) */}
          <section className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-xl w-full bg-white/40 ring-1 ring-gold/20 p-16 royal-shadow relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-gold/10" />
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-gold/10" />

              <p className="font-garamond text-2xl text-primary/60 italic mb-12">Affectionately invited</p>
              
              <div className="mb-14 flex justify-center">
                <img src={logoImg} alt="Monogram" className="w-48 h-48 object-contain" />
              </div>

              <div className="space-y-4 mb-14">
                <p className="font-cinzel text-xs text-primary/40 tracking-[10px] uppercase">#A_Squared_LoveStory</p>
                <h1 className="font-devanagari text-6xl text-primary font-bold tracking-tight">अनुजा आणि आदित्य</h1>
              </div>

              <p className="font-garamond text-2xl text-secondary italic">Happy wedding ceremony</p>
            </motion.div>
          </section>

          {/* Section 3: Save The Date (Gold Scratch Reveal) */}
          <section className="py-32 px-8 bg-background flex flex-col items-center">
             <div className="max-w-xl w-full">
                <ScratchToReveal onReveal={() => {
                  setIsRevealed(true);
                  confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 }, colors: ['#D4AF37', '#610000', '#FDF8E1'] });
                }}>
                  <div className="p-16 text-center">
                    <motion.div
                      animate={isRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      className="space-y-4"
                    >
                      <p className="font-cinzel text-7xl text-primary font-bold tracking-tighter">27 JUNE 2026</p>
                    </motion.div>
                  </div>
                </ScratchToReveal>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="mt-20 text-center"
                >
                   <p className="font-devanagari text-primary/40 text-sm tracking-[5px] mb-8 uppercase">आम्हा उभयतांचे लग्न</p>
                   <img src={templeImg} alt="Temple Sketch" className="w-full opacity-60 mix-blend-multiply" />
                   
                   <div className="mt-16">
                     <Countdown isVisible={true} />
                   </div>
                </motion.div>
             </div>
          </section>

          {/* Section 4: Itinerary Scroll */}
          <section className="py-32 px-8 bg-background">
            <div className="max-w-2xl mx-auto relative min-h-[1200px] flex flex-col">
              <img src={scrollImg} alt="" className="absolute inset-0 w-full h-full object-fill z-0" />
              
              <div className="relative z-10 px-12 md:px-24 py-32 text-center">
                <h2 className="font-cinzel text-4xl text-primary font-bold mb-2">Outline of</h2>
                <h2 className="font-cinzel text-4xl text-primary font-bold mb-16 underline decoration-gold/20 underline-offset-8">the ceremony</h2>

                {EVENTS.map((day, di) => (
                  <div key={di} className="mb-20 last:mb-0">
                    <div className="bg-primary/5 border border-primary/10 inline-block py-3 px-10 mb-12">
                      <p className="font-cinzel text-sm text-primary font-bold tracking-[4px]">{day.day}</p>
                    </div>
                    
                    <div className="space-y-12 text-left">
                      {day.items.map((item) => (
                        <div key={item.id} className="flex gap-6 relative">
                          <span className="font-cinzel text-xs text-primary/20 mt-1">{item.id}.</span>
                          <div className="flex-1">
                            <p className="font-cinzel text-lg text-primary font-bold mb-1 leading-tight">
                              {item.name}
                            </p>
                            <div className="flex justify-between items-center text-[11px] font-garamond italic text-primary/50 border-b border-primary/5 pb-2">
                               <span>Time: {item.time}</span>
                               <span className="text-secondary">{item.desc}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                <div className="mt-24 space-y-6">
                   <p className="font-garamond text-2xl text-primary italic">I request you to attend and bless me</p>
                   <div className="flex justify-center py-4">
                     <span className="text-4xl">🙏</span>
                   </div>
                   <div className="w-16 h-px bg-primary/20 mx-auto" />
                   <div className="pt-4">
                     <p className="font-garamond text-sm italic text-secondary mb-1">Best wishes from</p>
                     <p className="font-cinzel text-lg text-primary font-bold tracking-[3px]">Mulik and Kulkarni family</p>
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Venue (Burgundy) */}
          <section className="py-32 px-8 bg-primary text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstripe-dark.png')]" />
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-xl mx-auto"
            >
              <p className="font-cinzel text-gold-light/40 text-xs tracking-[8px] uppercase mb-16">Wedding Venue</p>
              
              <div className="space-y-6 mb-20 bg-black/20 p-16 rounded-[40px] border border-gold-light/10 burgundy-shadow">
                <h3 className="font-devanagari text-6xl text-gold-light font-bold mb-2">अवधूत बँक्वेट हॉल</h3>
                <h3 className="font-cinzel text-3xl text-white font-bold opacity-90">Avadhoot Banquet Hall</h3>
                <div className="w-12 h-px bg-gold-light/20 mx-auto my-8" />
                <p className="font-garamond text-2xl text-gold-light/70 italic">God's Alandi, Pune</p>
                
                <div className="pt-16">
                  <a
                    href="https://maps.google.com/?q=Avadhoot+Banquet+Hall,Alandi,Pune"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 bg-white text-primary px-14 py-6 rounded-sm font-cinzel text-xs tracking-[4px] hover:bg-gold-light transition-all shadow-2xl"
                  >
                    <MapPin className="w-4 h-4" /> Open In Maps
                  </a>
                </div>
              </div>

              <div className="flex justify-center gap-16 opacity-30 mt-32">
                 <img src={logoImg} className="w-16 h-16 object-contain invert" alt="" />
                 <img src={logoImg} className="w-16 h-16 object-contain invert" alt="" />
              </div>
            </motion.div>
          </section>

          <footer className="bg-primary py-20 text-center border-t border-white/5">
            <div className="text-[10px] text-white/20 tracking-[12px] uppercase font-cinzel">26 – 27 JUNE 2026 • ALANDI • PUNE</div>
          </footer>
        </motion.div>
      )}
    </div>
  );
}
