import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Stars, Sparkles, MessageCircleHeart, Lock, Unlock, ChevronDown, Volume2, VolumeX, Hand, Check, Mail, KeyRound, Eye, EyeOff, Delete } from 'lucide-react';
import confetti from 'canvas-confetti';
import './index.css';

// --- CONFIGURATION ---
const SECRET_NAME = "My Love";
const ROMANTIC_AUDIO_URL = "https://cdn.pixabay.com/download/audio/2022/05/16/audio_96825c31f9.mp3?filename=romantic-piano-111195.mp3";
const START_DATE = new Date("2024-01-01T00:00:00"); // Adjust to real date later

const timelineEvents = [
  { date: "The Beginning", title: "When We Met", description: "That special day when everything changed. A moment that will forever be etched in my heart." },
  { date: "The First Date", title: "Sparks Flying", description: "I remember exactly what you were wearing and how you made me laugh effortlessly." },
  { date: "The First Kiss", title: "Time Stood Still", description: "The moment the entire world just melted away around us." },
  { date: "The Journey", title: "Growing Together", description: "Every laugh, every tear, and every beautiful memory we've created since then." },
  { date: "The Hard Times", title: "Becoming Stronger", description: "Even in the darkest days, holding your hand made everything alright." },
  { date: "Today", title: "Still Falling", description: "Looking at you now, and realizing I love you even more than yesterday." }
];

const secretNotes = [
  { id: 1, icon: Heart, text: "You have the most beautiful smile." },
  { id: 2, icon: Stars, text: "You make my world so much brighter." },
  { id: 3, icon: Sparkles, text: "I cherish every moment with you." },
  { id: 4, icon: MessageCircleHeart, text: "You give me butterflies, always." }
];

const littleThingsDeck = [
  { id: 1, text: "The way you laugh at my terrible jokes.", color: "rgba(255, 42, 133, 0.15)", border: "rgba(255, 42, 133, 0.5)" },
  { id: 2, text: "How your eyes light up when you're excited.", color: "rgba(123, 44, 191, 0.15)", border: "rgba(123, 44, 191, 0.5)" },
  { id: 3, text: "Your endless kindness to everyone around you.", color: "rgba(255, 117, 140, 0.15)", border: "rgba(255, 117, 140, 0.5)" },
  { id: 4, text: "The way you make every ordinary day feel extraordinary.", color: "rgba(74, 0, 224, 0.15)", border: "rgba(74, 0, 224, 0.5)" }
];

const bucketListItems = [
  { id: 1, text: "Late night drive to nowhere with music blasting" },
  { id: 2, text: "Stargazing on a roof with blankets" },
  { id: 3, text: "Bake a cake together and make a huge mess" },
  { id: 4, text: "Travel to a country we've never been to" },
  { id: 5, text: "Build a blanket fort and watch Disney movies" }
];

const reasonsWhy = [
  "You always know how to make me smile.",
  "Your laugh is my favorite sound in the world.",
  "You support my craziest dreams.",
  "You look cute even when you're mad.",
  "You give the best hugs.",
  "You inspire me to be a better person.",
  "You remember the little things I say.",
  "Your kindness is contagious.",
  "You make ordinary moments feel like an adventure.",
  "The way you look at me makes me feel invincible.",
  "You are my safe space.",
  "We can talk for hours and never get bored.",
  "You are my absolute best friend.",
  "You have the most beautiful eyes.",
  "You make me feel loved every single day.",
  "I love your weird quirks.",
  "You always try to make things better when they're bad.",
  "You're not afraid to be silly with me.",
  "You hold my hand when I need it most.",
  "Because you are exactly who you are."
];
// ---------------------

// Magnetic Button Component
function MagneticButton({ children, className, onClick, style }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };
  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref} className={className} onClick={onClick} onMouseMove={handleMouse} onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }} transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }} style={style}
    >
      {children}
    </motion.button>
  );
}

