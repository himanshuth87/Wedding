import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, MapPin, Calendar, Clock, Heart, MessageCircle, Mic, ChevronRight, ChevronLeft, ArrowDown } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Assets ---
import logoImg from './assets/logo.png';
import templeImg from './assets/temple.jpg';
import goldFoilImg from './assets/gold_foil.png';
import doorsImg from './assets/ceremony_doors.png';
import ganpatiImg from './assets/ganpati.png';
import scrollImg from './assets/scroll.png';
import floralGanpatiImg from './assets/floral_ganpati.png';

// --- Constants & Data ---

const WEDDING_DATE = new Date('2026-06-27T12:30:00');

const EVENTS = [
  {
    day: 'Day 1 | 26th June',
    items: [
      { id: 1, time: '1:00 PM', name: 'साखरपुडा 💍', desc: 'Ring Ceremony' },
      { id: 2, time: '1:00 PM', name: 'Lunch 🍽️', desc: 'Dining Hall' },
      { id: 3, time: '3:00 PM', name: 'सीमंत पूजन 🌸', desc: 'Welcoming' },
      { id: 4, time: '7:00 PM', name: 'Sangeet ✨', desc: 'DJ Night' },
      { id: 5, time: '10:00 PM', name: 'Dinner 🍛', desc: 'Onwards' },
    ]
  },
  {
    day: 'Day 2 | 27th June',
    items: [
      { id: 1, time: '6:00 AM', name: 'हळद 🌼', desc: 'Shades of Yellow' },
      { id: 2, time: '8:00 AM', name: 'सप्तपदी 🪷', desc: 'Sacred Rituals' },
      { id: 3, time: '11:00 AM', name: 'वरात 🎺', desc: 'Procession' },
      { id: 4, time: '12:30 PM', name: 'मंगलाष्टक 💒', desc: 'Shubh Muhurat' },
      { id: 5, time: '1:00 PM', name: 'Lunch 🍽️', desc: 'Dining Hall' },
      { id: 6, time: '2:30 PM', name: 'Clicks 📸', desc: 'With Couple' },
      { id: 7, time: '4:00 PM', name: 'Checkout 🏢', desc: 'Departure' },
    ]
  }
];

// --- Sub-Components ---

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    className={`min-h-screen w-full relative flex items-center justify-center overflow-hidden ${className}`}
  >
    {children}
  </motion.section>
);

