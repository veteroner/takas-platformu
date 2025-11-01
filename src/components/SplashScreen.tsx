'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';

export default function AppSplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  
  // Inline fallback styles so splash is visible even before CSS loads on native
  const inlineStyle = useMemo<React.CSSProperties>(() => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Gradient fallback
    background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #4f46e5 100%)',
  }), []);

  useEffect(() => {
    // Native platformda Capacitor splash'i hemen gizle
    if (Capacitor.isNativePlatform()) {
      SplashScreen.hide({ fadeOutDuration: 0 }).catch(() => {
        // Ignore error
      });
    }

    // Native'de CSS/font yüklenmesi gecikebilir. En az süre + yüklemeyi bekle.
    const MIN_DURATION = Capacitor.isNativePlatform() ? 3000 : 2000;

    let isMounted = true;
    const waitForFonts = (async () => {
      try {
        const anyDoc = document as any;
        if (anyDoc?.fonts?.ready) {
          await anyDoc.fonts.ready;
        }
      } catch {
        /* noop */
      }
    })();

    const waitForLoad = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') return resolve();
      const onLoad = () => {
        window.removeEventListener('load', onLoad);
        resolve();
      };
      window.addEventListener('load', onLoad);
    });

    const minTimer = new Promise<void>((resolve) => setTimeout(resolve, MIN_DURATION));

    Promise.race([Promise.all([waitForFonts, waitForLoad, minTimer])]).finally(() => {
      if (isMounted) setIsVisible(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          // Tailwind sınıfları yüklenmeden önce de görünür olması için inline style veriyoruz
          style={inlineStyle}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600"
        >
          {/* Animated Background Circles */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/20 rounded-full blur-3xl"
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1]
              }}
              className="mb-8"
            >
              {/* Exchange Icon */}
              <div className="relative w-24 h-24 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center border-2 border-white/40 shadow-2xl">
                {/* Two arrows forming exchange symbol */}
                <svg 
                  className="w-14 h-14 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Top arrow pointing right */}
                  <motion.path
                    d="M5 9 L15 9 M15 9 L12 6 M15 9 L12 12"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                  {/* Bottom arrow pointing left */}
                  <motion.path
                    d="M19 15 L9 15 M9 15 L12 12 M9 15 L12 18"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </svg>
                
                {/* Pulsing glow effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-white/40 rounded-3xl blur-xl"
                />
              </div>
            </motion.div>

            {/* App Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl font-black text-white mb-3 tracking-tight"
            >
              TAKAS
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-white/90 text-lg font-medium"
            >
              Takas yap, mutlu ol
            </motion.p>

            {/* Loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex gap-2 mt-8"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut"
                  }}
                  className="w-2 h-2 bg-white rounded-full"
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
