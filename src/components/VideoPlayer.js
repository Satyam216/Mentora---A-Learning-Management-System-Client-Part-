'use client';
import { useEffect, useRef } from 'react';

export default function VideoPlayer({ src, onProgress }) {
  const ref = useRef();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const onTime = () => {
      if (onProgress) onProgress(Math.floor(video.currentTime));
    };
    video.addEventListener('timeupdate', onTime);
    return () => video.removeEventListener('timeupdate', onTime);
  }, [onProgress]);

  return <video ref={ref} src={src} controls className="w-full aspect-video rounded-xl bg-black" />;
}
