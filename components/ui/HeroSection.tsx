'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Vanta to ensure it only runs on the client
const Vanta = dynamic(() => import('vanta/dist/vanta.birds.min'), { ssr: false });

const HeroSection = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = React.useState(null);

  useEffect(() => {
    if (!vantaEffect && typeof window !== 'undefined') {
      setVantaEffect(
        Vanta({
          el: vantaRef.current,
          THREE: window.THREE, // Ensure THREE.js is available
          // You can customize the Vanta effect here
          backgroundColor: 0x000000,
          color1: 0x1e90ff,
          color2: 0x00ff00,
          birdSize: 1.5,
          speedLimit: 5.0,
          separation: 50.0,
          alignment: 50.0,
          cohesion: 50.0,
        })
      );
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div ref={vantaRef} style={{ height: '100vh', width: '100%' }}>
      <div className="hero-content">
        <h1 className="text-white text-4xl">Welcome to My Website</h1>
        <p className="text-white">This is a hero section with a Vanta.js background.</p>
      </div>
    </div>
  );
};

export default HeroSection;