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
          const pattern = ctx.createPattern(img, 'repeat');
          if (pattern) {
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.font = '600 16px Cinzel';
          ctx.fillStyle = '#610000';
          ctx.textAlign = 'center';
          ctx.fillText('Scratch To Reveal', canvas.width / 2, canvas.height / 2);
        }
      };
      resize();
    };
  }, []);

  const scratch = (e: any) => {
    if (!isDrawing || isRevealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const transparent = imageData.data.filter((_, i) => i % 4 === 3 && _ < 128).length;
    if ((transparent / (imageData.data.length / 4)) > 0.4) {
      setIsRevealed(true);
      if (onReveal) onReveal();
    }
  };

  return (
    <div className="relative w-full aspect-square max-w-[280px] mx-auto overflow-hidden rounded-lg shadow-xl">
      <div className={`w-full h-full flex items-center justify-center transition-opacity duration-1000 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>
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
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-50 flex cursor-pointer"
            onClick={handleOpen}
          >
            <motion.div animate={isOpened ? { x: '-100%' } : { x: 0 }} transition={{ duration: 2, ease: "easeInOut" }} className="w-1/2 h-full z-10">
              <img src={doorsImg} className="w-full h-full object-cover object-left" alt="" />
            </motion.div>
            <motion.div animate={isOpened ? { x: '100%' } : { x: 0 }} transition={{ duration: 2, ease: "easeInOut" }} className="w-1/2 h-full z-10">
              <img src={doorsImg} className="w-full h-full object-cover object-right" alt="" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center bg-primary">
              <motion.img animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity }} src={ganpatiImg} className="w-64 opacity-20 blur-sm" />
              <p className="absolute bottom-20 text-gold-light font-cinzel tracking-[10px] animate-pulse">TAP TO OPEN</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showBook && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="book-container w-full max-w-4xl px-4">
          <div className="flex justify-between items-center mb-6 absolute top-6 left-6 right-6 z-50">
            <button onClick={() => bookRef.current.pageFlip().flipPrev()} className="p-2 bg-white/10 rounded-full text-gold-light"><ChevronLeft /></button>
            <button onClick={toggleMusic} className="p-4 bg-gold-light/10 rounded-full text-gold-light backdrop-blur-md border border-gold-light/20">
              {isPlaying ? <Music className="animate-pulse" /> : <Music className="opacity-40" />}
            </button>
            <button onClick={() => bookRef.current.pageFlip().flipNext()} className="p-2 bg-white/10 rounded-full text-gold-light"><ChevronRight /></button>
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
            {/* Page 1: Cover (Ganpati) */}
            <Page number={1}>
               <div className="bg-primary absolute inset-0 p-8 flex flex-col items-center justify-center text-center">
                 <div className="border border-gold-light/30 px-6 py-2 mb-8"><p className="text-gold-light font-devanagari text-sm">॥ श्री गणेशाय नमः ॥</p></div>
                 <img src={ganpatiImg} className="w-40 mb-10 drop-shadow-2xl" alt="" />
                 <h2 className="text-gold-light font-devanagari text-xl leading-relaxed">वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।<br/>निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥</h2>
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
