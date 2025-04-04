'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { useStats } from '@/hooks/useStats';
import '@/app/globals.css';
import { Button } from '../button';
import Link from 'next/link';
import TopicDialog from './TopicDialog';


// Add these interfaces at the top of the file
interface VantaEffect {
  destroy: () => void;
}

interface VantaWaves {
  WAVES: (config: {
    el: HTMLDivElement;
    THREE: unknown;
    color: number;
    waveHeight: number;
    shininess: number;
    waveSpeed: number;
    zoom: number;
    mouseControls: boolean;
    touchControls: boolean;
    gyroControls: boolean;
  }) => VantaEffect;
}

const HeroSection = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [effect, setEffect] = useState<VantaEffect | null>(null);
  const [mounted, setMounted] = useState(false);
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);
  const stats = useStats();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !mounted) return;

    const loadEffect = async () => {
      try {
        await new Promise<void>((resolve) => {
          if (!(window as Window & typeof globalThis & { THREE?: unknown }).THREE) {
            const threeScript = document.createElement('script');
            threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
            threeScript.onload = () => resolve();
            document.head.appendChild(threeScript);
          } else {
            resolve();
          }
        });

        await new Promise<void>((resolve) => {
          if (!(window as Window & typeof globalThis & { VANTA?: unknown }).VANTA) {
            const vantaScript = document.createElement('script');
            vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.waves.min.js';
            vantaScript.onload = () => resolve();
            document.head.appendChild(vantaScript);
          } else {
            resolve();
          }
        });

        const isDark = resolvedTheme === 'dark';
        const waveColor = isDark ? 0x000f0f : 0xd8bfd8; // Lighter color for light mode

        if (vantaRef.current && (window as Window & typeof globalThis & { VANTA: unknown }).VANTA) {
          const vantaEffect = (window as unknown as { VANTA: VantaWaves }).VANTA.WAVES({
            el: vantaRef.current,
            THREE: (window as unknown as { THREE: unknown }).THREE,
            color: waveColor,
            waveHeight: isDark ? 15 : 14,
            shininess: isDark ? 80 : 50,
            waveSpeed: 1.2,
            zoom: 1,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
          });
          setEffect(vantaEffect);
        }
      } catch (error) {
        console.error('Failed to load Vanta effect:', error);
      }
    };

    if (effect) {
      console.log('Destroying previous VANTA effect');
      effect.destroy();
      setEffect(null);
    }

    loadEffect();
  }, [resolvedTheme, mounted]);

  useEffect(() => {
    return () => {
      if (effect) {
        console.log('Destroying VANTA effect on unmount');
        effect.destroy();
      }
    };
  }, [effect]);

  if (!mounted) {
    return (
      <section className="h-screen w-full relative bg-slate-300">
        <div className="container relative mx-auto flex h-full flex-col items-center justify-center px-4 py-24">
          <div className="flex-1 space-y-8 text-center">
            <h1 className="text-4xl font-bold">
              Explore the World of{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Tech
              </span>
            </h1>
          </div>
        </div>
      </section>
    );
  }


  return (
    <section
      ref={vantaRef}
      className={`h-screen w-full relative ${
        resolvedTheme === 'dark' ? 'bg-gray-900' : 'bg-slate-50'
      } transition-colors duration-300`}
    >
      <div className="container relative mx-auto flex flex-col items-center justify-evenly h-full px-4 py-8 space-y-8">
        {/* Top Section: Text and Buttons */}
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Text Content */}
          <div className="space-y-4 text-center md:text-left">
            <h1 className={`${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'} text-4xl md:text-5xl font-bold font-big-shoulders`}>
              Dive into the Future of{' '}
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text font-extrabold">
                Technology
              </span>
            </h1>
            <p className={`${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-700'} text-lg md:text-xl max-w-2xl font-big-shoulders`}>
              Unravel the latest trends, groundbreaking innovations, and expert insights shaping the tech universe.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-center md:justify-end items-center gap-4">
            <Link href="/articles">
              <Button>Start Reading</Button>
            </Link>
            <Button variant="outline" onClick={() => setTopicDialogOpen(true)}>Explore Topics</Button>
            <TopicDialog open={topicDialogOpen} onOpenChange={setTopicDialogOpen} />
          </div>
        </div>

        {/* Grid */}
        <div className={`w-full mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 ${
          resolvedTheme === 'dark' 
            ? 'bg-white/10 border-purple-400/50' 
            : 'bg-black/10 border-purple-700/50'
        } p-8 py-16 rounded-2xl border backdrop-blur-sm`}>
          <div className="space-y-2 text-center">
            <div className={`text-4xl max-lg:text-2xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{stats.totalArticles}+</div>
            <div className={`text-sm ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Published Articles</div>
          </div>
          <div className="space-y-2 text-center">
            <div className={`text-4xl max-lg:text-2xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{stats.totalWriters}+</div>
            <div className={`text-sm ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Expert Writers</div>
          </div>
          <div className="space-y-2 text-center">
            <div className={`text-4xl max-lg:text-2xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{stats.totalReaders}+</div>
            <div className={`text-sm ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Total Readers</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;