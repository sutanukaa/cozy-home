'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CozyBubbleButton from '@/components/ui/CozyBubbleButton';
import { soundscape } from '@/lib/soundEngine';

const YOUTUBE_VIDEO_ID = 'eu2h6mKAFTM';

export default function StudioHeadphoneAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Send postMessage commands to the YouTube iframe
  const sendCommand = useCallback((func: 'playVideo' | 'pauseVideo' | 'stopVideo') => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    try {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args: [] }),
        '*'
      );
    } catch {
      // Cross-origin message safety
    }
  }, []);

  const toggleMusic = useCallback(() => {
    soundscape.playClickSound();

    if (!hasLoaded) {
      // First click: mount iframe with autoplay
      setHasLoaded(true);
      setIsPlaying(true);
    } else if (isPlaying) {
      sendCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      sendCommand('playVideo');
      setIsPlaying(true);
    }
  }, [hasLoaded, isPlaying, sendCommand]);

  // Sync state with YouTube iframe events
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        if (typeof e.data === 'string') {
          const data = JSON.parse(e.data);
          if (data.event === 'infoDelivery' && data.info && typeof data.info.playerState === 'number') {
            // 1 = playing, 2 = paused, 0 = ended
            if (data.info.playerState === 1) setIsPlaying(true);
            else if (data.info.playerState === 2 || data.info.playerState === 0) setIsPlaying(false);
          }
        }
      } catch {
        // Ignore non-JSON messages
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Clean up and stop music when leaving the studio room
  useEffect(() => {
    return () => {
      sendCommand('stopVideo');
    };
  }, [sendCommand]);

  return (
    <>
      {/* Hidden YouTube Iframe Audio Player */}
      {hasLoaded && (
        <iframe
          ref={iframeRef}
          id="studio-lofi-player"
          title="Studio Lo-fi Background Music"
          src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&autoplay=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&controls=0`}
          allow="autoplay; encrypted-media"
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute -top-[9999px] -left-[9999px] h-1 w-1 opacity-0"
        />
      )}

      {/* Headphone Hotspot Button on the desk stand */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto select-none z-20"
        style={{
          left: '37.0%',
          top: '48.0%',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CozyBubbleButton
          label={isPlaying ? 'Pause lo-fi music' : 'Play lo-fi background music'}
          onClick={toggleMusic}
          isActive={isPlaying}
          showTooltip={false}
          icon={
            <svg
              className={`h-4 w-4 drop-shadow-sm text-white transition-transform duration-300 ${
                isPlaying ? 'scale-110' : 'group-hover:scale-105'
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </svg>
          }
        >
          {/* Animated audio equalizer bars when playing */}
          {isPlaying && (
            <span className="absolute bottom-1 flex items-end gap-0.5">
              <span className="h-1.5 w-0.5 animate-pulse rounded-full bg-white" style={{ animationDuration: '0.4s' }} />
              <span className="h-2.5 w-0.5 animate-pulse rounded-full bg-white" style={{ animationDuration: '0.6s' }} />
              <span className="h-1.5 w-0.5 animate-pulse rounded-full bg-white" style={{ animationDuration: '0.5s' }} />
            </span>
          )}
        </CozyBubbleButton>

        {/* Hover / Status Tooltip Bubble */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 2, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 z-30 whitespace-nowrap"
            >
              <div className="relative rounded-full border border-pink-300 bg-white/95 px-3 py-1 font-mono text-[11px] font-bold text-accent shadow-md backdrop-blur-xs dark:border-pink-500/50 dark:bg-[#2A1828]/95 dark:text-pink-200">
                <span>{isPlaying ? 'Lo-fi beats playing • Click to stop' : 'Click to play lo-fi beats'}</span>
                <span
                  aria-hidden
                  className="absolute left-1/2 -top-1 -translate-x-1/2 h-2 w-2 rotate-45 border-l border-t border-pink-300 bg-white dark:border-pink-500/50 dark:bg-[#2A1828]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
