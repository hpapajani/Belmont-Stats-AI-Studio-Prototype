import React, { useState } from "react";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export default function Logo({ className = "", size = 48, showText = true }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} style={{ height: size }}>
      {!imageError ? (
        <img
          src="/logo.png"
          alt="Belmont Marauders Logo"
          onError={() => setImageError(true)}
          style={{ width: size, height: size, objectFit: "contain" }}
          className="shrink-0 drop-shadow-md rounded-lg"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div 
          className="flex items-center justify-center bg-belmont-navy text-white font-extrabold rounded-full border-4 border-belmont-maroon shrink-0 shadow-lg font-mono leading-none"
          style={{ 
            width: size, 
            height: size, 
            fontSize: size * 0.5,
            boxShadow: "0 0 10px rgba(107, 15, 26, 0.4)"
          }}
        >
          B
        </div>
      )}
      {showText && (
        <span className="athletic-title font-bold text-xl md:text-2xl text-white tracking-widest whitespace-nowrap flex flex-col items-start leading-tight">
          <span className="text-[9px] text-amber-400 font-mono tracking-widest font-extrabold -mb-1">Marauders</span>
          <span>BELMONT <span className="text-belmont-maroon-light">STATS</span></span>
        </span>
      )}
    </div>
  );
}
