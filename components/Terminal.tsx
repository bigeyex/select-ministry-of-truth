import React, { useEffect, useRef } from 'react';

interface TerminalProps {
  children: React.ReactNode;
  className?: string;
}

export const Terminal: React.FC<TerminalProps> = ({ children, className = '' }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [children]);

  return (
    <div className={`relative w-full h-full bg-crt-black border-2 border-crt-green-dim rounded-lg overflow-hidden flex flex-col shadow-[0_0_20px_rgba(51,255,51,0.2)] ${className}`}>
      {/* Scanlines and Overlay are handled globally in index.html styles for body, but we can add specific layer here if needed */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
      
      <div className="flex items-center justify-between bg-crt-green-dim/20 p-2 border-b border-crt-green-dim">
        <span className="text-xs font-mono text-crt-green tracking-widest uppercase">TERM_ACCESS_V.19.84</span>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-crt-green animate-pulse"></div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto font-mono text-lg space-y-4">
        {children}
      </div>
    </div>
  );
};

export const Typewriter: React.FC<{ text: string; speed?: number; onComplete?: () => void }> = ({ text, speed = 20, onComplete }) => {
  const [displayed, setDisplayed] = React.useState('');
  
  React.useEffect(() => {
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]); // Removed onComplete from dependency to avoid loop if parent recreates it

  return <span>{displayed}</span>;
};
