"use client";

import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-stone-900/95 backdrop-blur-md border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Progress bar */}
        <div className="h-1 -mt-0.5 bg-stone-800 rounded-full overflow-hidden">
          <div className="h-full w-[35%] bg-gradient-to-r from-amber-600 to-amber-500 rounded-full" />
        </div>

        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          {/* Left — Currently Playing */}
          <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial sm:w-1/4">
            <div className="w-10 h-10 rounded-lg bg-stone-800 flex-shrink-0 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                </svg>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">Featured Mix</p>
              <p className="text-stone-500 text-xs truncate">Universal Music Hub</p>
            </div>
          </div>

          {/* Center — Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="text-stone-500 hover:text-white transition-colors hidden sm:block">
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-600 hover:bg-amber-500 flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg shadow-amber-900/40"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-stone-950" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-stone-950 ml-0.5" />
              )}
            </button>
            <button className="text-stone-500 hover:text-white transition-colors hidden sm:block">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Right — Volume & Time */}
          <div className="hidden sm:flex items-center gap-3 w-1/4 justify-end">
            <Volume2 className="w-4 h-4 text-stone-500" />
            <div className="w-20 h-1 bg-stone-800 rounded-full overflow-hidden">
              <div className="h-full w-[70%] bg-stone-500 rounded-full" />
            </div>
            <span className="text-stone-600 text-xs font-mono">1:23 / 3:45</span>
          </div>
        </div>
      </div>
    </div>
  );
}
