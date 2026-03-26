import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, MapPin, Calendar, Clock, Heart, MessageCircle, Mic, ChevronRight, ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import HTMLFlipBook from 'react-pageflip';

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

const Page = forwardRef<HTMLDivElement, { children: React.ReactNode; number: number }>(
  (props, ref) => {
    return (
      <div className="page" ref={ref}>
        <div className="page-content h-full w-full bg-cream border-l border-gold/10 relative shadow-inner overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          {props.children}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-primary/20 font-cinzel tracking-widest">
            — {props.number} —
          </div>
        </div>
      </div>
    );
  }
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
    // Small timeout to let FlipBook render the page first
    const timer = setTimeout(initCanvas, 500);
    return () => clearTimeout(timer);
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
    <div className="min-h-screen bg-primary flex items-center justify-center overflow-hidden">
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_115b9b5c1d.mp3" />

      <AnimatePresence>
        {!showBook && (
          <motion.div
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex cursor-pointer perspective-1000 origin-center"
            onClick={handleOpen}
          >
            {/* Background Revealed Under Doors (Burgundy Ganpati) */}
            <div className="absolute inset-0 bg-primary flex flex-col items-center justify-center p-10 z-0 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isOpened ? { opacity: 0.1, scale: 1 } : { opacity: 0 }}
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

            {/* Doors Opening Animation (3D Swing) */}
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

            <motion.p animate={{ opacity: isOpened ? 0 : [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-20 left-0 right-0 text-center text-gold-light font-cinzel tracking-[10px] z-20">TAP TO OPEN</motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {showBook && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="book-container w-full max-w-4xl px-4">
          <div className="flex justify-between items-center mb-6 absolute top-6 left-6 right-6 z-50">
            <button onClick={() => bookRef.current.pageFlip().flipPrev()} className="p-2 bg-white/10 rounded-full text-gold-light hover:bg-white/20 transition-all"><ChevronLeft /></button>
            <button onClick={toggleMusic} className="p-4 bg-gold-light/10 rounded-full text-primary backdrop-blur-md border border-gold-light/20 shadow-xl hover:scale-110 transition-all">
              {isPlaying ? <Music className="animate-pulse" /> : <Music className="opacity-40" />}
            </button>
            <button onClick={() => bookRef.current.pageFlip().flipNext()} className="p-2 bg-white/10 rounded-full text-gold-light hover:bg-white/20 transition-all"><ChevronRight /></button>
          </div>

          <HTMLFlipBook
            width={400}
            height={600}
            size="stretch"
            minWidth={300}
            maxWidth={1000}
            minHeight={450}
            maxHeight={1533}
            maxShadowOpacity={0.5}
            showCover={true}
            className="royal-shadow rounded-lg overflow-hidden"
            ref={bookRef}
          >
            {/* Page 1: Floral Reveal (Premium Entrance) */}
            <Page number={1}>
               <div className="h-full w-full relative overflow-hidden bg-cream">
                 <img src={floralGanpatiImg} alt="Floral Entrance" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 mt-10">
                    {/* The image itself might have content, let's keep text minimal if it's already there */}
                 </div>
               </div>
            </Page>

            {/* Page 2: Affectionately Invited */}
            <Page number={2}>
              <div className="p-8 h-full flex flex-col justify-center border-2 border-double border-gold/10 m-2">
                <p className="text-primary/60 italic font-garamond text-xl mb-6">Affectionately invited</p>
                <img src={logoImg} className="w-32 mx-auto mb-8" alt="" />
                <h1 className="text-primary font-devanagari text-4xl font-bold mb-4">अनुजा आणि आदित्य</h1>
                <p className="text-secondary italic font-garamond text-lg">Happy wedding ceremony</p>
              </div>
            </Page>

            {/* Page 3: Save the Date */}
            <Page number={3}>
              <div className="p-8 h-full flex flex-col items-center justify-center">
                <p className="text-primary/40 font-cinzel text-[10px] tracking-[6px] mb-8 uppercase">Save The Date</p>
                <ScratchToReveal onReveal={() => confetti()}>
                   <div className="text-center">
                     <p className="text-primary font-cinzel text-4xl font-bold">27 JUNE 2026</p>
                   </div>
                </ScratchToReveal>
                <p className="mt-10 text-primary/60 font-devanagari">शनिवार, आळंदी</p>
              </div>
            </Page>

            {/* Page 4: Temple & Countdown */}
            <Page number={4}>
              <div className="p-8 h-full flex flex-col items-center justify-center">
                <img src={templeImg} className="w-full rounded mb-10 royal-shadow grayscale hover:grayscale-0 transition-all duration-700" alt="" />
                <Countdown />
                <p className="mt-8 text-primary/40 font-devanagari text-xs opacity-50">#A_Squared_LoveStory</p>
              </div>
            </Page>

            {/* Page 5: Day 1 Ceremony */}
            <Page number={5}>
              <div className="p-8 h-full text-center">
                <div className="bg-primary/5 py-2 mb-8 border-y border-primary/10"><h3 className="text-primary font-cinzel font-bold">{EVENTS[0].day}</h3></div>
                <div className="space-y-6 text-left">
                  {EVENTS[0].items.map(item => (
                    <div key={item.id} className="border-b border-gold/5 pb-2">
                      <p className="text-primary font-cinzel text-sm font-bold">{item.name}</p>
                      <div className="flex justify-between text-[10px] text-primary/40 italic"><span>{item.time}</span><span>{item.desc}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </Page>

            {/* Page 6: Day 2 Ceremony */}
            <Page number={6}>
              <div className="p-8 h-full text-center">
                <div className="bg-primary/5 py-2 mb-8 border-y border-primary/10"><h3 className="text-primary font-cinzel font-bold">{EVENTS[1].day}</h3></div>
                <div className="space-y-4 text-left">
                  {EVENTS[1].items.map(item => (
                    <div key={item.id} className="border-b border-gold/5 pb-2">
                      <p className="text-primary font-cinzel text-xs font-bold">{item.name}</p>
                      <div className="flex justify-between text-[9px] text-primary/40 italic"><span>{item.time}</span><span>{item.desc}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </Page>

            {/* Page 7: Venue */}
            <Page number={7}>
              <div className="bg-primary h-full flex flex-col items-center justify-center p-8 text-center text-white">
                <p className="text-gold-light/40 text-[8px] tracking-[6px] uppercase mb-8">Wedding Venue</p>
                <div className="p-6 border border-gold-light/20 rounded-2xl bg-black/10 w-full mb-8">
                  <h3 className="text-gold-light font-devanagari text-2xl mb-2">अवधूत बँक्वेट हॉल</h3>
                  <p className="text-white/60 font-garamond italic text-sm mb-6">God's Alandi, Pune</p>
                  <a href="https://maps.google.com/?q=Avadhoot+Banquet+Hall,Alandi,Pune" target="_blank" className="bg-white text-primary px-6 py-3 rounded-full text-[10px] font-cinzel tracking-widest block">OPEN MAPS</a>
                </div>
                <img src={logoImg} className="w-12 opacity-20 invert" alt="" />
              </div>
            </Page>

            {/* Page 8: Family */}
            <Page number={8}>
              <div className="h-full flex flex-col items-center justify-center p-8 bg-[url('./assets/scroll.png')] bg-cover bg-center">
                 <div className="bg-white/80 p-6 backdrop-blur-sm rounded-lg border border-gold/10 text-center">
                    <p className="text-primary italic font-garamond text-xl mb-6">I request you to attend and bless me</p>
                    <div className="text-2xl mb-6">🙏</div>
                    <div className="w-10 h-px bg-primary/20 mx-auto mb-4" />
                    <p className="text-secondary font-garamond italic text-xs mb-1">Best wishes from</p>
                    <p className="text-primary font-cinzel font-bold text-sm tracking-widest">Mulik and Kulkarni family</p>
                 </div>
              </div>
            </Page>
          </HTMLFlipBook>
        </motion.div>
      )}
    </div>
  );
}