// Spotlight Card
function SpotlightCard({ children, className = "", onClick, whileHover }) {
  const divRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    divRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    divRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };
  return (
    <motion.div ref={divRef} onMouseMove={handleMouseMove} className={`spotlight-card ${className}`} onClick={onClick} whileHover={whileHover}>
      <div className="spotlight-card-content">{children}</div>
    </motion.div>
  );
}

// Swipeable Deck
function SwipeableDeck() {
  const [cards, setCards] = useState(littleThingsDeck);
  if (cards.length === 0) {
    return (
      <div className="swipe-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          <h3 style={{ textAlign: 'center', color: 'var(--accent-pink)' }}>And a million more things...</h3>
          <button className="btn-primary" style={{ display: 'block', margin: '2rem auto 0' }} onClick={() => setCards(littleThingsDeck)}>Read Again</button>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="swipe-container">
      {cards.map((card, index) => {
        const isTop = index === cards.length - 1;
        const scale = 1 - (cards.length - 1 - index) * 0.05;
        const topOffset = (cards.length - 1 - index) * -20;
        return (
          <motion.div
            key={card.id} className="swipe-card" drag={isTop ? "x" : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={1}
            onDragEnd={(e, info) => { if (Math.abs(info.offset.x) > 100) setCards(prev => prev.slice(0, prev.length - 1)); }}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: scale, y: topOffset, opacity: 1, rotateZ: isTop ? 0 : (index % 2 === 0 ? -2 : 2) }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ zIndex: index, background: card.color, borderColor: card.border, backdropFilter: 'blur(20px)', cursor: isTop ? 'grab' : 'auto' }}
            whileTap={{ cursor: 'grabbing' }}
          >
            {card.text}
            {isTop && <div className="swipe-card-instruction"><Hand size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} /> Swipe Me</div>}
          </motion.div>
        )
      })}
    </div>
  );
}

