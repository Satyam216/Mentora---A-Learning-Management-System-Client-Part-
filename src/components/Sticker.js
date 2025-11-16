// src/components/Sticker.js
'use client';
export default function Sticker({ src, alt = '', className = '' }) {
  return (
    <div className={`rounded-xl overflow-hidden shadow-md ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}
