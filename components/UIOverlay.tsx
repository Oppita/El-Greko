import React, { useState, useEffect, useRef } from 'react';

interface FloatingCash {
  id: number;
  left: number;
  animationDuration: number;
}

interface UIOverlayProps {
    isCloning: boolean;
    setIsCloning: (value: boolean) => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ isCloning, setIsCloning }) => {
  const [money, setMoney] = useState(0);
  const targetMoney = 1000000;
  const [floatingCash, setFloatingCash] = useState<FloatingCash[]>([]);
  const nextCashId = useRef(0);

  // Money Counter Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setMoney(prev => {
        if (prev >= targetMoney) {
          return targetMoney;
        }
        const increment = Math.floor(Math.random() * 50000) + 10000;
        
        // Trigger floating cash occasionally
        if (Math.random() > 0.7) {
            const id = nextCashId.current++;
            setFloatingCash(prevCash => [...prevCash, { 
                id, 
                left: Math.random() * 80 + 10, // Random position in panel
                animationDuration: 1 + Math.random() 
            }]);
            
            // Cleanup cash after animation
            setTimeout(() => {
                setFloatingCash(prevCash => prevCash.filter(c => c.id !== id));
            }, 2000);
        }

        return Math.min(prev + increment, targetMoney);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleCloning = () => {
    const newState = !isCloning;
    setIsCloning(newState);

    // Cursor Change
    // Using a detailed hammer SVG encoded
    const hammerCursor = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23ef4444' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9'/><path d='M17.64 15L22 10.64'/><path d='M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25V3.67c0-.73.52-1.35 1.24-1.48a.85.85 0 0 0 .17-1.57A3.2 3.2 0 0 0 17 3c-1.05 0-2.09.4-2.9 1.2l-1.25 1.25'/></svg>") 16 16, auto`;
    
    document.body.style.cursor = newState ? hammerCursor : 'auto';

    // Sound Effect (Low Roar / Mechanical Hum)
    if (newState) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        // Low frequency saw for "roar"
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.5);
        
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 1.5);
      } catch (e) {
        console.error("Audio context blocked or not supported", e);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 md:p-8 relative overflow-hidden">
      {/* Glitch Style */}
      <style>{`
        @keyframes glitch-anim {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }
        .glitch-text:hover {
          animation: glitch-anim 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
          color: #ef4444;
        }
        @keyframes float-up {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            100% { transform: translateY(-50px) scale(1.5); opacity: 0; }
        }
      `}</style>

      {/* Header */}
      <header className="text-center pointer-events-auto z-20 relative">
        <h1 className="text-4xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-green-200 to-green-800 drop-shadow-lg tracking-wider opacity-90" style={{ fontFamily: '"Cinzel", serif' }}>
          ISLA FÓSIL
        </h1>
        <p className="text-green-400/60 text-[10px] md:text-sm tracking-[0.5em] mt-2 uppercase font-light">
          Zona de Exclusión - Sector Neblinoso
        </p>
      </header>

      {/* Hammond Center Panel (Right Side) */}
      <aside className="absolute right-0 top-1/2 -translate-y-1/2 w-72 md:w-80 bg-gradient-to-br from-neutral-900 via-stone-900 to-black border-l-4 border-stone-700/50 p-6 pointer-events-auto shadow-2xl rounded-l-xl overflow-hidden group z-30">
         {/* "Rusty" overlay texture effect */}
         <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" 
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
         </div>
         
         <div className="relative z-10 font-mono flex flex-col gap-6 h-full">
            {/* Logo Section */}
            <div className="border-b border-stone-700/50 pb-4">
                <h2 className="text-lg font-bold text-stone-400 tracking-tighter leading-none glitch-text cursor-default transition-colors">
                    HAMMOND <br/>
                    <span className="text-red-800/80 group-hover:text-red-600 transition-colors">GENETICS</span>
                </h2>
                <div className="mt-1 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 animate-pulse rounded-full"></div>
                    <span className="text-[9px] text-stone-500 uppercase tracking-widest">Conexión Segura</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="space-y-5">
                {/* Money */}
                <div className="relative">
                    <label className="text-[10px] text-green-700 uppercase font-bold block mb-1">Financiamiento</label>
                    <div className="text-2xl text-green-400 font-bold tracking-widest font-mono border-b border-green-900/30 pb-1 relative">
                        ${money.toLocaleString()}
                        
                        {/* Floating Cash Animation */}
                        {floatingCash.map(cash => (
                            <span 
                                key={cash.id}
                                className="absolute text-green-300 text-sm pointer-events-none"
                                style={{
                                    left: `${cash.left}%`,
                                    top: 0,
                                    animation: `float-up ${cash.animationDuration}s ease-out forwards`
                                }}
                            >
                                $
                            </span>
                        ))}
                    </div>
                </div>

                {/* Security */}
                <div>
                    <div className="flex justify-between text-[10px] text-green-700 uppercase mb-1 font-bold">
                        <span>Seguridad</span>
                        <span className="animate-pulse text-red-400">100%</span>
                    </div>
                    {/* Blinking Bar */}
                    <div className="h-3 bg-black rounded-sm border border-stone-600 p-[1px] flex gap-[1px]">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="h-full flex-1 bg-green-600 opacity-80 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                        ))}
                    </div>
                </div>

                 {/* Happiness */}
                 <div>
                    <div className="flex justify-between text-[10px] text-green-700 uppercase mb-1 font-bold">
                        <span>Satisfacción</span>
                        <span className="text-yellow-500">80%</span>
                    </div>
                    <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-700 to-yellow-500 w-[80%] shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
                <button 
                    onClick={handleCloning}
                    className={`
                        w-full py-4 border-2 uppercase tracking-widest text-xs font-bold transition-all duration-200
                        relative overflow-hidden group/btn
                        ${isCloning 
                            ? 'border-red-500 text-red-500 bg-red-900/10 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                            : 'border-stone-600 text-stone-400 hover:border-green-500 hover:text-green-400 hover:bg-green-900/10'
                        }
                    `}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {isCloning && <span className="animate-spin">⚠️</span>}
                        {isCloning ? 'CANCELAR' : 'INICIAR CLONACIÓN'}
                    </span>
                    {/* Scanline on button hover */}
                    <div className="absolute inset-0 bg-white/5 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
                </button>
            </div>
         </div>
      </aside>

      {/* Bottom Status/Stats */}
      <footer className="flex justify-between items-end text-green-100/50 font-mono text-xs pointer-events-auto z-20">
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-sm border-l-2 border-green-800/50">
          <p className="mb-1"><strong className="text-green-500">COORDS:</strong> 14.5°N, 92.3°W</p>
          <p className="mb-1"><strong className="text-green-500">ATMOS:</strong> 98% HUMEDAD</p>
          <p><strong className="text-green-500">GRID:</strong> {isCloning ? 'ACTIVO' : 'INACTIVO'}</p>
        </div>

        <div className="text-right hidden md:block">
          <p className="opacity-50">Three.js R3F Render Engine</p>
          <p className="opacity-50">Procedural Generation: Active</p>
        </div>
      </footer>
    </div>
  );
};