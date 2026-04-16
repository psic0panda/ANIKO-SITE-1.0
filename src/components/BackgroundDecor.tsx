"use client";

import Image from "next/image";
import { useState } from "react";

const AVATARS = [
  "avatar_bear.png", "avatar_bird.png", "avatar_cat.png", "avatar_dog.png",
  "avatar_elephant.png", "avatar_fox.png", "avatar_giraffe.png", "avatar_koala.png",
  "avatar_lion.png", "avatar_monkey.png", "avatar_panda.png", "avatar_rabbit.png",
  "avatar_tiger.png", "avatar_turtle.png", "avatar_whale.png", "avatar_aniko.png"
];

const Scribble = ({ style }: { style: React.CSSProperties }) => (
  <svg 
    viewBox="0 0 100 100" 
    className="absolute pointer-events-none opacity-10" 
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
  const [elements] = useState(() => {
    const initialElements = [];
    
    // Gerar Avatars
    for (let i = 0; i < 12; i++) {
      initialElements.push({
        id: i,
        type: 'avatar' as const,
        src: AVATARS[Math.floor(Math.random() * AVATARS.length)],
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: 40 + Math.random() * 80,
        delay: `${Math.random() * -20}s`,
        duration: `${15 + Math.random() * 10}s`
      });
    }

    // Gerar Rabiscos
    const colors = ['#003d6d', '#ffa646', '#56e0a3', '#a9dff5'];
    for (let i = 0; i < 10; i++) {
        initialElements.push({
        id: i + 20,
        type: 'scribble' as const,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: 100 + Math.random() * 200,
        delay: `${Math.random() * -5}s`,
        duration: '0s',
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    return initialElements;
  });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute inset-0 crayon-texture" />
      
      {elements.map((el) => (
        el.type === 'avatar' ? (
          <div
            key={el.id}
            className="absolute animate-float-slow opacity-[0.04] grayscale hover:grayscale-0 transition-all duration-700"
            style={{
              top: el.top,
              left: el.left,
              width: `${el.size}px`,
              height: `${el.size}px`,
              animationDelay: el.delay,
              animationDuration: el.duration
            }}
          >
            <Image
              src={`/assets/avatars/${el.src}`}
              alt="Background Decor"
              width={el.size}
              height={el.size}
              className="object-contain"
            />
          </div>
        ) : (
          <Scribble
            key={el.id}
            style={{
              top: el.top,
              left: el.left,
              width: `${el.size}px`,
              height: `${el.size}px`,
              color: el.color
            }}
          />
        )
      ))}
    </div>
  );
}