const ScratchToReveal = ({ children, onReveal }: { children: React.ReactNode, onReveal?: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = container.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    // Draw Premium Gold Foil Effect
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#BF953F');
    gradient.addColorStop(0.2, '#FCF6BA');
    gradient.addColorStop(0.4, '#B38728');
    gradient.addColorStop(0.7, '#FBF5B7');
    gradient.addColorStop(1, '#AA771C');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add some "gold grain" texture
    for (let i = 0; i < 1000; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
    }

    ctx.font = '600 18px Cinzel';
    ctx.fillStyle = '#610000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH HERE', width / 2, height / 2);
    
    // Aesthetic border on foil
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(5, 5, width - 10, height - 10);
  };

  useEffect(() => {
    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, []);

  const scratch = (e: any) => {
    if (!isDrawing || isRevealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    // Check progress
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparent++;
    }
    
    if (transparent / (pixels.length / 4) > 0.5) {
      setIsRevealed(true);
      if (onReveal) onReveal();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full aspect-square max-w-[300px] mx-auto overflow-hidden rounded-lg shadow-2xl border-4 border-gold/20 m-4">
      <div className={`w-full h-full flex items-center justify-center bg-white transform transition-all duration-1000 ${isRevealed ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        {children}
      </div>
      {!isRevealed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-crosshair touch-none z-20"
          onMouseDown={() => setIsDrawing(true)}
          onMouseUp={() => setIsDrawing(false)}
          onMouseMove={scratch}
          onTouchStart={() => setIsDrawing(true)}
          onTouchEnd={() => setIsDrawing(false)}
          onTouchMove={scratch}
        />
      )}
    </div>
  );
};

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = WEDDING_DATE.getTime() - new Date().getTime();
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 justify-center">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="bg-white/50 w-16 p-2 rounded border border-gold/10">
          <div className="text-xl font-cinzel text-primary font-bold">{String(value).padStart(2, '0')}</div>
          <div className="text-[8px] uppercase tracking-widest text-secondary">{label}</div>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const bookRef = useRef<any>(null);

  const handleOpen = () => {
    if (isOpened) return;
    setIsOpened(true);
    setTimeout(() => setShowBook(true), 2000);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-primary selection:bg-gold-light selection:text-primary scroll-smooth">
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_115b9b5c1d.mp3" />

      {/* Fixed UI Elements */}
      {showBook && (
        <>
          <button 
            onClick={toggleMusic} 
            className="fixed top-8 right-8 z-[100] p-4 bg-gold-light/10 rounded-full text-primary backdrop-blur-md border border-gold-light/20 shadow-xl hover:scale-110 transition-all cursor-pointer"
          >
            {isPlaying ? <Music className="animate-pulse" /> : <Music className="opacity-40" />}
          </button>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 text-primary/40 flex flex-col items-center gap-2 pointer-events-none"
          >
            <span className="font-cinzel text-[10px] tracking-[5px] uppercase">Scroll to explore</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </motion.div>
        </>
      )}

      {/* 3D Intro Doors */}
      <AnimatePresence>
        {!showBook && (
          <motion.div
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[200] flex cursor-pointer perspective-1000 origin-center bg-primary"
            onClick={handleOpen}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 z-0 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isOpened ? { opacity: 0.2, scale: 1 } : { opacity: 0 }}
                className="absolute inset-0"
              >
                <img src={ganpatiImg} alt="" className="w-full h-full object-contain p-20 opacity-30" />
              </motion.div>
              <motion.div
                 initial={{ opacity: 0 }}
                 animate={isOpened ? { opacity: 1 } : { opacity: 0 }}
                 className="relative z-10 text-gold-light space-y-6"
              >
                <div className="border border-gold-light/20 px-8 py-3 mx-auto max-w-fit font-devanagari text-xl">॥ श्री गणेशाय नमः ॥</div>
                <p className="font-devanagari text-2xl tracking-widest leading-loose">वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।<br/>निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥</p>
              </motion.div>
            </div>

            <motion.div 
              animate={isOpened ? { rotateY: -110, x: '-20%' } : { rotateY: 0, x: 0 }} 
              transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }} 
              className="w-1/2 h-full z-10 origin-left preserve-3d relative"
            >
              <img src={doorsImg} className="w-full h-full object-cover object-left" alt="" />
              <div className="absolute inset-0 bg-black/10 shadow-[inset_-20px_0_40px_rgba(0,0,0,0.5)]" />
            </motion.div>

            <motion.div 
              animate={isOpened ? { rotateY: 110, x: '20%' } : { rotateY: 0, x: 0 }} 
              transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }} 
              className="w-1/2 h-full z-10 origin-right preserve-3d relative"
            >
              <img src={doorsImg} className="w-full h-full object-cover object-right" alt="" />
              <div className="absolute inset-0 bg-black/10 shadow-[inset_20px_0_40px_rgba(0,0,0,0.5)]" />
            </motion.div>

            <motion.p animate={{ opacity: isOpened ? 0 : [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-20 left-0 right-0 text-center text-gold-light font-cinzel tracking-[10px] z-20 uppercase">Tap to open miracle</motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Website Sections */}
      {showBook && (
        <div className="w-full bg-cream">
          {/* 1. Floral Intro */}
          <Section className="bg-cream">
            <img src={floralGanpatiImg} alt="Floral Reveal" className="absolute inset-0 w-full h-full object-cover opacity-90" />
          </Section>

          {/* 2. Formal Invitation */}
          <Section className="bg-cream px-8">
            <div className="max-w-3xl text-center space-y-12">
               <img src={logoImg} className="w-32 mx-auto mb-10 drop-shadow-xl" alt="" />
               <p className="text-secondary font-cinzel tracking-[12px] uppercase text-xs mb-8">Affectionately Invited</p>
               <h1 className="text-primary font-garamond text-5xl italic leading-relaxed">
                 We request the pleasure of your company on the auspicious occasion of the marriage ceremony of
               </h1>
               <div className="pt-10 flex flex-col md:flex-row items-center justify-center gap-8">
                  <h2 className="text-primary font-cinzel text-6xl font-bold tracking-[8px]">ANUJA</h2>
                  <p className="text-gold-light font-cinzel text-3xl tracking-[15px]">&</p>
                  <h2 className="text-primary font-cinzel text-6xl font-bold tracking-[8px]">ADITYA</h2>
               </div>
            </div>
          </Section>

          {/* 3. Scratch to Reveal */}
          <Section className="bg-white/50 px-8">
             <div className="text-center">
               <p className="text-secondary font-cinzel tracking-[8px] uppercase text-[10px] mb-12">Something Special</p>
               <ScratchToReveal onReveal={() => {
                  confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#D4AF37', '#610000', '#F5E6BE']
                  });
               }}>
                 <div className="text-center p-10">
                   <p className="text-gold-light font-cinzel text-xl mb-4 tracking-widest uppercase">JUNE</p>
                   <p className="text-primary font-cinzel text-8xl font-bold">27</p>
                   <p className="text-gold-light font-cinzel text-xl mt-4 tracking-widest uppercase font-bold">2026</p>
                 </div>
               </ScratchToReveal>
               <p className="mt-12 text-primary font-devanagari text-2xl tracking-[5px]">शनिवार, आळंदी</p>
             </div>
          </Section>

          {/* 4. Alandi Temple & Countdown */}
          <Section className="bg-primary text-white p-12">
             <div className="absolute inset-0 opacity-10">
               <img src={templeImg} className="w-full h-full object-cover grayscale invert" alt="" />
             </div>
             <div className="relative z-10 text-center scale-125">
                <p className="text-gold-light/40 font-cinzel tracking-[8px] uppercase text-[10px] mb-8">Alandi Temple</p>
                <h3 className="text-gold-light font-devanagari text-4xl mb-12">विवाह मांडव</h3>
                <Countdown />
                <p className="mt-12 text-white/20 font-cinzel text-[8px] tracking-[10px] uppercase">#A_Squared_LoveStory</p>
             </div>
          </Section>

          {/* 5. Journey / Timeline */}
          <Section className="min-h-fit py-32 px-8">
             <div className="max-w-4xl mx-auto w-full">
               <h3 className="text-primary font-cinzel text-5xl mb-24 text-center tracking-[15px] uppercase">The Journey</h3>
               
               <div className="grid md:grid-cols-2 gap-16">
                 {/* Day 1 */}
                 <div className="space-y-12">
                    <div className="border-b-2 border-gold/20 pb-4">
                      <h4 className="text-gold-light font-cinzel text-xl font-bold tracking-[5px] uppercase">Day 01</h4>
                      <p className="text-secondary italic font-garamond">Friday, 26th June</p>
                    </div>
                    {EVENTS[0].items.map(item => (
                      <div key={item.id} className="group cursor-default">
                        <p className="text-gold-light font-cinzel text-[10px] tracking-[3px] mb-2">{item.time}</p>
                        <h5 className="text-primary font-cinzel text-2xl font-bold tracking-widest group-hover:text-gold-light transition-colors">{item.name}</h5>
                        <p className="text-secondary italic font-garamond text-sm">{item.desc}</p>
                      </div>
                    ))}
                 </div>

                 {/* Day 2 */}
                 <div className="space-y-12">
                    <div className="border-b-2 border-gold/20 pb-4">
                      <h4 className="text-gold-light font-cinzel text-xl font-bold tracking-[5px] uppercase">Day 02</h4>
                      <p className="text-secondary italic font-garamond">Saturday, 27th June</p>
                    </div>
                    {EVENTS[1].items.map(item => (
                      <div key={item.id} className="group cursor-default">
                        <p className="text-gold-light font-cinzel text-[10px] tracking-[3px] mb-2">{item.time}</p>
                        <h5 className="text-primary font-cinzel text-2xl font-bold tracking-widest group-hover:text-gold-light transition-colors">{item.name}</h5>
                        <p className="text-secondary italic font-garamond text-sm">{item.desc}</p>
                      </div>
                    ))}
                 </div>
               </div>
             </div>
          </Section>

          {/* 6. Family Blessings */}
          <Section className="bg-cream/30 border-t border-gold/10">
             <div className="text-center p-12">
                <p className="text-primary italic font-garamond text-4xl mb-12">We request you to attend and bless the couple</p>
                <div className="text-8xl mb-12">🙏</div>
                <div className="w-32 h-px bg-gold/20 mx-auto mb-10" />
                <div className="space-y-4">
                  <p className="text-secondary font-garamond italic text-xl uppercase tracking-[2px]">With best compliments from</p>
                  <p className="text-primary font-cinzel font-bold text-4xl tracking-[10px]">Mulik & Kulkarni Family</p>
                </div>
             </div>
          </Section>

          {/* 7. Venue Finale */}
          <Section className="bg-primary min-h-screen">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstripe-dark.png')]" />
            <div className="text-center p-12 scale-110">
              <p className="text-secondary font-garamond italic text-3xl mb-12">Wedding venue</p>
              <div className="mb-16">
                 <h3 className="text-gold-light font-cinzel text-7xl md:text-8xl font-bold mb-4 tracking-tight">Avadhoot</h3>
                 <h3 className="text-gold-light font-cinzel text-7xl md:text-8xl font-bold mb-8 tracking-tight">Banquet Hall</h3>
                 <p className="text-white/60 font-garamond italic text-3xl">God's Alandi, Pune</p>
              </div>

              <div className="mb-24">
                <a 
                  href="https://maps.google.com/?q=Avadhoot+Banquet+Hall,Alandi,Pune" 
                  target="_blank" 
                  className="inline-flex items-center gap-6 bg-gradient-to-b from-[#6D4C41] to-[#3E2723] px-14 py-8 rounded-full border border-white/20 shadow-2xl hover:scale-110 transition-all group"
                >
                  <div className="bg-[#4285F4] p-2 rounded-sm shadow-inner">
                     <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white font-cinzel text-xl tracking-widest font-bold border-l border-white/20 pl-8 group-hover:text-gold-light uppercase">Open in Maps</span>
                </a>
              </div>

              <div className="flex justify-center gap-16 mt-16 scale-150">
                 <img src={logoImg} className="w-24 object-contain drop-shadow-[0_0_25px_rgba(212,175,55,0.4)]" alt="" />
                 <img src={logoImg} className="w-24 object-contain drop-shadow-[0_0_25px_rgba(212,175,55,0.4)]" alt="" />
              </div>
            </div>
            
            <p className="absolute bottom-10 left-0 right-0 text-center text-white/10 font-cinzel text-[8px] tracking-[15px] uppercase">Crafted with love for Anuja & Aditya</p>
          </Section>
        </div>
      )}
    </div>
  );
}
    </div>
  );
}
