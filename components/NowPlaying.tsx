"use client";

import { useEffect, useState } from "react";

interface NowPlayingData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

export default function NowPlaying() {
  const [data, setData] = useState<NowPlayingData>({ isPlaying: false });

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch("/api/spotify/now-playing");
        const nowPlaying = await response.json();
        setData(nowPlaying);
      } catch (error) {
        console.error("Error fetching now playing:", error);
      }
    };

    fetchNowPlaying();
    // Aggiorna ogni 30 secondi
    const interval = setInterval(fetchNowPlaying, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!data.isPlaying) {
    return (
      <div className="text-sm text-neutral-600 dark:text-neutral-400 italic opacity-70">
        Not listening to anything right now
      </div>
    );
  }

  return (
    <a
      href={data.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
    >
      {data.albumImageUrl && (
        <img
          src={data.albumImageUrl}
          alt={data.album}
          className="w-12 h-12 rounded"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
          {data.title}
        </div>
        <div className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
          {data.artist}
        </div>
      </div>
      <div className="flex-shrink-0">
        <svg className="w-4 h-4 text-green-500 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
        </svg>
      </div>
    </a>
  );
}