// Handwriting Line Component — reveals text char by char
function HandwritingLine({ text, delay, speed = 40 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  if (!started) return <div className="hw-line-placeholder">&nbsp;</div>;

  return (
    <motion.div
      className="hw-line"
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span>{displayedText}</span>
      {!isDone && <span className="hw-pen-cursor">|</span>}
    </motion.div>
  );
}

// Ink Splatter Particles
function InkSplatter({ isActive }) {
  const splatters = useRef(
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 3 + 1,
    }))
  );

  if (!isActive) return null;

  return (
    <div className="ink-splatters">
      {splatters.current.map((s) => (
        <motion.div
          key={s.id}
          className="ink-dot"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.6, 0.3], scale: [0, 1.5, 1] }}
          transition={{ delay: s.delay, duration: 0.8, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// Digital Envelope Letter with Handwriting Animation
function LetterEnvelope() {
  const [isOpen, setIsOpen] = useState(false);
  const [writingStarted, setWritingStarted] = useState(false);

  const letterLines = [
    { text: "My Dearest,", isBreak: false },
    { text: "", isBreak: true },
    { text: "I wanted to build something completely unique to show", isBreak: false },
    { text: "you how much you mean to me. Every single pixel on", isBreak: false },
    { text: "this website, every color, every animation was placed", isBreak: false },
    { text: "here with you in my mind.", isBreak: false },
    { text: "", isBreak: true },
    { text: "You are the most incredible person I've ever met.", isBreak: false },
    { text: "You bring so much light into my life that sometimes", isBreak: false },
    { text: "I wonder how I ever navigated the dark before you.", isBreak: false },
    { text: "", isBreak: true },
    { text: "Thank you for being you. Thank you for your patience,", isBreak: false },
    { text: "your laugh, and your endless love.", isBreak: false },
    { text: "I am so lucky to have you.", isBreak: false },
    { text: "", isBreak: true },
    { text: "Forever Yours,", isBreak: false },
    { text: "sujal", isBreak: false },
  ];

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setWritingStarted(true), 600);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Calculate cumulative delay for each line
  const getLineDelay = (index) => {
    let totalDelay = 0;
    for (let i = 0; i < index; i++) {
      if (letterLines[i].isBreak) {
        totalDelay += 300;
      } else {
        totalDelay += letterLines[i].text.length * 35 + 200;
      }
    }
    return totalDelay;
  };

  return (
    <div className="letter-section">
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            className="envelope-container" onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
          >
            <Mail size={80} color="var(--accent-pink)" style={{ marginBottom: '1rem' }} />
            <h3>A Letter For You</h3>
            <p style={{ opacity: 0.6, marginTop: '1rem' }}>Click to open</p>
          </motion.div>
        ) : (
          <motion.div
            className="letter-content hw-letter"
            initial={{ opacity: 0, height: 0, y: 50 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            transition={{ duration: 1, type: "spring" }}
          >
            {/* Paper texture lines */}
            <div className="hw-paper-lines">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="hw-paper-line" />
              ))}
            </div>

            {/* Ink splatters */}
            <InkSplatter isActive={writingStarted} />

            {/* Handwriting content */}
            <div className="hw-content">
              {writingStarted && letterLines.map((line, index) => (
                line.isBreak ? (
                  <div key={index} className="hw-break" />
                ) : (
                  <HandwritingLine
                    key={index}
                    text={line.text}
                    delay={getLineDelay(index)}
                    speed={line.text === "sujal" || line.text === "Forever Yours," ? 80 : 35}
                  />
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [greetingText, setGreetingText] = useState("");
  const fullGreeting = `To ${SECRET_NAME}...`;
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [revealedNotes, setRevealedNotes] = useState(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [sheSaidYes, setSheSaidYes] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [bucketList, setBucketList] = useState(bucketListItems);
  const [secretPin, setSecretPin] = useState('');
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // Custom cursor
  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Click hearts
  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.closest('button') || e.target.closest('.swipe-card') || e.target.closest('.bucket-item')) return;
      confetti({
        particleCount: 15, spread: 60, origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
        colors: ['#ff2a85', '#ffb6c1', '#ffffff'], disableForReducedMotion: true, zIndex: 9999, scalar: 0.8
      });
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleEnter = () => {
    setIsUnlocking(true);
    setTimeout(() => {
      setHasEntered(true);
      if (audioRef.current) {
        audioRef.current.volume = 0.4;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log("Audio autoplay prevented"));
      }
    }, 1000);
  };

  const toggleAudio = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (!hasEntered) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullGreeting.length) { setGreetingText(fullGreeting.slice(0, i + 1)); i++; }
      else { clearInterval(interval); setIsTypingDone(true); }
    }, 150);
    return () => clearInterval(interval);
  }, [fullGreeting, hasEntered]);

  const toggleBucketItem = (id) => {
    setBucketList(prev => prev.map(item => {
      if (item.id === id) {
        if (!item.completed) {
          // Fire mini confetti on check
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 }, colors: ['#ff2a85'] });
        }
        return { ...item, completed: !item.completed };
      }
      return item;
    }));
  };

  const handleNoHover = () => setNoButtonPosition({ x: Math.random() * 300 - 150, y: Math.random() * 300 - 150 });

  const handleYesClick = () => {
    setSheSaidYes(true);
    const end = Date.now() + 5000;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };
    const interval = setInterval(() => {
      const timeLeft = end - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      confetti(Object.assign({}, defaults, { particleCount: 50 * (timeLeft / 5000), origin: { x: Math.random(), y: Math.random() - 0.2 }, colors: ['#ff2a85', '#ffb6c1'] }));
    }, 250);
  };

  const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] } } };

  return (
    <>
      <motion.div className="cursor-trail" animate={{ x: mousePosition.x - 10, y: mousePosition.y - 10 }} transition={{ type: "spring", stiffness: 800, damping: 25, mass: 0.2 }} />
      <div className="film-grain"></div>
      <div className="background-container">
        <div className="ambient-orb orb-1"></div><div className="ambient-orb orb-2"></div><div className="ambient-orb orb-3"></div>
      </div>
      <audio ref={audioRef} loop src={ROMANTIC_AUDIO_URL} />

      <AnimatePresence>
        {!hasEntered && (
          <motion.div className="splash-screen" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }} transition={{ duration: 1, ease: "easeInOut" }}>
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>Hello, Beautiful.</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginBottom: '3rem', opacity: 0.6 }}>Enter the code to unlock your surprise.</motion.p>

            {!isUnlocking ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                {/* PIN Display */}
                <motion.div
                  className="pin-display"
                  animate={pinError ? { x: [-20, 20, -15, 15, -5, 5, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  style={{ marginBottom: '1.5rem' }}
                >
                  <div className="pin-dots">
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className={`pin-dot ${i < secretPin.length ? 'filled' : ''}`}
                        animate={i < secretPin.length ? { scale: [0.5, 1.3, 1] } : {}}
                        transition={{ duration: 0.2 }}
                      >
                        {showPin && i < secretPin.length ? secretPin[i] : ''}
                      </motion.div>
                    ))}
                  </div>
                  <button
                    className="pin-toggle-visibility"
                    onClick={() => setShowPin(!showPin)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                  >
                    {showPin ? <EyeOff size={18} color="var(--text-secondary)" /> : <Eye size={18} color="var(--text-secondary)" />}
                  </button>
                </motion.div>

                {pinError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ color: '#ff4444', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1rem' }}
                  >
                    Wrong code, try again!
                  </motion.p>
                )}

                {/* Keypad */}
                <div className="pin-keypad">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((key, idx) => (
                    key === null ? <div key={idx} /> : (
                      <MagneticButton
                        key={idx}
                        className="pin-key"
                        onClick={() => {
                          if (key === 'del') {
                            setSecretPin(prev => prev.slice(0, -1));
                            setPinError(false);
                          } else if (secretPin.length < 4) {
                            const newPin = secretPin + key;
                            setSecretPin(newPin);
                            setPinError(false);
                            if (newPin.length === 4) {
                              if (newPin === '2609') {
                                setTimeout(() => handleEnter(), 400);
                              } else {
                                setPinError(true);
                                setTimeout(() => setSecretPin(''), 600);
                              }
                            }
                          }
                        }}
                      >
                        {key === 'del' ? <Delete size={20} /> : key}
                      </MagneticButton>
                    )
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 0.8 }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}
              >
                <Unlock size={32} color="var(--accent-pink)" />
                <span style={{ fontSize: '1.4rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Unlocking...</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {hasEntered && (
        <>
          <motion.div className="audio-control" onClick={toggleAudio} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1, duration: 0.5 }} title={isPlaying ? "Pause Music" : "Play Music"}>
            {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </motion.div>

          <main>
            {/* HERO SECTION */}
            <section id="hero" className="hero">
              <div className="container" style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div className="hero-content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}>
                  <h1 style={{ minHeight: '130px' }}>
                    {greetingText}
                    <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.9 }} style={{ display: isTypingDone ? 'none' : 'inline-block', color: '#ff2a85', marginLeft: '4px' }}>|</motion.span>
                  </h1>
                  <AnimatePresence>
                    {isTypingDone && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
                        <p className="hero-subtitle">A special place just for you. Because you deserve the world and all the stars in it.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
              <AnimatePresence>
                {isTypingDone && (
                  <motion.div className="scroll-indicator" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 1 }}>
                    <ChevronDown size={32} />
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* TIMELINE SECTION */}
            <section id="timeline">
              <div className="container">
                <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>Our Beautiful Journey</motion.h2>
                <div className="timeline-container">
                  <div className="timeline-line"></div>
                  {timelineEvents.map((event, index) => (
                    <motion.div className="timeline-item" key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-150px" }} transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}>
                      <div className="timeline-content-wrapper">
                        <span className="timeline-date">{event.date}</span>
                        <SpotlightCard className="timeline-panel">
                          <h3>{event.title}</h3><p>{event.description}</p>
                        </SpotlightCard>
                      </div>
                      <div className="timeline-marker-wrapper"><div className="timeline-marker"></div></div>
                      <div className="timeline-content-wrapper" style={{ visibility: 'hidden' }}></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* DIGITAL LETTER SECTION */}
            <section id="letter">
              <div className="container">
                <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>Words Unspoken</motion.h2>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <LetterEnvelope />
                </motion.div>
              </div>
            </section>

            {/* REASONS WHY GRID */}
            <section id="reasons">
              <div className="container">
                <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>A Million Reasons Why</motion.h2>
                <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto' }}>I could write a book about why I love you, but here are just a few.</motion.p>
                <div className="reasons-grid">
                  {reasonsWhy.map((reason, index) => (
                    <motion.div key={index} className="reason-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (index % 4) * 0.1, duration: 0.5 }}>
                      <span className="reason-number">Reason #{index + 1}</span>
                      {reason}
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* SWIPEABLE LITTLE THINGS DECK */}
            <section id="little-things" className="swipe-section">
              <div className="container">
                <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>The Little Things</motion.h2>
                <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                  Swipe the cards away to read the next one.
                </motion.p>
                <SwipeableDeck />
              </div>
            </section>

            {/* BUCKET LIST SECTION */}
            <section id="bucket-list">
              <div className="container">
                <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>Our Future Adventures</motion.h2>
                <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: '4rem' }}>Tap to check off the things we've done or want to do.</motion.p>
                <div className="bucket-list">
                  {bucketList.map((item, index) => (
                    <motion.div key={item.id} className={`bucket-item ${item.completed ? 'completed' : ''}`} onClick={() => toggleBucketItem(item.id)} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                      <div className="bucket-checkbox">{item.completed && <Check size={16} color="white" />}</div>
                      <div className="bucket-text">{item.text}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECRET VAULT SECTION */}
            <section id="secret-vault" className="secret-vault-section">
              <div className="container">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <motion.div
                      animate={vaultUnlocked ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.6 }}
                      style={{ display: 'inline-block', marginBottom: '1.5rem' }}
                    >
                      <KeyRound size={48} color="var(--accent-pink)" style={{ filter: 'drop-shadow(0 0 15px rgba(255,42,133,0.5))' }} />
                    </motion.div>
                  </div>
                  <h2>Secret Vault</h2>
                  <p style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto 3rem' }}>
                    {vaultUnlocked ? 'You found the secret!' : 'Only you know the code to unlock this...'}
                  </p>

                  <AnimatePresence mode="wait">
                    {!vaultUnlocked ? (
                      <motion.div
                        key="pin-pad"
                        className="pin-pad-container"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                      >
                        {/* PIN Display */}
                        <motion.div
                          className="pin-display"
                          animate={pinError ? { x: [-20, 20, -15, 15, -5, 5, 0] } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="pin-dots">
                            {[0, 1, 2, 3].map((i) => (
                              <motion.div
                                key={i}
                                className={`pin-dot ${i < secretPin.length ? 'filled' : ''}`}
                                animate={i < secretPin.length ? { scale: [0.5, 1.3, 1] } : {}}
                                transition={{ duration: 0.2 }}
                              >
                                {showPin && i < secretPin.length ? secretPin[i] : ''}
                              </motion.div>
                            ))}
                          </div>
                          <button
                            className="pin-toggle-visibility"
                            onClick={() => setShowPin(!showPin)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                          >
                            {showPin ? <EyeOff size={18} color="var(--text-secondary)" /> : <Eye size={18} color="var(--text-secondary)" />}
                          </button>
                        </motion.div>

                        {pinError && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ color: '#ff4444', fontSize: '0.9rem', textAlign: 'center', marginTop: '0.5rem' }}
                          >
                            Wrong code, try again!
                          </motion.p>
                        )}

                        {/* Keypad */}
                        <div className="pin-keypad">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((key, idx) => (
                            key === null ? <div key={idx} /> : (
                              <MagneticButton
                                key={idx}
                                className="pin-key"
                                onClick={() => {
                                  if (key === 'del') {
                                    setSecretPin(prev => prev.slice(0, -1));
                                    setPinError(false);
                                  } else if (secretPin.length < 4) {
                                    const newPin = secretPin + key;
                                    setSecretPin(newPin);
                                    setPinError(false);
                                    if (newPin.length === 4) {
                                      if (newPin === '2609') {
                                        setTimeout(() => {
                                          setVaultUnlocked(true);
                                          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#ff2a85', '#ffb6c1', '#ffffff', '#4a00e0'] });
                                        }, 300);
                                      } else {
                                        setPinError(true);
                                        setTimeout(() => setSecretPin(''), 600);
                                      }
                                    }
                                  }
                                }}
                              >
                                {key === 'del' ? <Delete size={20} /> : key}
                              </MagneticButton>
                            )
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="vault-content"
                        className="vault-content"
                        initial={{ opacity: 0, scale: 0.8, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, type: 'spring' }}
                      >
                        <SpotlightCard className="vault-message-card">
                          <motion.div style={{ padding: '3rem', textAlign: 'center' }}>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                              style={{ marginBottom: '2rem' }}
                            >
                              <Heart size={60} fill="#ff2a85" color="#ff2a85" style={{ filter: 'drop-shadow(0 0 20px rgba(255,42,133,0.6))' }} />
                            </motion.div>
                            <motion.h3
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                              style={{ fontSize: '2rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #ff2a85, #ffb6c1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                            >
                              You Found It! 💕
                            </motion.h3>
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.8 }}
                              style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, fontFamily: "'Dancing Script', cursive" }}
                            >
                              This is our secret little corner of the internet.<br />
                              No one else knows about this place, just you and me.<br /><br />
                              Remember — no matter what happens in life,<br />
                              you will always be my favorite person. Always. ❤️
                            </motion.p>
                            <motion.button
                              className="btn-primary"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.5 }}
                              onClick={() => { setVaultUnlocked(false); setSecretPin(''); }}
                              style={{ marginTop: '2.5rem' }}
                            >
                              Lock it again 🔒
                            </motion.button>
                          </motion.div>
                        </SpotlightCard>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </section>

            {/* PROMISE GAME SECTION */}
            <section id="promise" className="promise-section">
              <div className="container">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <h2>Are you ready for forever?</h2>
                  <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>I promise to always make you smile and to love you more every single day.</p>
                  <div className="promise-actions">
                    <MagneticButton className="btn-yes" onClick={handleYesClick} style={{ zIndex: 10 }}>Yes, absolutely!</MagneticButton>
                    <motion.button className="btn-no" onHoverStart={handleNoHover} onClick={handleNoHover} animate={{ x: noButtonPosition.x, y: noButtonPosition.y }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>No way</motion.button>
                  </div>
                </motion.div>
              </div>
            </section>
          </main>

          <AnimatePresence>
            {sheSaidYes && (
              <motion.div className="success-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.h1 initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, type: "spring" }} style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #ff2a85, #ffb6c1)', WebkitBackgroundClip: 'text', color: 'transparent' }}>I Love You! ❤️</motion.h1>
                <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }} style={{ fontSize: '1.5rem', color: '#fff', maxWidth: '600px', lineHeight: 1.6 }}>You just made me the happiest person in the world. I promise to cherish you always.</motion.p>
                <MagneticButton className="btn-primary" style={{ marginTop: '3rem' }} onClick={() => setSheSaidYes(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>Close</MagneticButton>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <div className="container">
              <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>Made with <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ display: 'inline-flex', color: '#ff2a85', filter: 'drop-shadow(0 0 5px rgba(255,42,133,0.5))' }}><Heart size={20} fill="#ff2a85" /></motion.span> just for you.</p>
            </div>
          </motion.footer>
        </>
      )}
    </>
  );
}

export default App;
