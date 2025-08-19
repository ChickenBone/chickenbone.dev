import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import React from 'react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  onPlayPause: () => void;
  timestamps: string[];
  currentTimeIndex: number | null;
  onSliderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PlaybackControls({
  isPlaying,
  isLoading,
  onPlayPause,
  timestamps,
  currentTimeIndex,
  onSliderChange,
}: PlaybackControlsProps) {
  if (timestamps.length === 0 || currentTimeIndex === null) return null;
  return (
    <div className="p-4 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-sm rounded-b-lg text-zinc-900 dark:text-white border border-zinc-200/60 dark:border-white/10">
      {/* <div className="flex items-center justify-between mb-2">
        <button
          onClick={onPlayPause}
          className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          disabled={isLoading}
        >
          {isPlaying ? <PauseIcon className="h-5 w-5 text-white" /> : <PlayIcon className="h-5 w-5 text-white" />}
        </button>
        <div className="text-sm font-medium text-right">
          {new Date(timestamps[currentTimeIndex]).toLocaleString()}
        </div>
      </div> */}
      <input
        id="time-slider"
        type="range"
        min="0"
        max={timestamps.length - 1}
        value={currentTimeIndex}
        onChange={onSliderChange}
        disabled={isLoading}
        className="w-full h-2 bg-gray-300 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:bg-white"
      />
    </div>
  );
}
