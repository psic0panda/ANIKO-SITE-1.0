'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useSensory } from '@/context/SensoryContext';

const AVATARS = [
  "avatar_bear.png", "avatar_bird.png", "avatar_cat.png", "avatar_dog.png",
  "avatar_elephant.png", "avatar_fox.png", "avatar_giraffe.png", "avatar_koala.png",
  "avatar_lion.png", "avatar_monkey.png", "avatar_panda.png", "avatar_rabbit.png",
  "avatar_tiger.png", "avatar_turtle.png", "avatar_whale.png", "avatar_aniko.png"
];

const Scribble = ({ style, isSensory }: { style: React.CSSProperties, isSensory: boolean }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={`absolute pointer-events-none opacity-[0.08] transition-opacity duration-1000 ${isSensory ? 'opacity-[0.02]' : ''}`}
    style={style}
  >
    <path 
      d="M10,50 Q25,25 50,50 T90,50" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      className="animate-scribble"
    />
  </svg>
);

export default function BackgroundDecor() {
  const { isSensoryFriendly } = useSensory();
  const [elements, setElements] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ 
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const initialElements = [];
    // Avatars
    for (let i = 0; i < 15; i++) {
      initialElements.push({
        id: `avatar-${i}`,
        type: 'avatar' as const,
        src: AVATARS[Math.floor(Math.random() * AVATARS.length)],
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 50 + Math.random() * 100,
        delay: Math.random() * -20,
        duration: 20 + Math.random() * 20,
        depth: 0.2 + Math.random() * 0.8
      });
    }

    // Scribbles
    const colors = ['var(--color-primary)', 'var(--color-warmth)', 'var(--color-accent)', 'var(--color-secondary)'];
    for (let i = 0; i < 12; i++) {
      initialElements.push({
        id: `scribble-${i}`,
        type: 'scribble' as const,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 150 + Math.random() * 300,
        color: colors[Math.floor(Math.random() * colors.length)],
        depth: 0.1 + Math.random() * 0.4
      });
    }
    setElements(initialElements);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-background transition-colors duration-1000">
      <div className="crayon-texture" />
      
      {elements.map((el) => {
        const parallaxX = isSensoryFriendly ? 0 : mousePos.x * el.depth;
        const parallaxY = isSensoryFriendly ? 0 : mousePos.y * el.depth;

        return el.type === 'avatar' ? (
          <div
            key={el.id}
            className={`absolute animate-float-slow transition-transform duration-1000 ease-out grayscale hover:grayscale-0 ${isSensoryFriendly ? 'opacity-[0.02]' : 'opacity-[0.05]'}`}
            style={{
              top: `${el.top}%`,
              left: `${el.left}%`,
              width: `${el.size}px`,
              height: `${el.size}px`,
              animationDelay: `${el.delay}s`,
              animationDuration: `${el.duration}s`,
              transform: `translate(${parallaxX}px, ${parallaxY}px)`,
            }}
          >
            <Image
              src={`/assets/avatars/${el.src}`}
              alt=""
              width={el.size}
              height={el.size}
              className="object-contain"
            />
          </div>
        ) : (
          <Scribble
            key={el.id}
            isSensory={isSensoryFriendly}
            style={{
              top: `${el.top}%`,
              left: `${el.left}%`,
              width: `${el.size}px`,
              height: `${el.size}px`,
              color: el.color,
              transform: `translate(${parallaxX}px, ${parallaxY}px)`,
            }}
          />
        );
      })}
    </div>
  );
}
